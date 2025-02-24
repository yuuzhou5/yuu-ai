"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";

// import { useConfig } from "./config-dialog";
import SidebarHistory from "./sidebar-history";
import { Button } from "./ui/button";

// import { GearIcon } from "@radix-ui/react-icons";

export function AppSidebar({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  // const { setDialogOpen } = useConfig();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <Link href="/" onClick={() => setOpenMobile(false)}>
            <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
              {siteConfig.name}
            </span>
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

      <SidebarFooter className="border-t text-sm p-4">
        {/* <SidebarMenuButton
          onClick={() => {
            setDialogOpen(true);
            setOpenMobile(false);
          }}
        >
          <GearIcon className="size-4 mr-1" />

          <span>Configurações</span>
        </SidebarMenuButton> */}

        <span>
          Powered by{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://vercel.com"
            className="underline hover:text-primary duration-200"
          >
            Vercel
          </Link>
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
