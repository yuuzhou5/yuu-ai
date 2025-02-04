import { JSX } from "react";

import { IconProps, Icons } from "@/components/icons";

type Capability = "image-input" | "tool-calling";

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  icon: (props: IconProps) => JSX.Element;
  disabled: boolean;
  capabilities: Capability[];
}

export const models: Array<Model> = [
  {
    id: "o1-mini",
    label: "o1 mini",
    apiIdentifier: "openai:o1-mini",
    description: "Modelo de raciocínio poderoso e rápido",
    icon: Icons.OpenAI,
    disabled: false,
    capabilities: [],
  },
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "openai:gpt-4o-mini",
    description: "Modelo pequeno para tarefas rápidas e leves",
    icon: Icons.OpenAI,
    disabled: false,
    capabilities: ["image-input", "tool-calling"],
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "openai:gpt-4o",
    description: "Para tarefas complexas e de múltiplas etapas",
    icon: Icons.OpenAI,
    disabled: false,
    capabilities: ["image-input", "tool-calling"],
  },
  {
    id: "deepseek-reasoner",
    label: "DeepSeek-R1",
    apiIdentifier: "siliconflow:deepseek-ai/DeepSeek-R1",
    description: "Otimizado para raciocínio e lógica",
    icon: Icons.DeepSeek,
    disabled: true,
    capabilities: [],
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    label: "DeepSeek-R1 > llama-70b",
    apiIdentifier: "groq:deepseek-r1-distill-llama-70b",
    description: "Rápido e equilibrado para tarefas de raciocínio",
    icon: Icons.DeepSeek,
    disabled: false,
    capabilities: [],
  },
  {
    id: "gemini-2.0-flash-exp",
    label: "Gemini 2.0 Flash Exp",
    apiIdentifier: "google:gemini-2.0-flash-exp",
    description: "Rápido e eficiente para tarefas ágeis",
    icon: Icons.Google,
    disabled: false,
    capabilities: ["image-input", "tool-calling"],
  },
] as const;

export function defineCapability(model: Model) {
  return {
    can(...abilities: Capability[]) {
      return abilities.map((i) => model.capabilities.includes(i)).some(Boolean);
    },
  };
}

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
