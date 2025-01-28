import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation/user";

import { Button } from "./ui/button";

export async function AppSidebar() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = userSchema.parse(session.user);

  const threads = await prisma.thread.findMany({
    where: {
      ownerId: user.id,
    },
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <Button asChild>
          <Link href="/?signal=new-thread">
            <PlusIcon className="size-5 mr-1" />
            <span>Novo chat</span>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Threads</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {threads.map((thread) => (
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/c/${thread.id}`}>
                      <span>{thread.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
