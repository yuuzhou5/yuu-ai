"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ChatDetailsContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ChatDetailsDialogContext = createContext<ChatDetailsContextType>({} as ChatDetailsContextType);

export function ChatDetailsDialogProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <ChatDetailsDialogContext.Provider value={{ open, setOpen }}>
      <ChatDetailsDialog open={open} setOpen={setOpen} />

      {children}
    </ChatDetailsDialogContext.Provider>
  );
}

export function useChatDetailsDialog() {
  return useContext(ChatDetailsDialogContext);
}

export function ChatDetailsDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
