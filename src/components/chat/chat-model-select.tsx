"use client";

import { setCookie } from "cookies-next";
import { useShallow } from "zustand/react/shallow";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { models } from "@/config/models";
import { useChatStore } from "@/store/use-chat-store";

export default function ChatModelSelect() {
  const { setModel, model } = useChatStore(
    useShallow((state) => ({
      setModel: state.setChatModel,
      model: state.chatModel,
    }))
  );

  function handleChange(value: string) {
    setModel(value);
    setCookie("chat-model", value);
  }

  return (
    <Select value={model} onValueChange={handleChange}>
      <SelectTrigger className="w-[210px]">
        <SelectValue placeholder="Selecione o modelo" />
      </SelectTrigger>

      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id} disabled={model.disabled}>
            <div className="flex items-center gap-2">
              <model.icon className="size-4 fill-foreground" />

              {model.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
