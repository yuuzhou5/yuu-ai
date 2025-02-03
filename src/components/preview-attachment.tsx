"use client";

import type { Attachment } from "ai";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onClick,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onClick?: (attachment: Attachment) => void;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div
      className="flex flex-col gap-2"
      onClick={() => onClick && onClick(attachment)}
    >
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith("image") ? (
            <Image
              fill
              key={url}
              src={url}
              alt={name ?? "An image attachment"}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <div className="" />
          )
        ) : (
          <div className="" />
        )}

        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="text-xs text-zinc-500 max-w-16 truncate">{name}</div>
    </div>
  );
};
