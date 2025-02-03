import { ChatRequestOptions, Message } from "ai";
import equal from "fast-deep-equal";
import { memo, useEffect, useRef, useState } from "react";

import { PreviewMessage, ThinkingMessage } from "./message";
import { Overview } from "./overview";

interface MessagesListProps {
  chatId: string;
  isLoading: boolean;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
}

function PureMessagesList({
  chatId,
  isLoading,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    const end = messagesEndRef.current;

    if (messages.length === 0) return;

    if (container && end && autoScrollEnabledRef.current) {
      end.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isAtBottom]);

  return (
    <div
      onScroll={checkScrollPosition}
      ref={scrollContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const MessagesList = memo(PureMessagesList, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
