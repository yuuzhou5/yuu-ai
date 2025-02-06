"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConfigurationContextValues = {
  dialogOpen: boolean;
  setDialogOpen(open: boolean): void;
};

const ConfigContext = createContext<ConfigurationContextValues>({} as ConfigurationContextValues);

export function ConfigProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <ConfigContext.Provider
      value={{
        setDialogOpen: setOpen,
        dialogOpen: open,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}

export default function ConfigDialog() {
  const { dialogOpen, setDialogOpen } = useConfig();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Configurações</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
