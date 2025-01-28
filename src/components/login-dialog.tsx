"use client";

import { signIn } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoginDialog } from "@/context/login-dialog-context";

import { Icons } from "./icons";
import { Button } from "./ui/button";

type LoginDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function OpenLoginDialog() {
  const { open } = useLoginDialog();

  return <Button onClick={open}>Entrar</Button>;
}

export function LoginDialog({ isOpen, setIsOpen }: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="lg:text-2xl font-bold tracking-normal">
            Entrar
          </DialogTitle>
          <DialogDescription>
            Escolha um provedor de autenticação abaixo.
          </DialogDescription>
        </DialogHeader>

        <Button
          variant="outline"
          className="w-full h-14"
          onClick={() => signIn("google")}
        >
          <Icons.Google className="mr-2" />
          Entrar com Google
        </Button>

        <Button variant="outline" className="w-full h-14">
          <Icons.Discord className="mr-2" />
          Entrar com Discord
        </Button>
      </DialogContent>
    </Dialog>
  );
}
