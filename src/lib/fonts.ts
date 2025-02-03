import { GeistMono } from "geist/font/mono";
import { Inter as FontSans } from "next/font/google";

export const fontMono = GeistMono;

export const fontSans = FontSans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
