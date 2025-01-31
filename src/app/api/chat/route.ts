import { convertToCoreMessages, createDataStreamResponse, streamText } from "ai";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { threadMessagesSchema } from "@/lib/validation/thread-messages";

import { registry } from "./registry";

export const maxDuration = 59;

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { success, data: parsedData } = z.object({ id: z.string() }).safeParse(session.user);

  if (!success) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parsedData.id,
    },
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, ...body } = await req.json();

  const { threadId, model } = z
    .object({ threadId: z.string().optional(), model: z.string() })
    .parse(body);

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: registry.languageModel(model),
        messages: convertToCoreMessages(messages),

        async onFinish({ text }) {
          if (!threadId) {
            const { id } = await prisma.thread.create({
              data: {
                messages: [messages[messages.length - 1], { role: "assistant", content: text }],
                title: messages[messages.length - 1].content,
                ownerId: user.id,
                model,
                totalTokens: 0,
                totalCosts: 0,
              },
            });

            revalidateTag("threads");

            dataStream.writeData({ threadId: id });

            return;
          }

          dataStream.writeData({ threadId });

          const thread = await prisma.thread.findUnique({
            where: {
              id: threadId,
            },
          });

          if (!thread) {
            console.log("Thread not found");

            return;
          }

          const { success, data: storedMessages } = threadMessagesSchema.safeParse(thread.messages);

          if (!success) {
            console.log("Invalid messages");

            return;
          }

          const currentMessages = messages[messages.length - 1];

          const combinedMessages = [...storedMessages, currentMessages];

          await prisma.thread.update({
            where: {
              id: threadId,
            },
            data: {
              messages: [...combinedMessages, { role: "assistant", content: text }],
            },
          });

          revalidateTag("threads");
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
  });

  // return result.toDataStreamResponse({ data });
}
