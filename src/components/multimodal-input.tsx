"use client";

import type { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import equal from "fast-deep-equal";
// import { ImageIcon } from "lucide-react";
import { ArrowUpIcon, PaperclipIcon, Pause } from "lucide-react";
import { useSession } from "next-auth/react";
import type React from "react";
import {
  type ChangeEvent,
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
import { cn, sanitizeUIMessages } from "@/lib/utils";

import { PreviewAttachment } from "./preview-attachment";
import { SuggestedActions } from "./suggested-actions";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// function ImageGenerationButton({
//   isActive,
//   setIsActive,
// }: {
//   setIsActive: Dispatch<SetStateAction<boolean>>;
//   isActive: boolean;
// }) {
//   return (
//     <Button
//       variant="ghost"
//       type="button"
//       className={cn(
//         "rounded-full transition-all duration-200",
//         "border-2 focus-visible:ring-0 focus-visible:ring-offset-0",
//         isActive ? "border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50" : ""
//       )}
//       onClick={() => setIsActive(!isActive)}
//     >
//       <ImageIcon className={cn("size-4 transition-transform duration-200 mr-2", isActive ? "scale-110" : "")} />
//       Gerar Imagem
//     </Button>
//   );
// }

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
}: {
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
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const { status } = useSession();
  const { open } = useLoginDialog();

  const [generateImage, setGenerateImage] = useState(false);

  const [optimisticModelId] = useOptimistic(selectedModelId);

  const selectedModel = useMemo(() => models.find((model) => model.id === optimisticModelId), [optimisticModelId]);

  const { can } = defineCapability(selectedModel as Model);

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    if (status === "unauthenticated") {
      open();

      return;
    }

    window.history.replaceState({}, "", `/chat/${chatId}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,

      body: { options: { imageGeneration: generateImage } },
    });

    setGenerateImage(false);
    setAttachments([]);
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [status, chatId, handleSubmit, attachments, generateImage, setAttachments, setLocalStorageInput, width, open]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      console.log("[ERROR] uploading file - multimodal-input.tsx:");
      console.log(error);

      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter((attachment) => attachment !== undefined);

        setAttachments((currentAttachments) => [...currentAttachments, ...successfullyUploadedAttachments]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      if (!can("image-input")) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter((item) => item.type.indexOf("image") !== -1);

      if (imageItems.length === 0) return;

      event.preventDefault();

      setUploadQueue(imageItems.map((_, index) => `clipboard-image-${index}.png`));

      try {
        const uploadPromises = imageItems.map(async (item) => {
          const blob = item.getAsFile();
          if (!blob) return;

          const file = new File([blob], `clipboard-image-${Date.now()}.png`, {
            type: blob.type,
          });

          return uploadFile(file);
        });

        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter((attachment) => attachment !== undefined);

        setAttachments((currentAttachments) => [...currentAttachments, ...successfullyUploadedAttachments]);
      } catch (error) {
        console.error("Error uploading pasted files!", error);
        toast.error("Failed to upload pasted image!");
      } finally {
        setUploadQueue([]);
      }
    },
    [can, setAttachments]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

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
            "min-h-[24px] w-full max-h-[calc(45dvh)] outline-none bg-transparent px-3 py-2 overflow-hidden resize-none rounded-2xl !text-base",
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
            {/* <ImageGenerationButton isActive={generateImage} setIsActive={setGenerateImage} /> */}
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

function PureAttachmentsButton({
  fileInputRef,
  isLoading,
  disabled,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  isLoading: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {disabled ? (
          <Button
            onClick={() => {}}
            variant="ghost"
            size="icon"
            type="button"
            className="border cursor-default p-[7px] opacity-30 text-muted-foreground focus:text-muted-foreground hover:text-muted-foreground"
          >
            <PaperclipIcon className="size-4" />
          </Button>
        ) : (
          <Button
            className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
            onClick={(event) => {
              event.preventDefault();
              fileInputRef.current?.click();
            }}
            disabled={isLoading || disabled}
            variant="ghost"
          >
            <PaperclipIcon className="size-4" />
          </Button>
        )}
      </TooltipTrigger>

      <TooltipContent>{disabled ? "Desabilitado pelo modo de raciocínio" : "Anexar imagem"}</TooltipContent>
    </Tooltip>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => sanitizeUIMessages(messages));
      }}
    >
      <Pause className="size-4" />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon className="size-4" />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length) return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
