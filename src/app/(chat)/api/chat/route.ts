import { createDataStreamResponse, type Message, smoothStream, streamText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

// import { generateTitleFromUserMessage } from "@/app/(chat)/actions";
import { auth } from "@/auth";
import { modelRegistry } from "@/lib/ai";
import { defineCapability, models } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import { generateImage } from "@/lib/ai/tools/generate-image";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { deleteChatById, getChatById, saveChat, saveMessages } from "@/lib/db/queries";
import { prisma } from "@/lib/prisma";
import { generateUUID, getMostRecentUserMessage, sanitizeResponseMessages } from "@/lib/utils";

import { generateTitleFromUserMessage } from "../../actions";

import { JsonValue } from "@prisma/client/runtime/library";

export const maxDuration = 60;

type AllowedTools = "getWeather" | "generateImage";

const weatherTools: AllowedTools[] = ["getWeather"];
const imageTools: AllowedTools[] = [];
const allTools: AllowedTools[] = [...weatherTools, ...imageTools];

type ChatRequestBody = {
  id: string;
  messages: Array<Message>;
  modelId: string;
  options?: { imageGeneration?: boolean };
};

export async function POST(req: Request) {
  const start = Date.now();

  const { id, messages, modelId, options }: ChatRequestBody = await req.json();

  console.time("session");
  const session = await auth();
  console.timeEnd("session");

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response("Model not found", { status: 404 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  console.time("getChatById");
  const chat = await getChatById({ id });
  console.timeEnd("getChatById");

  console.time("saveChat");
  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });

    await saveChat({
      id,
      userId: session.user.id,
      title,
      model: model.id,
    });
  }

  await saveMessages({
    messages: [
      {
        ...userMessage,
        chatId: id,
        annotations: [],
        experimental_attachments: userMessage.experimental_attachments as unknown as JsonValue[],
        reasoning: null,
      },
    ],
  });
  console.timeEnd("saveChat");

  return createDataStreamResponse({
    onError(error) {
      console.error(error);

      return "Error";
    },
    execute: (dataStream) => {
      const { can } = defineCapability(model);

      const tools = can("tool-calling") ? { getWeather, generateImage } : undefined;
      const experimental_telemetry = {
        isEnabled: true,
        functionId: "stream-text",
      };

      const formattedMessages = messages.map((m) => {
        if (m.role === "assistant" && m.toolInvocations) {
          m.toolInvocations.forEach((ti) => {
            if (ti.toolName === "generateImage" && ti.state === "result") {
              ti.result.image = `redacted-for-length`;
            }
          });
        }

        return m;
      });

      const result = streamText({
        model: modelRegistry.languageModel(model.apiIdentifier),
        messages: formattedMessages,
        maxSteps: options?.imageGeneration ? 1 : 5,
        system: systemPrompt,
        experimental_telemetry,
        experimental_activeTools: allTools,
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateUUID,

        toolChoice: options?.imageGeneration ? { type: "tool", toolName: "generateImage" } : "auto",
        tools,

        onFinish: async ({ response, usage, reasoning }) => {
          if (session.user?.id) {
            try {
              const responseMessagesWithoutIncompleteToolCalls = sanitizeResponseMessages(response.messages);

              const timeTaken = Date.now() - start;
              const annotations = {
                latency: timeTaken,
                model: model.id,
                usage,
              };

              console.time("saveMessages");
              await saveMessages({
                messages: responseMessagesWithoutIncompleteToolCalls.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role as string,
                    content: message.content as JsonValue,
                    annotations: [annotations],
                    experimental_attachments: [],
                    createdAt: new Date(),
                    reasoning: reasoning ? reasoning : null,
                  };
                }),
              });
              console.timeEnd("saveMessages");

              dataStream.writeMessageAnnotation(annotations);
            } catch (error) {
              console.log("[ERROR] /api/chat - Error:");
              console.log(error);

              console.error("Failed to save chat");
            }
          }
        },
      });

      result.mergeIntoDataStream(dataStream, { sendReasoning: true });
    },
  });
}

const AnnotationSchema = z.object({
  model: z.string(),
  latency: z.number(),
  usage: z
    .object({
      totalTokens: z.number().nullable(),
      promptTokens: z.number().nullable(),
      completionTokens: z.number().nullable(),
    })
    .optional(),
});

type Annotation = z.infer<typeof AnnotationSchema>;

type ModelReport = {
  sumLatency: number;
  count: number;
  sumPromptTokens: number;
  sumCompletionTokens: number;
};

type FinalReportEntry = {
  averageLatency: number;
  totalPromptTokens?: number;
  totalCompletionTokens?: number;
  cost?: number;
};

function processAnnotations(annotations: Annotation[]) {
  return annotations.reduce<Record<string, ModelReport>>((acc, { model, latency, usage }) => {
    if (!acc[model]) {
      acc[model] = { sumLatency: 0, count: 0, sumPromptTokens: 0, sumCompletionTokens: 0 };
    }

    acc[model].sumLatency += latency;
    acc[model].count += 1;

    if (usage?.promptTokens != null && usage?.completionTokens != null) {
      acc[model].sumPromptTokens += usage.promptTokens;
      acc[model].sumCompletionTokens += usage.completionTokens;
    }

    return acc;
  }, {});
}

function calculateFinalReport(latencyAndTokenReport: Record<string, ModelReport>) {
  const MILLION = 1_000_000;

  const pricingPerToken: Record<string, { input: number; output: number }> = {
    "o1-mini": {
      input: 1.1 / MILLION,
      output: 4.4 / MILLION,
    },
    "gpt-4o-mini": {
      input: 0.15 / MILLION,
      output: 0.6 / MILLION,
    },
    "gpt-4o": {
      input: 2.5 / MILLION,
      output: 10 / MILLION,
    },
    "gemini-2.0-flash-exp": {
      input: 0,
      output: 0,
    },
    "deepseek-reasoner": {
      input: 0.55 / MILLION,
      output: 2.19 / MILLION,
    },
    "deepseek-chat": {
      input: 0.14 / MILLION,
      output: 0.28 / MILLION,
    },
  };

  let totalCost = 0;

  const report = Object.fromEntries(
    Object.entries(latencyAndTokenReport).map(([model, data]) => {
      const pricing = pricingPerToken[model];
      const cost = (pricing?.input || 0) * data.sumPromptTokens + (pricing?.output || 0) * data.sumCompletionTokens;

      if (cost > 0) {
        totalCost += cost;
      }

      const reportEntry: FinalReportEntry = {
        averageLatency: data.sumLatency / data.count,
        totalPromptTokens: data.sumPromptTokens > 0 ? data.sumPromptTokens : undefined,
        totalCompletionTokens: data.sumCompletionTokens > 0 ? data.sumCompletionTokens : undefined,
        cost: cost > 0 ? cost : undefined,
      };

      return [model, reportEntry];
    })
  );

  return { ...report, totalCost };
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      select: { annotations: true },
    });
    const annotations = messages.flatMap((message) => message.annotations);
    const parsedAnnotations = annotations.map((annotation) => AnnotationSchema.parse(annotation));
    const latencyAndTokenReport = processAnnotations(parsedAnnotations);
    const finalReport = calculateFinalReport(latencyAndTokenReport);

    return NextResponse.json(finalReport);
  } catch (error) {
    console.error("Erro ao gerar o relatório de latência e tokens:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) return new Response("Chat not found.", { status: 404 });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    console.log("[DELETE] api/chat ERROR:");
    console.log(error);

    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
