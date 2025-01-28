"use client";

import { Message, useChat } from "ai/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import ChatComposerForm from "./chat-composer-form";
import MessagesList from "./messages-list";

type ChatProps = {
  initialMessages?: Message[];
};

export default function Chat({ initialMessages }: ChatProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>();

  const params = useParams();
  const router = useRouter();

  const { messages, append, isLoading, reload, data, setMessages } = useChat({
    initialMessages,
    onResponse(response) {
      if (response) {
        console.log(response);
        setIsGenerating(false);
      }
    },
    onError(error) {
      if (error) {
        setIsGenerating(false);

        console.log(error);
      }
    },
  });

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const memoizedThreadId = useMemo(() => {
    if (data && data.length > 0) {
      const [{ threadId }] = data as [{ threadId: string }];

      return threadId;
    }

    const threadId = params.thread_id;

    if (threadId) {
      return threadId as string;
    }

    return undefined;
  }, [data, params]);

  useEffect(() => {
    if (memoizedThreadId) {
      setThreadId(memoizedThreadId);
    }
  }, [memoizedThreadId]);

  useEffect(() => {
    if (messagesRef.current) {
      console.log(messagesRef.current.scrollHeight);

      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const signal = searchParams.get("signal");

    if (signal === "new-thread") {
      setMessages([]);
      setThreadId(undefined);

      const { pathname } = window.location;
      searchParams.delete("signal");

      const newUrl = `${pathname}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      window.history.replaceState({}, "", newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, router]);

  const handleSendMessage = async (message: string) => {
    setIsGenerating(true);

    append(
      { role: "user", content: message },
      { allowEmptySubmit: false, body: { threadId } }
    );
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    console.log("Action clicked:", action, "Message index:", messageIndex);

    if (action === "Refresh") {
      setIsGenerating(true);
      try {
        await reload();
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "Copy") {
      const message = messages[messageIndex];
      if (message && message.role === "assistant") {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  const isNearBottom = (element: HTMLElement, threshold = 100) => {
    return (
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - threshold
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (isNearBottom(container)) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  return (
    <main className="flex h-[calc(100vh-64px)] w-full flex-col items-center">
      <MessagesList
        messages={messages}
        isGenerating={isGenerating}
        handleActionClick={handleActionClick}
      />

      <div className="w-full max-w-5xl mx-auto">
        <ChatComposerForm
          isLoading={isLoading}
          formRef={formRef}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </main>
  );
}
