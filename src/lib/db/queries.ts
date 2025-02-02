// eslint-disable-next-line simple-import-sort/imports
import "server-only";

import { prisma } from "../prisma";
import { Message } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

export async function getChatById({ id }: { id: string }) {
  try {
    console.log(id);

    const chat = await prisma.chat.findUnique({
      where: { id },
    });

    return chat;
  } catch (error) {
    console.error("Failed to find chat from database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await prisma.chat.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete chat from database");
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await prisma.message.findMany({
      where: {
        chatId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<Omit<Message, "updatedAt" | "createdAt">>;
}) {
  try {
    return await prisma.message.createMany({
      data: messages.map((msg) => ({
        chatId: msg.chatId,
        content: msg.content as InputJsonValue,
        id: msg.id,
        role: msg.role,
      })),
    });
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

type SaveChatData = {
  id: string;
  userId: string;
  title: string;
  model: string;
};

export async function saveChat({ id, userId, title, model }: SaveChatData) {
  try {
    return await prisma.chat.create({
      data: {
        id,
        createdAt: new Date(),
        userId,
        title,
        model,
        totalCosts: 0,
        totalTokens: 0,
      },
    });
  } catch (error) {
    console.error("Failed to save chat in database", error);
    throw error;
  }
}
