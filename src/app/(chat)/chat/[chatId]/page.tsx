import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import Chat from "@/components/chat";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { prisma } from "@/lib/prisma";
import { convertToUIMessages } from "@/lib/utils";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export async function generateMetadata({ params }: ChatPageProps) {
  const { chatId } = await params;

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
    },
  });

  return {
    title: chat?.title,
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  const chat = await getChatById({ id: chatId });

  if (!chat) {
    return notFound();
  }

  const session = await auth();

  const messagesFromDb = await getMessagesByChatId({
    id: chatId,
  });

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId = models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  return (
    <Chat
      id={chat.id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedModelId={selectedModelId}
      isReadonly={session?.user?.id !== chat.userId}
    />
  );
}
