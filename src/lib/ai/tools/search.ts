import { generateText, tool } from "ai";
import { z } from "zod";

import { google, GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google";

export const search = tool({
  description: "Search in the web",
  parameters: z.object({
    query: z.string().describe("The search query term"),
  }),
  execute: async ({ query }) => {
    const { providerMetadata } = await generateText({
      model: google("gemini-2.0-flash-001", { useSearchGrounding: true }),
      prompt: query,
    });

    const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;

    console.log(metadata?.groundingMetadata?.groundingChunks);

    return metadata?.groundingMetadata?.groundingSupports;
  },
});
