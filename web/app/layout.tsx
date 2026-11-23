import type { Metadata } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "./components/Cursor";
import { Shots } from "./components/Shots";
import { PageTransition } from "./components/PageTransition";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

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
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${serif.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen antialiased">{children}
        <Shots />
        <Cursor />
        <PageTransition />
      </body>
    </html>
  );
}
