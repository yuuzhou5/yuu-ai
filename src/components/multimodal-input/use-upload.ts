import { Attachment } from "ai";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Capability } from "@/lib/ai/models";

export function useUpload({
  setAttachments,
  can,
}: {
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  can: (...abilities: Capability[]) => boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

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
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
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
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
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

  return {
    handleFileChange,
    fileInputRef,
    uploadQueue,
  };
}
