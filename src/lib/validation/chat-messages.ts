import { z } from "zod";

export const chatMessagesSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })
);

export type ChatMessages = z.infer<typeof chatMessagesSchema>;
