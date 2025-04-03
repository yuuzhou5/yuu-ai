import { UseChatHelpers } from "ai/react";
import { Pause } from "lucide-react";
import { memo } from "react";

import { Button } from "../ui/button";

function PureStopButton({ stop, setMessages }: { stop: () => void; setMessages: UseChatHelpers["setMessages"] }) {
  return (
    <Button
      size="icon"
      className="rounded-full p-1.5 h-fit border size-8"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <Pause className="size-4" />
    </Button>
  );
}

export default memo(PureStopButton);
