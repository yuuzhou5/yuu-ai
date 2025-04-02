import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Inter as FontSans } from "next/font/google";

import { cn } from "./utils";

const fontMono = GeistMono;

const fontSans = FontSans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const fontVariables = cn(GeistSans.variable, fontSans.variable, fontMono.variable);
