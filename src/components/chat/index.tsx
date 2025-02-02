"use client";

import { Attachment } from "ai";
import { Message, useChat } from "ai/react";
import { useSetCookie } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useChatStore } from "@/store/use-chat-store";

import ChatComposerForm from "./chat-composer-form";
import MessagesList from "./messages-list";

import { useQueryClient } from "@tanstack/react-query";

type ChatProps = {
  initialMessages?: Message[];
  model: string;
};

export default function Chat({ initialMessages, model }: ChatProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>();

  const params = useParams();
  const router = useRouter();
  const setCookie = useSetCookie();
  const queryClient = useQueryClient();

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

        console.log(`generation complete: ${data}`);
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

      queryClient.invalidateQueries({ queryKey: ["threads"] });

      router.push(`/c/${memoizedThreadId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedThreadId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (
    message: string,
    attachment?: Attachment[]
  ) => {
    setIsGenerating(true);

    append(
      { role: "user", content: message, experimental_attachments: attachment },
      {
        allowEmptySubmit: false,
        body: { threadId, model },
        // experimental_attachments: attachment,
      }
    );
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    console.log("Action clicked:", action, "Message index:", messageIndex);

    if (action === "regenerate") {
      setIsGenerating(true);
      try {
        await reload({ body: { threadId, model } });
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "copy") {
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
