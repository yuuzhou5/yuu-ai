import { z } from "zod";

export const threadMessagesSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })
);

export type ThreadMessages = z.infer<typeof threadMessagesSchema>;
