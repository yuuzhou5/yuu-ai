import { ChatRequestOptions, Message } from "ai";
import equal from "fast-deep-equal";
import { memo } from "react";

import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";

// import { Vote } from "@/lib/db/schema";
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
  // isBlockVisible: boolean;
  // votes: Array<Vote> | undefined;
}

function PureMessagesList({
  chatId,
  isLoading,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesListProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
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
          // vote={
          //   votes
          //     ? votes.find((vote) => vote.messageId === message.id)
          //     : undefined
          // }
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
  // if (prevProps.isBlockVisible && nextProps.isBlockVisible) return true;

  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  // if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
