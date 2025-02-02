import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

import { deepseek } from "@ai-sdk/deepseek";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export const modelRegistry = createProviderRegistry({
  deepseek,
  openai,
  google,
});
