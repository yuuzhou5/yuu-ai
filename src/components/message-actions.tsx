import type { JSONValue, Message } from "ai";
import { CopyIcon, Volume2 } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { z } from "zod";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type MessageActionsProps = {
  chatId: string;
  message: Message;
  isLoading: boolean;
};

function MessageAnnotations({ annotations }: { annotations?: JSONValue[] }) {
  if (!annotations) return <></>;

  const { success, data } = z
    .object({
      latency: z.number().optional(),
      model: z.string().optional(),
      usage: z
        .object({
          totalTokens: z.number().nullable(),
        })
        .optional(),
    })
    .safeParse(annotations[0]);

  if (!success) return <></>;

  return <div className="text-muted-foreground text-xs">{data.latency && <span>{data.latency} ms</span>}</div>;
}

export function PureMessageActions({ message, isLoading }: MessageActionsProps) {
  const [, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;
  if (message.toolInvocations && message.toolInvocations.length > 0) return null;

  return (
    <div className="flex flex-row items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="text-muted-foreground size-7"
            variant="outline"
            size="icon"
            onClick={async () => {
              await copyToClipboard(message.content as string);

              toast.success("Copied to clipboard!");
            }}
          >
            <CopyIcon className="size-3.5" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">Copiar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="text-muted-foreground size-7"
            variant="outline"
            size="icon"
            onClick={async () => {
              // reload();
            }}
          >
            <Volume2 className="size-3.5" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">Ouvir</TooltipContent>
      </Tooltip>

      {/* {success && data[0] && (
        <span className="text-muted-foreground text-xs">
          {data[0].model} &#183; {data[0].latency} ms
        </span>
      )} */}

      <MessageAnnotations annotations={message.annotations} />
    </div>
  );
}

export const MessageActions = memo(PureMessageActions, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  return true;
});
