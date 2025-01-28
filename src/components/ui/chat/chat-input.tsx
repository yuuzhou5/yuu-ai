import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxHeight?: number;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, maxHeight = 200, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";

      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [maxHeight]);

    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      adjustHeight();

      const resizeObserver = new ResizeObserver(adjustHeight);
      resizeObserver.observe(textarea);

      return () => {
        resizeObserver.disconnect();
      };
    }, [adjustHeight]);

    return (
      <Textarea
        autoComplete="off"
        ref={(element) => {
          textareaRef.current = element;
          if (typeof ref === "function") {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
        name="message"
        className={cn(
          "px-4 py-3 min-h-[44px] bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center resize-none overflow-y-auto",
          className
        )}
        onInput={adjustHeight}
        style={{ maxHeight }}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";

const MemoizedChatInput = React.memo(ChatInput);

export { MemoizedChatInput as ChatInput };
