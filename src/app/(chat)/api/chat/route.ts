import {
  createDataStreamResponse,
  type Message,
  smoothStream,
  streamText,
} from "ai";

import { auth } from "@/auth";
import { modelRegistry } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import { getWeather } from "@/lib/ai/tools/get-weather";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { prisma } from "@/lib/prisma";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";

import { generateTitleFromUserMessage } from "../../actions";

import { JsonValue } from "@prisma/client/runtime/library";

export const maxDuration = 60;

type AllowedTools = "getWeather";

const weatherTools: AllowedTools[] = ["getWeather"];
const allTools: AllowedTools[] = [...weatherTools];

export async function POST(req: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await req.json();

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

  console.log(await prisma.chat.findMany());

  // const chat = await getChatById({ id });
  const chat = await prisma.chat.findUnique({
    where: { id },
  });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });

    console.log(`Generated title: ${title}`);

    await saveChat({
      id,
      userId: session.user.id,
      title: userMessage.content,
      model: model.id,
    });
  }

  await saveMessages({
    messages: [{ ...userMessage, chatId: id }],
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
              const responseMessagesWithoutIncompleteToolCalls =
                sanitizeResponseMessages(response.messages);

              await saveMessages({
                messages: responseMessagesWithoutIncompleteToolCalls.map(
                  (message) => {
                    return {
                      id: message.id,
                      chatId: id,
                      role: message.role as string,
                      content: message.content as JsonValue,
                      createdAt: new Date(),
                    };
                  }
                ),
              });
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

// export async function POST(req: Request) {
//   const session = await auth();

//   if (!session) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const { success, data: parsedData } = z
//     .object({ id: z.string() })
//     .safeParse(session.user);

//   if (!success) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       id: parsedData.id,
//     },
//   });

//   if (!user) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const { messages, ...body } = await req.json();

//   console.log(messages);

//   const { threadId, model } = z
//     .object({ threadId: z.string().optional(), model: z.string() })
//     .parse(body);

//   return createDataStreamResponse({
//     execute: (dataStream) => {
//       const result = streamText({
//         model: registry.languageModel(model),
//         messages: convertToCoreMessages(messages),
//         experimental_transform: smoothStream({
//           delayInMs: 15,
//           chunking: "word",
//         }),

//         async onFinish({ text }) {
//           if (!threadId) {
//             const { id } = await prisma.chat.create({
//               data: {
//                 messages: [
//                   messages[messages.length - 1],
//                   { role: "assistant", content: text },
//                 ],
//                 title: messages[messages.length - 1].content,
//                 ownerId: user.id,
//                 model,
//                 totalTokens: 0,
//                 totalCosts: 0,
//               },
//             });

//             revalidateTag("threads");

//             dataStream.writeData({ threadId: id });

//             return;
//           }

//           dataStream.writeData({ threadId });

//           const chat = await prisma.chat.findUnique({
//             where: {
//               id: threadId,
//             },
//           });

//           if (!chat) {
//             console.log("Chat not found");

//             return;
//           }

//           const { success, data: storedMessages } =
//             chatMessagesSchema.safeParse(chat.messages);

//           if (!success) {
//             console.log("Invalid messages");

//             return;
//           }

//           const currentMessages = messages[messages.length - 1];

//           const combinedMessages = [...storedMessages, currentMessages];

//           await prisma.chat.update({
//             where: {
//               id: threadId,
//             },
//             data: {
//               messages: [
//                 ...combinedMessages,
//                 { role: "assistant", content: text },
//               ],
//             },
//           });

//           revalidateTag("threads");
//         },
//       });

//       result.mergeIntoDataStream(dataStream);
//     },
//   });
// }

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
