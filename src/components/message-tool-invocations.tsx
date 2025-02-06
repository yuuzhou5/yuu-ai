import type { Message } from "ai";
import { JSX } from "react";
import { z } from "zod";

import { cn } from "@/lib/utils";

import ImageGeneration from "./image-generation";
import { Weather } from "./weather";

interface MessageToolInvocationsProps {
  message: Message;
}

const toolNameSchema = z.enum(["getWeather", "generateImage"]);

export function MessageToolInvocations({ message }: MessageToolInvocationsProps) {
  if (!message.toolInvocations?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {message.toolInvocations.map((toolInvocation) => {
        console.log(toolInvocation);

        const { toolName, toolCallId, state } = toolInvocation;

        const { success, data: parsedToolName } = toolNameSchema.safeParse(toolName);

        if (!success) return <div key={toolCallId}>Tool not found.</div>;

        if (state === "result") {
          const { result } = toolInvocation;

          const toolsHandler: Record<z.infer<typeof toolNameSchema>, JSX.Element> = {
            getWeather: <Weather weatherAtLocation={result} />,
            generateImage: <ImageGeneration key={toolCallId} data={{ image: result.image, prompt: result.prompt }} />,
          };

          return <div key={toolCallId}>{toolsHandler[parsedToolName]}</div>;
        }

        return (
          <div
            key={toolCallId}
            className={cn({
              skeleton: ["getWeather"].includes(toolName),
            })}
          >
            {toolName === "getWeather" ? (
              <Weather />
            ) : toolName === "generateImage" ? (
              <ImageGeneration />
            ) : (
              <div>other tool</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
