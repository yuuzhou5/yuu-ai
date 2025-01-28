import { Message } from "ai";
import { RefreshCcw, Volume2 } from "lucide-react";
import { CopyIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import CodeDisplayBlock from "../code-display-block";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import ChatInitialMessage from "./chat-initial-message";
import MarkdownRenderer from "./markdown-renderer";

type MessagesListProps = {
  messages: Message[];
  isGenerating: boolean;
  handleActionClick: (action: string, index: number) => void;
};

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  {
    icon: Volume2,
    label: "Volume",
  },
];

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
      console.log(isAtBottom);

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
                  className="items-start"
                >
                  <div className="pt-4">
                    <ChatBubbleAvatar
                      src=""
                      fallback={message.role == "user" ? "👨🏽" : "🤖"}
                    />
                  </div>

                  <ChatBubbleMessage
                    style={{ whiteSpace: "normal" }}
                    className="border-t-0"
                  >
                    {message.content
                      .split("```")
                      .map((part: string, index: number) => {
                        if (index % 2 === 0) {
                          return (
                            <MarkdownRenderer
                              key={index}
                              content={part}
                              className={cn(
                                "prose prose-neutral prose-invert max-w-none",
                                message.role === "user"
                                  ? "text-primary-foreground"
                                  : "",
                                index % 2 === 0 ? "prose-p:mb-0" : ""
                              )}
                            />
                          );
                        } else {
                          return (
                            <pre
                              className="whitespace-pre-wrap pt-2"
                              key={index}
                            >
                              <CodeDisplayBlock code={part} lang="" />
                            </pre>
                          );
                        }
                      })}

                    {message.role === "assistant" &&
                      messages.length - 1 === index && (
                        <div className="flex items-center mt-1.5 gap-1">
                          {!isGenerating && (
                            <>
                              {ChatAiIcons.map((icon, iconIndex) => {
                                const Icon = icon.icon;
                                return (
                                  <ChatBubbleAction
                                    variant="outline"
                                    className="size-5"
                                    key={iconIndex}
                                    icon={<Icon className="size-3" />}
                                    onClick={() =>
                                      handleActionClick(icon.label, index)
                                    }
                                  />
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
