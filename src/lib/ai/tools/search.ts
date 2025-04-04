import { generateText, tool } from "ai";
import { z } from "zod";

import { google, GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google";

export const search = tool({
  description: "Search in the web. ",
  parameters: z.object({
    query: z.string().describe("The search query term"),
  }),
  execute: async ({ query }) => {
    const { providerMetadata } = await generateText({
      model: google("gemini-2.0-flash-001", { useSearchGrounding: true }),
      prompt: query,
    });

    const metadata = providerMetadata?.google as GoogleGenerativeAIProviderMetadata | undefined;

    if (!metadata) {
      return "Não foi possível encontrar resultados";
    }

    const grouding = metadata.groundingMetadata;

    const links = grouding?.groundingChunks?.map((chunk) => chunk.web);

    return metadata?.groundingMetadata?.groundingSupports?.map((item) => ({
      ...item,
      groundingChunkIndices: Array.isArray(item.groundingChunkIndices)
        ? item.groundingChunkIndices.map((index) => (links ?? [])[index] ?? null)
        : typeof item.groundingChunkIndices === "number"
        ? Array.isArray(links) && typeof item.groundingChunkIndices === "number"
          ? links[item.groundingChunkIndices]?.uri ?? null
          : null
        : null,
    }));
  },
});
