import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MindSprint AI — Reflect • Recover • Recharge",
  description:
    "AI wellness copilot for students preparing for JEE, NEET, CAT, UPSC, and board exams. Get personalized stress insights, brain fuel recommendations, and recovery plans.",
  keywords: [
    "student wellness",
    "exam stress",
    "JEE",
    "NEET",
    "CAT",
    "UPSC",
    "AI wellness",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black font-sans text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
