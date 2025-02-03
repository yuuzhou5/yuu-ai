import { JSX } from "react";

import { IconProps, Icons } from "@/components/icons";

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  icon: (props: IconProps) => JSX.Element;
  disabled: boolean;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "openai:gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
    icon: Icons.OpenAI,
    disabled: false,
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "openai:gpt-4o",
    description: "For complex, multi-step tasks",
    icon: Icons.OpenAI,
    disabled: false,
  },
  {
    id: "deepseek-reasoner",
    label: "DeepSeek-R1",
    apiIdentifier: "deepseek:deepseek-reasoner",
    description: "Optimized for reasoning and logic",
    icon: Icons.DeepSeek,
    disabled: true,
  },
  {
    id: "gemini-2.0-flash-exp",
    label: "Gemini 2.0 Flash Exp",
    apiIdentifier: "google:gemini-2.0-flash-exp",
    description: "Fast and efficient for quick tasks",
    icon: Icons.Google,
    disabled: false,
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
