import { cookies } from "next/headers";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);

  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={session?.user ? defaultOpen : false}>
      <AppSidebar user={session?.user} />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
