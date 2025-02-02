import {
  isAfter,
  isBefore,
  startOfToday,
  startOfYesterday,
  subDays,
} from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation/user";

export async function GET() {
  const session = await auth();

  const thirtyDaysAgo = subDays(new Date(), 30);

  if (!session) {
    return null;
  }

  const user = userSchema.parse(session.user);

  const threads = await prisma.thread.findMany({
    where: {
      ownerId: user.id,
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const todayStart = startOfToday();
  const yesterdayStart = startOfYesterday();

  const todayItems = threads.filter((item) =>
    isAfter(item.updatedAt, todayStart)
  );
  const yesterdayItems = threads.filter(
    (item) =>
      isAfter(item.updatedAt, yesterdayStart) &&
      isBefore(item.updatedAt, todayStart)
  );

  const thirtyDaysItems = threads.filter((item) =>
    isBefore(item.updatedAt, yesterdayStart)
  );

  const data = [
    { label: "Hoje", items: todayItems },
    { label: "Ontem", items: yesterdayItems },
    { label: "Últimos 30 dias", items: thirtyDaysItems },
  ];

  return NextResponse.json({ data });
}
