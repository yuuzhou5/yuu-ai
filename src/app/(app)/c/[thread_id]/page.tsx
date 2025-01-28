import { Message } from "ai";
import { notFound } from "next/navigation";

import Chat from "@/components/chat";
import { prisma } from "@/lib/prisma";
import { threadMessagesSchema } from "@/lib/validation/thread-messages";

type ThreadPageProps = {
  params: Promise<{
    thread_id: string;
  }>;
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { thread_id } = await params;

  const thread = await prisma.thread.findUnique({
    where: {
      id: thread_id,
    },
  });

  if (!thread) {
    return notFound();
  }

  const { success, data: storedMessages } = threadMessagesSchema.safeParse(
    thread.messages
  );

  if (!success) {
    return notFound();
  }

  return <Chat initialMessages={storedMessages as Message[]} />;
}
