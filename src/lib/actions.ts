"use server";

import { revalidateTag } from "next/cache";

import { prisma } from "./prisma";

export async function deleteThread(thread_id: string) {
  await prisma.thread.delete({
    where: { id: thread_id },
  });

  revalidateTag("threads");
}
