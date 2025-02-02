import { subDays } from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation/user";

export async function GET() {
  const session = await auth();

  const thirtyDaysAgo = subDays(new Date(), 30);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = userSchema.parse(session.user);

  const threads = await prisma.chat.findMany({
    where: {
      userId: user.id,
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(threads);
}
