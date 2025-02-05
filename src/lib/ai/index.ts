import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

import { deepseek } from "@ai-sdk/deepseek";
import { google } from "@ai-sdk/google";
import { createOpenAI, openai } from "@ai-sdk/openai";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const modelRegistry = createProviderRegistry({
  deepseek,
  openai,
  google,
  groq,
});
