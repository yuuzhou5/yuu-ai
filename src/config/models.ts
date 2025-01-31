import { Icons } from "@/components/icons";

export const models = [
  {
    id: "openai:gpt-4o",
    name: "GPT-4o",
    icon: Icons.OpenAI,
    disabled: false,
  },
  {
    id: "openai:gpt-4o-mini",
    name: "GPT-4o mini",
    icon: Icons.OpenAI,
    disabled: false,
  },
  {
    id: "deepseek:deepseek-reasoner",
    name: "DeepSeek-R1",
    icon: Icons.DeepSeek,
    disabled: true,
  },
  {
    id: "deepseek:deepseek-chat",
    name: "DeepSeek-V3",
    icon: Icons.DeepSeek,
    disabled: true,
  },
  {
    id: "google:gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash Exp",
    icon: Icons.Google,
    disabled: false,
  },
  {
    id: "google:gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    icon: Icons.Google,
    disabled: false,
  },
];
