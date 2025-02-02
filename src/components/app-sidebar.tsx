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
} from "@/components/ui/sidebar";

import SidebarHistory from "./sidebar-history";
import { Button } from "./ui/button";

import { GearIcon } from "@radix-ui/react-icons";

export function AppSidebar({ user }: { user: User | undefined }) {
  // async function handleDeleteThread(thread: Thread) {
  //   const result = await confirm({
  //     title: "Excluir chat",
  //     description: "Tem certeza que deseja excluir este chat?",
  //     icon: <Trash className="size-4 text-destructive" />,
  //     confirmText: "Excluir",
  //     cancelText: "Cancelar",
  //     cancelButton: {
  //       size: "default",
  //       variant: "outline",
  //     },
  //     confirmButton: {
  //       className: "bg-red-500 hover:bg-red-600 text-white",
  //     },
  //     alertDialogTitle: {
  //       className: "flex items-center gap-2",
  //     },
  //   });

  //   if (result) {
  //     await deleteThreadFn(thread);

  //     if (params.thread_id === thread.id) {
  //       router.push("/");
  //       router.refresh();
  //     }
  //   }
  // }

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
