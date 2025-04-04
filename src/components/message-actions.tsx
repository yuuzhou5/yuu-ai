import type { UIMessage } from "ai";
import { Check, CopyIcon, Volume2 } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { z } from "zod";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type MessageActionsProps = {
  isLoading: boolean;
  text: string;
  annotations: UIMessage["annotations"];
};

function MessageAnnotations({ annotations }: { annotations?: UIMessage["annotations"] }) {
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

export function PureMessageActions({ isLoading, text, annotations }: MessageActionsProps) {
  const [, copyToClipboard] = useCopyToClipboard();

  const [copied, setCopied] = useState(false);

  if (isLoading) return <></>;

  async function copy() {
    await copyToClipboard(text);

    toast.success("Copiado!");
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="text-muted-foreground size-7" variant="outline" size="icon" onClick={copy}>
            {copied ? <Check className="size-3.5" /> : <CopyIcon className="size-3.5" />}

            <span className="sr-only">Copiar texto</span>
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

            <span className="sr-only">Falar texto</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">Ouvir</TooltipContent>
      </Tooltip>

      <MessageAnnotations annotations={annotations} />
    </div>
  );
}

export const MessageActions = memo(PureMessageActions, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  return true;
});
