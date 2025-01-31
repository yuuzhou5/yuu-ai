import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { thread_id: string } }) {
  const { thread_id } = params;

  await prisma.thread.delete({
    where: { id: thread_id },
  });

  return new Response("ok", { status: 204 });
}
