import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { ConfirmDialogProvider, QueryProvider, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { LoginDialogProvider } from "@/context/login-dialog-context";
import { fontMono, fontSans, GeistSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "AI",
    "ChatBot",
    "ChatGPT",
    "Next.js",
    "React",
    "TypeScript",
    "Gemini",
    "DeepSeek",
    "Grok",
    "Anthropic",
    "Llama",
  ],
  authors: [
    {
      name: "Yuu",
      url: "",
    },
  ],
  creator: "Yuu",
  openGraph: {
    type: "website",
    title: siteConfig.name,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
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
      {process.env.NODE_ENV === "development" && (
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        </head>
      )}

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
