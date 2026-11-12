import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://focusforge.app"),
  title: { default: "FocusForge — Short games for sharper focus", template: "%s | FocusForge" },
  description: "Play short, thoughtfully designed attention and memory challenges. Start with Number Recall and track your progress privately on your device.",
  alternates: { canonical: "/" },
  openGraph: { title: "FocusForge", description: "Train your attention. One challenge at a time.", type: "website", url: "/", siteName: "FocusForge" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${mono.variable}`}><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
