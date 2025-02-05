"use client";

import type { ChatRequestOptions, Message } from "ai";
import equal from "fast-deep-equal";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, PencilLine, SparklesIcon } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";

import { cn, copyToClipboard } from "@/lib/utils";

import { Markdown } from "./markdown";
import { MessageActions } from "./message-actions";
import { MessageEditor } from "./message-editor";
import { PreviewAttachment } from "./preview-attachment";
import { Button } from "./ui/button";
import ShinyText from "./ui/shiny-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Weather } from "./weather";

type MessageWithThinking = Message & {
  finishedThinking?: boolean;
  think?: string;
};

function useMessageWithThinking(message: Message): MessageWithThinking {
  return useMemo(() => {
    if (message.role === "assistant") {
      if (message.content.includes("</think>")) {
        return {
          ...message,
          finishedThinking: true,
          think: message.content.split("</think>")[0].replace("</think>", "").replace("<think>", ""),
          content: message.content.split("</think>")[1],
        };
      } else {
        return {
          ...message,
          finishedThinking: false,
          think: message.content.replace("<think>", ""),
          content: "",
        };
      }
    }
    return message;
  }, [message]);
}

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const messageWithThinking = useMessageWithThinking(message);

  const isWithReasoning = message.content.includes("<think>");

  return (
    <AnimatePresence>
      <motion.div
        className="w-full px-4 group/message mx-auto max-w-3xl"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-2 md:gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            }
          )}
        >
          {message.role === "assistant" && (
            <div className="hidden md:flex size-8 items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            {message.experimental_attachments && (
              <div className="flex flex-row justify-end gap-2">
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment key={attachment.url} attachment={attachment} />
                ))}
              </div>
            )}

            {message.content && mode === "view" && (
              <div className="flex flex-row gap-2 items-center max-w-3xl">
                {message.role === "user" && !isReadonly && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                          onClick={async () => {
                            await copyToClipboard(message.content);

                            toast.success("Copiado!");
                          }}
                        >
                          <Copy className="size-4" />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>Copiar</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                          onClick={async () => {
                            setMode("edit");
                          }}
                        >
                          <PencilLine className="size-4" />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent>Editar mensagem</TooltipContent>
                    </Tooltip>
                  </>
                )}

                <div
                  className={cn("flex flex-col w-full", {
                    "bg-secondary px-3 py-2 rounded-xl": message.role === "user",
                  })}
                >
                  {isWithReasoning && (
                    <blockquote
                      className={cn("border-l-4 pl-4 text-muted-foreground mb-4", { hidden: message.role === "user" })}
                    >
                      <p className="italic text-sm whitespace-pre-wrap font-geist">
                        {messageWithThinking.think?.trim()}
                      </p>
                    </blockquote>
                  )}

                  {message.reasoning && (
                    <blockquote className="border-l-4 pl-4 text-muted-foreground mb-4">
                      <p className="italic text-sm whitespace-pre-wrap font-geist">{message.reasoning}</p>
                    </blockquote>
                  )}

                  <Markdown>{isWithReasoning ? messageWithThinking.content : message.content}</Markdown>
                </div>
              </div>
            )}

            {message.content && mode === "edit" && (
              <div className="flex flex-row gap-2 items-start w-full">
                <div className="size-8" />

                <MessageEditor
                  key={message.id}
                  message={message}
                  setMode={setMode}
                  setMessages={setMessages}
                  reload={reload}
                />
              </div>
            )}

            {message.toolInvocations && message.toolInvocations.length > 0 && (
              <div className="flex flex-col gap-4">
                {message.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  if (state === "result") {
                    const { result } = toolInvocation;

                    return (
                      <div key={toolCallId}>
                        {toolName === "getWeather" ? <Weather weatherAtLocation={result} /> : <div>other tool</div>}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={toolCallId}
                      className={cn({
                        skeleton: ["getWeather"].includes(toolName),
                      })}
                    >
                      {toolName === "getWeather" ? <Weather /> : <div>other tool</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {!isReadonly && (
              <MessageActions key={`action-${message.id}`} chatId={chatId} message={message} isLoading={isLoading} />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;
  if (!equal(prevProps.message.toolInvocations, nextProps.message.toolInvocations)) return false;

  return true;
});

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          }
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            <ShinyText text="Gerando..." disabled={false} speed={3} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
