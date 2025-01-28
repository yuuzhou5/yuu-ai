import { ArrowDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/components/ui/chat/useAutoScroll";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false }, ref) => {
    const { isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
      smooth,
      elementRef: ref as React.RefObject<HTMLDivElement>,
    });

    return (
      <div className="w-full h-full">
        <div
          className={`flex relative flex-col w-full h-full p-4 overflow-y-auto ${className}`}
          ref={ref}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
        >
          <div className="flex flex-col gap-6">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
            className="fixed bottom-36 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </Button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
