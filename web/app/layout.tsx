import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "./components/Cursor";
import { PageTransition } from "./components/PageTransition";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ullas JS — Senior Software Engineer",
  description:
    "Senior engineer shipping production web platforms in React, Next.js, TypeScript and Node.js — real-time logistics systems, config-driven ERPs and Teeme.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen antialiased">{children}
        <Cursor />
        <PageTransition />
      </body>
    </html>
  );
}
