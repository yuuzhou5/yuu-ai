import { subDays } from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getChatsByUserIdInLastThirtyDays } from "@/lib/db/queries";
import { userSchema } from "@/lib/validation/user";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = userSchema.parse(session.user);

  const threads = await getChatsByUserIdInLastThirtyDays({
    userId: user.id,
  });

  return NextResponse.json(threads);
}
