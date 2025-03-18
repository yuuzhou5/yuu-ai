"use client";

import type { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import equal from "fast-deep-equal";
import { Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import type React from "react";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { useLoginDialog } from "@/context/login-dialog-context";
import { defineCapability, Model, models } from "@/lib/ai/models";
import { cn } from "@/lib/utils";

import { PreviewAttachment } from "../preview-attachment";
import { SuggestedActions } from "../suggested-actions";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AttachmentsButton from "./attachments-button";
import SendButton from "./send-button";
import StopButton from "./stop-button";
import { useUpload } from "./use-upload";

type MultimodalInputProps = {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  className?: string;
  selectedModelId: string;
};

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
  selectedModelId,
}: MultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const { status } = useSession();
  const { open } = useLoginDialog();

  const [useSearch, setUseSearch] = useState(false);

  const [optimisticModelId] = useOptimistic(selectedModelId);

  const selectedModel = useMemo(() => models.find((model) => model.id === optimisticModelId), [optimisticModelId]);

  const { can } = defineCapability(selectedModel as Model);
  const { handleFileChange, fileInputRef, uploadQueue } = useUpload({ setAttachments, can });

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "66px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage("input", "");

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    if (status === "unauthenticated") {
      open();

      return;
    }

    window.history.replaceState({}, "", `/chat/${chatId}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,

      body: { options: { search: true } },
    });

    // setGenerateImage(false);
    setAttachments([]);
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [status, chatId, handleSubmit, attachments, setAttachments, setLocalStorageInput, width, open]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && attachments.length === 0 && uploadQueue.length === 0 && (
        <SuggestedActions append={append} chatId={chatId} />
      )}

      <input
        type="file"
        accept="image/png, image/jpeg"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-auto items-end">
          {attachments.map((attachment) => (
            <PreviewAttachment
              onClick={(att) => {
                setAttachments((prev) => {
                  return prev.filter((item) => item.url !== att.url);
                });
              }}
              key={attachment.url}
              attachment={attachment}
            />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <div className="bg-muted rounded-2xl">
        <textarea
          ref={textareaRef}
          placeholder="Enviar uma mensagem..."
          value={input}
          onChange={handleInput}
          className={cn(
            "min-h-[24px] w-full max-h-[calc(45dvh)] outline-hidden bg-transparent px-3 py-2 overflow-hidden resize-none rounded-2xl text-base!",
            className
          )}
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error("Please wait for the model to finish its response!");
              } else {
                submitForm();
              }
            }
          }}
        />

        <div className="rounded-2xl pl-3 pr-1 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AttachmentsButton disabled={!can("image-input")} fileInputRef={fileInputRef} isLoading={isLoading} />

            {/* @deprecated code block */}
            {can("web-search") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    className={cn(
                      "size-8",
                      useSearch
                        ? "border-2 text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-300 border-blue-500 bg-blue-300 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 hover:border-blue-400 rounded-xl"
                        : "dark:border-zinc-700 dark:hover:bg-zinc-900 hover:bg-zinc-200 "
                    )}
                    variant="ghost"
                    size="icon"
                    onClick={() => setUseSearch((prev) => !prev)}
                  >
                    <Globe className="size-4" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>{useSearch ? "Desativar" : "Fazer pesquisas na web"}</TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="p-2 w-fit flex flex-row justify-end">
            {isLoading ? (
              <StopButton stop={stop} setMessages={setMessages} />
            ) : (
              <SendButton input={input} submitForm={submitForm} uploadQueue={uploadQueue} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (!equal(prevProps.attachments, nextProps.attachments)) return false;

  return true;
});
