import { generateText, Message } from "ai";

import { openai } from "@ai-sdk/openai";

const system =
  "Seja um gerador de títulos para chats. Receba um input e crie um título objetivo e conciso composto por palavras-chave relacionadas ao tema, no mesmo idioma do input. Responda apenas com o título gerado, sem adicionar explicações ou comentários.";

export async function generateThreadTitle(initialMessage: Message) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system,
    prompt: `input: ${initialMessage.content}`,
    temperature: 0.9,
  });

  return text;
}
