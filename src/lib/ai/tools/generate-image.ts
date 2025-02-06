import { experimental_generateImage, tool } from "ai";
import { z } from "zod";

import { openai } from "@ai-sdk/openai";
import { put } from "@vercel/blob";

export const generateImage = tool({
  description: "Generate an image",
  parameters: z.object({
    prompt: z.string().describe("The prompt to generate the image from"),
  }),
  execute: async ({ prompt }) => {
    try {
      const { image } = await experimental_generateImage({
        model: openai.image("dall-e-3"),
        size: "512x512",
        prompt,
      });

      const file = new Blob([image.uint8Array], { type: "image/png" });

      const data = await put(`yuu-ai-image-${Date.now()}`, file, {
        access: "public",
      });

      return {
        image: data.url,
        prompt,
      };
    } catch (error) {
      console.log(error);

      throw Error("Upload generated image failed.");
    }
  },
});
