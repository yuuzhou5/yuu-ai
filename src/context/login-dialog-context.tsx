"use client";

import { createContext, useContext, useState } from "react";
import { PropsWithChildren } from "react";

import { LoginDialog } from "@/components/login-dialog";

type LoginDialogContextValues = {
  isOpen: boolean;

  open(): void;
  close(): void;
};

const LoginDialogContext = createContext<LoginDialogContextValues>(
  {} as LoginDialogContextValues
);

export function LoginDialogProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }

  return (
    <LoginDialogContext.Provider value={{ close, isOpen, open }}>
      {children}

      <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </LoginDialogContext.Provider>
  );
}

export function useLoginDialog() {
  return useContext(LoginDialogContext);
}
