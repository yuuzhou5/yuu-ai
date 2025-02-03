"use server";

import { generateText, Message } from "ai";
import { cookies } from "next/headers";

import { modelRegistry } from "@/lib/ai";
import { deleteMessagesByChatIdAfterTimestamp, getMessageById } from "@/lib/db/queries";

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("model-id", model);
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const message = await getMessageById({ id });

  if (!message) throw new Error("message not found. (deleteTrailingMessages.tsx)");

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function generateTitleFromUserMessage({ message }: { message: Message }) {
  const system = [
    "- you will generate a short title based on the first message a user begins a conversation with",
    "- ensure it is not more than 80 characters long",
    "- the title should be a summary of the user's message",
    "- do not use quotes or colons",
    "- The title should be generated in the same language as the message",
  ].join("\n");

  const { text: title } = await generateText({
    model: modelRegistry.languageModel("openai:gpt-4o-mini"),
    system,
    prompt: JSON.stringify(message),
  });

  return title;
}
