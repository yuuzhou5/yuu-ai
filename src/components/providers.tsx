"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import * as React from "react";

import {
  ConfirmDialogProvider as BaseConfirmDialogProvider,
  ConfirmOptions,
} from "@omit/react-confirm-dialog";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ConfirmDialogProvider({
  children,
  ...props
}: React.PropsWithChildren<ConfirmOptions>) {
  return <BaseConfirmDialogProvider {...props}>{children}</BaseConfirmDialogProvider>;
}
