import { Message } from "ai";
import { Pause } from "lucide-react";
import { Dispatch, memo, SetStateAction } from "react";

import { sanitizeUIMessages } from "@/lib/utils";

import { Button } from "../ui/button";

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border"
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

export default memo(PureStopButton);
