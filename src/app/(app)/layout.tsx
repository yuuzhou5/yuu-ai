import {
  isAfter,
  isBefore,
  startOfToday,
  startOfYesterday,
  subDays,
} from "date-fns";
import { cookies } from "next/headers";
import { Session } from "next-auth";

import { auth } from "@/auth";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation/user";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <SidebarInset>
        <AppHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
