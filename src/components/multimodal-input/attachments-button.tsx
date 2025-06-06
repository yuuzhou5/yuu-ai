import { PaperclipIcon } from "lucide-react";
import { memo } from "react";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { UseChatHelpers } from "@ai-sdk/react";

type AttachmentsButtonProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  status: UseChatHelpers["status"];
};

function PureAttachmentsButton({ fileInputRef, status, disabled }: AttachmentsButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {disabled ? (
          <Button
            onClick={() => {}}
            variant="ghost"
            size="icon"
            type="button"
            className="border cursor-default p-[7px] opacity-30 text-muted-foreground focus:text-muted-foreground hover:text-muted-foreground"
          >
            <PaperclipIcon className="size-4" />
          </Button>
        ) : (
          <Button
            className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 dark:hover:bg-zinc-900 hover:bg-zinc-200"
            onClick={(event) => {
              event.preventDefault();
              fileInputRef.current?.click();
            }}
            disabled={status !== "ready" || disabled}
            variant="ghost"
          >
            <PaperclipIcon className="size-4" />
          </Button>
        )}
      </TooltipTrigger>

      <TooltipContent>{disabled ? "Desabilitado para este modelo" : "Anexar imagem"}</TooltipContent>
    </Tooltip>
  );
}

export default memo(PureAttachmentsButton);
