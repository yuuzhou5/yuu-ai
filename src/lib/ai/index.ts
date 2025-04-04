import { createProviderRegistry, customProvider } from "ai";

import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { google as originalGoogle } from "@ai-sdk/google";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { xai } from "@ai-sdk/xai";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const google = customProvider({
  languageModels: {
    "gemini-2.0-flash-exp": originalGoogle("gemini-2.0-flash-exp"),
    "gemini-2.0-flash-exp-search": originalGoogle("gemini-2.0-flash-exp", {
      useSearchGrounding: true,
    }),
  },
  fallbackProvider: originalGoogle,
});

export const modelRegistry = createProviderRegistry({
  deepseek,
  openai,
  google,
  groq,
  anthropic,
  xai,
});
