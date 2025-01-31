"use client";

import { PlusIcon, Trash, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { models } from "@/config/models";
import { deleteThread } from "@/lib/actions";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

import { useConfirm } from "@omit/react-confirm-dialog";
import { Thread } from "@prisma/client";

type AppSidebarProps = {
  threads: { label: string; items: Thread[] }[] | null;
};

export function AppSidebar({ threads }: AppSidebarProps) {
  const params = useParams();
  const confirm = useConfirm();

  const router = useRouter();

  if (!threads) {
    return null;
  }

  async function handleDeleteThread(thread: Thread) {
    const result = await confirm({
      title: "Excluir chat",
      description: "Tem certeza que deseja excluir este chat?",
      icon: <Trash className="size-4 text-destructive" />,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      cancelButton: {
        size: "default",
        variant: "outline",
      },
      confirmButton: {
        className: "bg-red-500 hover:bg-red-600 text-white",
      },
      alertDialogTitle: {
        className: "flex items-center gap-2",
      },
    });

    if (result) {
      await deleteThread(thread.id);

      if (params.thread_id === thread.id) {
        router.push("/");
      }
    }
  }

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
        {threads.map((item) => (
          <SidebarGroup
            key={item.label}
            className={cn(item.items.length === 0 && "hidden")}
          >
            <SidebarGroupLabel>{item.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((thread) => {
                  const threadModel = models.find(
                    (model) => model.id === thread.model
                  );

                  return (
                    <SidebarMenuItem
                      key={thread.id}
                      className="flex items-center justify-between"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={params.thread_id === thread.id}
                      >
                        <Link href={`/c/${thread.id}`}>
                          {threadModel && <threadModel.icon />}

                          <span>{thread.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      <SidebarMenuAction
                        onClick={() => handleDeleteThread(thread)}
                        className="opacity-0 group-hover/menu-item:opacity-100 duration-200"
                      >
                        <TrashIcon className="size-3 hover:opacity-60 duration-200" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
