"use client";

import { ArrowUp, Loader2, Paperclip, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, KeyboardEvent, memo, RefObject, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { uploadImage } from "@/app/api/uploadToAWS";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";

interface ChatComposerFormProps {
  isLoading: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  handleSendMessage: (message: string) => Promise<void>;
}

const MemoizedButton = memo(Button);

function ChatComposerForm({ isLoading, formRef, handleSendMessage }: ChatComposerFormProps) {
  const [input, setInput] = useState("");

  const [attachments, setAttachments] = useState<
    Array<{
      file: File;
      uploading: boolean;
      url?: string;
    }>
  >([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newAttachments = acceptedFiles.map((file) => ({
      file,
      uploading: true,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    for (let i = 0; i < acceptedFiles.length; i++) {
      try {
        const url = await uploadImage(acceptedFiles[i]);

        setAttachments((prev) =>
          prev.map((attachment) => {
            if (attachment.file === acceptedFiles[i]) {
              return { ...attachment, uploading: false, url };
            }
            return attachment;
          })
        );
      } catch (error) {
        console.error("Erro no upload:", error);
        setAttachments((prev) => prev.filter((attachment) => attachment.file !== acceptedFiles[i]));
      }
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // open
  } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setInput("");

    await handleSendMessage(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (isLoading || !input) return;

      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  }

  return (
    <div className="w-full px-4 pb-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative rounded-lg border bg-background"
        {...getRootProps()}
      >
        {attachments.length > 0 && (
          <div className="flex gap-2 p-2 flex-wrap">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(attachment.file)}
                    alt={attachment.file.name}
                    width={80}
                    height={80}
                    className={`rounded ${attachment.uploading ? "opacity-50" : ""}`}
                  />
                  {attachment.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-6 animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAttachment(index);
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input {...getInputProps()} />

        <ChatInput
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isDragActive ? "Solte as imagens aqui..." : "Enviar uma mensagem..."}
          className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
        />

        <div className="flex items-center p-3 pt-0">
          <MemoizedButton
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // open();
            }}
          >
            <Paperclip className="size-4" />
            <span className="sr-only">Anexar arquivo</span>
          </MemoizedButton>

          <Button
            disabled={!input || isLoading}
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
          >
            Enviar
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default memo(ChatComposerForm, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.handleSendMessage !== nextProps.handleSendMessage) return false;
  if (prevProps.formRef !== nextProps.formRef) return false;

  return true;
});
