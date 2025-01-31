import { isAfter, isBefore, startOfToday, startOfYesterday, subDays } from "date-fns";
import { cookies } from "next/headers";
import { Session } from "next-auth";

import { auth } from "@/auth";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation/user";

// const getThreads = unstable_cache(
//   async (session: Session | null) => {
//     const thirtyDaysAgo = subDays(new Date(), 30);

//     if (!session) {
//       return null;
//     }

//     const user = userSchema.parse(session.user);

//     const threads = await prisma.thread.findMany({
//       where: {
//         ownerId: user.id,
//         createdAt: {
//           gte: thirtyDaysAgo,
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const todayStart = startOfToday();
//     const yesterdayStart = startOfYesterday();

//     const todayItems = threads.filter((item) => isAfter(item.createdAt, todayStart));
//     const yesterdayItems = threads.filter(
//       (item) => isAfter(item.createdAt, yesterdayStart) && isBefore(item.createdAt, todayStart)
//     );

//     const thirtyDaysItems = threads.filter((item) => isBefore(item.createdAt, yesterdayStart));

//     const data = [
//       { label: "Hoje", items: todayItems },
//       { label: "Ontem", items: yesterdayItems },
//       { label: "Últimos 30 dias", items: thirtyDaysItems },
//     ];

//     return data;
//   },
//   ["threads"],
//   { tags: ["threads"] }
// );

const getThreads = async (session: Session | null) => {
  const thirtyDaysAgo = subDays(new Date(), 30);

  if (!session) {
    return null;
  }

  const user = userSchema.parse(session.user);

  const threads = await prisma.thread.findMany({
    where: {
      ownerId: user.id,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const todayStart = startOfToday();
  const yesterdayStart = startOfYesterday();

  const todayItems = threads.filter((item) => isAfter(item.createdAt, todayStart));
  const yesterdayItems = threads.filter(
    (item) => isAfter(item.createdAt, yesterdayStart) && isBefore(item.createdAt, todayStart)
  );

  const thirtyDaysItems = threads.filter((item) => isBefore(item.createdAt, yesterdayStart));

  const data = [
    { label: "Hoje", items: todayItems },
    { label: "Ontem", items: yesterdayItems },
    { label: "Últimos 30 dias", items: thirtyDaysItems },
  ];

  return data;
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const session = await auth();

  const threads = await getThreads(session);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar threads={threads} />

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
