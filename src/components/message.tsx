"use client";

import type { ChatRequestOptions, Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, PencilLine, SparklesIcon } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";

import { cn, copyToClipboard } from "@/lib/utils";

import ImageGeneration from "./image-generation";
import { MemoizedMarkdown } from "./memoized-markdown";
import { MessageActions } from "./message-actions";
import { MessageEditor } from "./message-editor";
import { PreviewAttachment } from "./preview-attachment";
import { Button } from "./ui/button";
import ShinyText from "./ui/shiny-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Weather } from "./weather";

import { UseChatHelpers } from "@ai-sdk/react";

// type MessageWithThinking = Message & {
//   finishedThinking?: boolean;
//   think?: string;
// };

// function useMessageWithThinking(message: Message): MessageWithThinking {
//   return useMemo(() => {
//     if (message.role === "assistant") {
//       if (message.content.includes("<think>")) {
//         if (message.content.includes("</think>")) {
//           return {
//             ...message,
//             finishedThinking: true,
//             think: message.content.split("</think>")[0].replace("</think>", "").replace("<think>", ""),
//             content: message.content.split("</think>")[1],
//           };
//         } else {
//           return {
//             ...message,
//             finishedThinking: false,
//             think: message.content.replace("<think>", ""),
//             content: "",
//           };
//         }
//       }

//       return message;
//     }
//     return message;
//   }, [message]);
// }

// TODO: Implement Chain-of-thought of the deepseek distill models

const PurePreviewMessage = ({
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
  setMessages: UseChatHelpers["setMessages"];
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  console.log(message);

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
            {message.experimental_attachments && message.experimental_attachments.length > 0 && (
              <div className="flex flex-row justify-end gap-2">
                {message.experimental_attachments.map((attachment) => (
                  <PreviewAttachment key={attachment.url} attachment={attachment} />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex flex-row gap-2 items-center max-w-3xl">
                        {message.role === "user" && !isReadonly && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                                  onClick={async () => {
                                    await copyToClipboard(part.text);

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
                          <MemoizedMarkdown id={message.id} content={part.text} />
                        </div>
                      </div>

                      {message.role === "assistant" && !isReadonly && (
                        <MessageActions annotations={message.annotations} isLoading={isLoading} text={part.text} />
                      )}
                    </div>
                  );
                }
              }

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "call") {
                  return (
                    <div key={toolCallId}>
                      {toolName === "getWeather" ? (
                        <Weather />
                      ) : toolName === "generateImage" ? (
                        <ImageGeneration />
                      ) : toolName === "search" ? (
                        <>Pesquisando...</>
                      ) : (
                        <div>other tool</div>
                      )}
                    </div>
                  );
                }

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === "getWeather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === "generateImage" ? (
                        <ImageGeneration />
                      ) : toolName === "search" ? (
                        <></>
                      ) : (
                        <div>other tool</div>
                      )}
                    </div>
                  );
                }
              }
            })}

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
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;

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
            <ShinyText text="Só um segundo..." disabled={false} speed={3} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
