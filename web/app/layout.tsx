import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Model Comparison Dashboard",
  description: "Compare AI models for image classification - Cost, Performance, and Quality Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.variable} h-full antialiased bg-gray-50 dark:bg-gray-900`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
