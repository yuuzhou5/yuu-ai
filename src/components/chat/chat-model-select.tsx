"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
  },
];

export default function ChatModelSelect() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  return (
    <Select value={selectedModel} onValueChange={setSelectedModel}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o modelo" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
