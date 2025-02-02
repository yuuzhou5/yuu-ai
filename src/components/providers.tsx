"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import * as React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import {
  ConfirmDialogProvider as BaseConfirmDialogProvider,
  ConfirmOptions,
} from "@omit/react-confirm-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}

export function ConfirmDialogProvider({
  children,
  ...props
}: React.PropsWithChildren<ConfirmOptions>) {
  return (
    <BaseConfirmDialogProvider {...props}>{children}</BaseConfirmDialogProvider>
  );
}

export function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
