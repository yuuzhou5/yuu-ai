"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

import SidebarHistory from "./sidebar-history";
import { Button } from "./ui/button";

import { GearIcon } from "@radix-ui/react-icons";

export function AppSidebar({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">Yuu AI</span>
          </Link>

          <Button asChild>
            <Link href="/" onClick={() => setOpenMobile(false)}>
              <PlusIcon className="size-5 mr-1" />
              <span>Novo chat</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenuButton>
          <GearIcon className="size-4 mr-1" />

          <span>Configurações</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
