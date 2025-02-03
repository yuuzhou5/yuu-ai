// eslint-disable-next-line simple-import-sort/imports
import "server-only";

import { prisma } from "../prisma";
import { Message } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

export async function getChatById({ id }: { id: string }) {
  try {
    const chat = await prisma.chat.findFirst({
      where: { id },
    });

    return chat;
  } catch (error) {
    console.error("Failed to find chat from database");

    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }

    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await prisma.message.deleteMany({ where: { chatId: id } });
    await prisma.chat.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete chat from database");

    if (error instanceof Error) {
      console.log(error.stack);
    }

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

    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }

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
        annotations: msg.annotations as InputJsonValue[],
        experimental_attachments:
          msg.experimental_attachments as InputJsonValue[],
        id: msg.id,
        role: msg.role,
      })),
    });
  } catch (error) {
    console.error("Failed to save messages in database", error);

    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }

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

    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }

    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await prisma.message.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get message by id from database", error);

    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }

    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await prisma.message.findMany({
      where: {
        chatId,
        createdAt: {
          gte: timestamp,
        },
      },
      select: {
        id: true,
      },
    });

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      return await prisma.message.deleteMany({
        where: {
          chatId,
          id: {
            in: messageIds,
          },
        },
      });
    }
  } catch (error) {
    console.error(
      "Failed to delete messages by id after timestamp from database",
      error
    );

    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }

    throw error;
  }
}
