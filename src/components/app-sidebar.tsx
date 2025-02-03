"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar";

import SidebarHistory from "./sidebar-history";
import { Button } from "./ui/button";

import { GearIcon } from "@radix-ui/react-icons";

export function AppSidebar({ user }: { user: User | undefined }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Button asChild>
          <Link href="/">
            <PlusIcon className="size-5 mr-1" />
            <span>Novo chat</span>
          </Link>
        </Button>
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
