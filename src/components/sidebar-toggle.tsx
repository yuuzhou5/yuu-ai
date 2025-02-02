import { PanelLeft } from "lucide-react";
import type { ComponentProps } from "react";

import { type SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "./ui/button";

export function SidebarToggle({}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={toggleSidebar}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <PanelLeft className="size-4" />
        </Button>
      </TooltipTrigger>

      <TooltipContent align="start">{open ? "Fechar" : "Abrir"}</TooltipContent>
    </Tooltip>
  );
}
