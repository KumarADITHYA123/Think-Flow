import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ToasterwithTheme from "@/components/ui/ToasterwithTheme";
import { unstable_ViewTransition as ViewTransition } from "react";
import Navbar from "@/components/Navbar";

const font = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThinkFlow - AI Document Research",
  description: "Generate whole research documents using AI instantly✨🔖",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Safely handle ViewTransition if it is undefined (e.g. during server-side pre-rendering)
  const VT = ViewTransition;
  const content = VT ? <VT>{children}</VT> : children;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class">
          <Navbar />
          {content}
          <ToasterwithTheme />
        </ThemeProvider>
      </body>
    </html>
  );
}

