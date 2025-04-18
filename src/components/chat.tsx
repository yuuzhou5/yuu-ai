"use client";

import type { Attachment, Message } from "ai";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { siteConfig } from "@/config/site";
import { generateUUID } from "@/lib/utils";

import ChatHeader from "./chat-header";
import { MessagesList } from "./messages-list";
import { MultimodalInput } from "./multimodal-input";

import { useChat } from "@ai-sdk/react";

type ChatProps = {
  id: string;
  selectedModelId: string;
  initialMessages: Array<Message>;
  isReadonly: boolean;
};

export default function Chat({ id, selectedModelId, isReadonly, initialMessages }: ChatProps) {
  const { mutate } = useSWRConfig();

  const { messages, setMessages, handleSubmit, input, setInput, append, stop, reload, status } = useChat({
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate("/api/history");
    },
    onError: (error) => {
      if (error.message === "Unauthorized") {
        console.log("Não logado");
      }

      toast.error("Algo deu problema, tente novamente!");
    },
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background overflow-y-hidden">
      <ChatHeader chatId={id} selectedModelId={selectedModelId} />

      <MessagesList
        chatId={id}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={isReadonly}
        status={status}
      />

      <form className="flex flex-col mx-auto px-4 bg-background pb-2 gap-2 w-full md:max-w-3xl">
        {!isReadonly && (
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
            selectedModelId={selectedModelId}
            status={status}
          />
        )}

        <div className="text-xs text-muted-foreground flex justify-between">
          <span>
            Esse chatbot é{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={siteConfig.links.github}
              className="underline hover:text-primary duration-200"
            >
              open source
            </Link>
            .
          </span>
        </div>
      </form>
    </div>
  );
}
