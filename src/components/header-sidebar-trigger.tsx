"use client";

import { PanelLeft } from "lucide-react";
import { useSession } from "next-auth/react";

import { useLoginDialog } from "@/context/login-dialog-context";

import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function HeaderSidebarTrigger() {
  const { data: session } = useSession();

  const { open } = useLoginDialog();

  return session ? (
    <SidebarTrigger />
  ) : (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => {
        open();
      }}
    >
      <PanelLeft className="size-5" />
      <span className="sr-only">open login dialog</span>
    </Button>
  );
}
