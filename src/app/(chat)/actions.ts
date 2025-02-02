"use server";

import { generateText, Message } from "ai";
import { cookies } from "next/headers";

import { modelRegistry } from "@/lib/ai";

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("model-id", model);
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  console.log("deleteTrailingMessages", id);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: modelRegistry.languageModel("openai:gpt-4o-mini"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}
