"use client";

import { isAfter, isBefore, startOfToday, startOfYesterday } from "date-fns";
import { MoreHorizontalIcon, Trash, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { User } from "next-auth";
import { memo, useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { models } from "@/lib/ai/models";
import { cn, fetcher } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

import { useConfirm } from "@omit/react-confirm-dialog";
import { Chat } from "@prisma/client";

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  // const { visibilityType, setVisibilityType } = useChatVisibility({
  //   chatId: chat.id,
  //   initialVisibility: chat.visibility,
  // });

  const chatModel = models.find((model) => model.apiIdentifier === chat.model);

  console.log(chat, chatModel);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
          {chatModel && <chatModel.icon className="size-4" />}

          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
            showOnHover={!isActive}
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
            onSelect={() => onDelete(chat.id)}
          >
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

function groupThreadsByDate(threads: Chat[]) {
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

  return data;
}

export default function SidebarHistory({ user }: { user: User | undefined }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { chatId } = useParams();

  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Chat[]>(user ? "/api/chat/history" : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  const router = useRouter();
  const confirm = useConfirm();
  async function openDeleteDialog(deleteId: string) {
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
      const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
        method: "DELETE",
      });

      toast.promise(deletePromise, {
        loading: "Deleting chat...",
        success: () => {
          mutate((history) => {
            if (history) {
              return history.filter((h) => h.id !== deleteId);
            }
          });
          return "Chat deletado com sucesso!";
        },
        error: "Erro ao deletar o chat.",
      });

      if (deleteId === chatId) {
        router.push("/");
      }
    }
  }

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="text-muted-foreground">
            Faça login para salvar seus chats!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">Hoje</div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      "--skeleton-width": `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (history?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-muted-foreground w-full flex flex-row justify-center items-center text-sm gap-2">
            Suas conversas serão salvas aqui!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      {history &&
        groupThreadsByDate(history).map((item) => (
          <SidebarGroup
            key={item.label}
            className={cn(item.items.length === 0 && "hidden")}
          >
            <SidebarGroupLabel>{item.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((chat) => {
                  return (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === chatId}
                      onDelete={(chatId) => {
                        // console.log("Deleting", chatId);
                        // setDeleteId(chatId);
                        // setShowDeleteDialog(true);
                        openDeleteDialog(chatId);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  );

                  // return (
                  //   <SidebarMenuItem
                  //     key={thread.id}
                  //     className="flex items-center justify-between"
                  //   >
                  //     <SidebarMenuButton
                  //       asChild
                  //       // isActive={params.thread_id === thread.id}
                  //     >
                  //       <Link href={`/c/${thread.id}`}>
                  //         {threadModel && <threadModel.icon />}

                  //         <span>{thread.title}</span>
                  //       </Link>
                  //     </SidebarMenuButton>

                  //     <SidebarMenuAction
                  //       // onClick={() => handleDeleteThread(thread)}
                  //       className="opacity-0 group-hover/menu-item:opacity-100 duration-200"
                  //     >
                  //       <TrashIcon className="size-3 hover:opacity-60 duration-200" />
                  //     </SidebarMenuAction>
                  //   </SidebarMenuItem>
                  // );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
    </>
  );
}
