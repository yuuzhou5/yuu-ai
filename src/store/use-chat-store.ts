import { create } from "zustand";

type ChatState = {
  chatModel: string;
  setChatModel: (model: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chatModel: "gpt-4o-mini",
  setChatModel: (model) => set({ chatModel: model }),
}));
