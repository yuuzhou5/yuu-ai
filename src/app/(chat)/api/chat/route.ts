import { createDataStreamResponse, type Message, smoothStream, streamText } from "ai";

import { generateTitleFromUserMessage } from "@/app/(chat)/actions";
import { auth } from "@/auth";
import { modelRegistry } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { deleteChatById, getChatById, saveChat, saveMessages } from "@/lib/db/queries";
import { generateUUID, getMostRecentUserMessage, sanitizeResponseMessages } from "@/lib/utils";

import { JsonValue } from "@prisma/client/runtime/library";

export const maxDuration = 60;

type AllowedTools = "getWeather";

const weatherTools: AllowedTools[] = ["getWeather"];
const allTools: AllowedTools[] = [...weatherTools];

export async function POST(req: Request) {
  const start = Date.now();

  const { id, messages, modelId }: { id: string; messages: Array<Message>; modelId: string } = await req.json();

  const session = await auth();

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

  const chat = await getChatById({ id });

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
    messages: [{ ...userMessage, chatId: id, annotations: [] }],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: modelRegistry.languageModel(model.apiIdentifier),
        system: systemPrompt,
        messages,
        maxSteps: 5,
        experimental_activeTools: allTools,
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateUUID,
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
        tools: {
          getWeather,
        },
        onFinish: async ({ response }) => {
          if (session.user?.id) {
            try {
              const timeTaken = Date.now() - start;
              const responseMessagesWithoutIncompleteToolCalls = sanitizeResponseMessages(response.messages);
              const annotations = { latency: timeTaken, model: model.label };

              await saveMessages({
                messages: responseMessagesWithoutIncompleteToolCalls.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role as string,
                    content: message.content as JsonValue,
                    annotations: [annotations],
                    createdAt: new Date(),
                  };
                }),
              });

              dataStream.writeMessageAnnotation(annotations);
            } catch (error) {
              console.log("[ERROR] /api/chat - Error:");
              console.log(error);

              console.error("Failed to save chat");
            }
          }
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });
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
