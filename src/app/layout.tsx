import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { ConfirmDialogProvider, QueryProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { LoginDialogProvider } from "@/context/login-dialog-context";
import { fontMono, fontSans, GeistSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Yuu AI",
  description: "AI Hub for LLM Models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={cn(
        "min-h-screen bg-background font-sans antialiased scroll-smooth",
        fontSans.variable,
        fontMono.variable,
        GeistSans.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>

      <body>
        <SessionProvider>
          <QueryProvider>
            <ConfirmDialogProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <LoginDialogProvider>
                  {children}

                  <Toaster richColors />
                </LoginDialogProvider>
              </ThemeProvider>
            </ConfirmDialogProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
