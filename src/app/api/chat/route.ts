import { convertToCoreMessages, StreamData, streamText } from "ai";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { threadMessagesSchema } from "@/lib/validation/thread-messages";

import { generateThreadTitle } from "./generate-thread-title";

import { openai } from "@ai-sdk/openai";

export const maxDuration = 59;

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { success, data: parsedData } = z
    .object({ id: z.string() })
    .safeParse(session.user);

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

  console.log(body);

  const { threadId } = z
    .object({ threadId: z.string().optional() })
    .parse(body);

  const data = new StreamData();

  if (threadId) {
    data.append({ threadId });
  }

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToCoreMessages(messages),

    async onFinish({ text }) {
      if (!threadId) {
        const title = await generateThreadTitle(messages[messages.length - 1]);

        const { id } = await prisma.thread.create({
          data: {
            messages: [
              messages[messages.length - 1],
              { role: "assistant", content: text },
            ],
            title,
            ownerId: user.id,
            model: "gpt-4o-mini",
            totalTokens: 0,
            totalCosts: 0,
          },
        });

        data.append({ threadId: id });

        return data.close();
      }

      const thread = await prisma.thread.findUnique({
        where: {
          id: threadId,
        },
      });

      if (!thread) {
        console.log("Thread not found");

        return data.close();
      }

      const { success, data: storedMessages } = threadMessagesSchema.safeParse(
        thread.messages
      );

      if (!success) {
        console.log("Invalid messages");

        return data.close();
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

      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
