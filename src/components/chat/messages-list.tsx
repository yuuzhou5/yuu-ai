import { Message } from "ai";
import { RefreshCcw, Volume2 } from "lucide-react";
import { CopyIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useRef } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import CodeDisplayBlock from "../code-display-block";
import { MemoizedMarkdown } from "../memoized-markdown";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ChatInitialMessage from "./chat-initial-message";

type MessagesListProps = {
  messages: Message[];
  isGenerating: boolean;
  handleActionClick: (action: string, index: number) => void;
};

const ChatAiIcons = [
  {
    id: "copy",
    icon: CopyIcon,
    label: "Copiar",
  },
  {
    id: "regenerate",
    icon: RefreshCcw,
    label: "Gerar novamente",
  },
  {
    id: "volume",
    icon: Volume2,
    label: "Ler em voz alta",
  },
];

function RawMessageContent({ message }: { message: Message }) {
  return message.content.split("```").map((part: string, index: number) => {
    if (index % 2 === 0) {
      return (
        <MemoizedMarkdown
          className={cn(
            message.role === "user" ? "text-foreground" : "",
            index % 2 === 0 ? "" : ""
          )}
          key={index}
          content={part}
          id={index.toString()}
        />
      );
    } else {
      return (
        <pre className="whitespace-pre-wrap pt-2" key={index}>
          <CodeDisplayBlock code={part} lang="" />
        </pre>
      );
    }
  });
}

const MessageContent = memo(RawMessageContent);

function MessagesList({
  messages,
  isGenerating,
  handleActionClick,
}: MessagesListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollEnabledRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const offset = 20;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - offset;

    autoScrollEnabledRef.current = isNearBottom;
    setIsAtBottom(isNearBottom);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (messages.length === 0) return;

    if (container && autoScrollEnabledRef.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isGenerating, isAtBottom]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 w-full overflow-y-auto"
      onScroll={checkScrollPosition}
    >
      <div className="max-w-5xl mx-auto py-4">
        <div className="h-full w-full p-4">
          <div className="flex flex-col gap-6">
            {messages.length === 0 && <ChatInitialMessage />}

            {messages &&
              messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  variant={message.role == "user" ? "sent" : "received"}
                  layout={message.role == "user" ? "default" : "ai"}
                  className="items-start text-foreground"
                >
                  <div
                    className={cn(
                      message.role === "assistant" ? "pt-4" : "hidden"
                    )}
                  >
                    <ChatBubbleAvatar
                      src=""
                      fallback={message.role == "user" ? "👨🏽" : "🤖"}
                    />
                  </div>

                  <ChatBubbleMessage
                    style={{ whiteSpace: "normal" }}
                    className="border-t-0"
                  >
                    <MessageContent message={message} />

                    {message.role === "assistant" &&
                      messages.length - 1 === index && (
                        <div className="flex items-center mt-1.5 gap-1">
                          {!isGenerating && (
                            <>
                              {ChatAiIcons.map((icon, iconIndex) => {
                                const Icon = icon.icon;
                                return (
                                  <Tooltip key={iconIndex}>
                                    <TooltipTrigger asChild>
                                      <ChatBubbleAction
                                        variant="outline"
                                        className="size-5"
                                        icon={<Icon className="size-3" />}
                                        onClick={() => {
                                          handleActionClick(icon.id, index);

                                          if (icon.id === "copy") {
                                            toast.success("Copiado!", {
                                              position: "top-center",
                                            });
                                          }
                                        }}
                                      />
                                    </TooltipTrigger>

                                    <TooltipContent>
                                      {icon.label}
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </>
                          )}
                        </div>
                      )}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

            {isGenerating && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar src="" fallback="🤖" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MessagesList);
