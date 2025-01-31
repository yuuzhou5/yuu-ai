"use client";

import { Message, useChat } from "ai/react";
import { useSetCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useChatStore } from "@/store/use-chat-store";

import ChatComposerForm from "./chat-composer-form";
import MessagesList from "./messages-list";

type ChatProps = {
  initialMessages?: Message[];
  model: string;
};

export default function Chat({ initialMessages, model }: ChatProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>();

  const params = useParams();

  const setCookie = useSetCookie();

  const { setModel } = useChatStore(
    useShallow((state) => ({
      setModel: state.setChatModel,
    }))
  );

  const { messages, append, isLoading, reload, data } = useChat({
    initialMessages,

    onResponse(response) {
      if (response) {
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
    if (model) {
      setModel(model);
      setCookie("chat-model", model);
    }
  }, [model, setModel, setCookie]);

  useEffect(() => {
    if (memoizedThreadId) {
      setThreadId(memoizedThreadId);
    }
  }, [memoizedThreadId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setIsGenerating(true);

    append(
      { role: "user", content: message },
      { allowEmptySubmit: false, body: { threadId, model } }
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
    return element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;
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
