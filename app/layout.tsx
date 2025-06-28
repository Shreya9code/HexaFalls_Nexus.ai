import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Provider from "./provider";
import { FloatingChatWidget } from "@/components/ui/FloatingChatWidget";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nexus.ai - AI Career Mentor",
  description: "Your personalized AI career coach for professional development, interview prep, and career guidance.",
  keywords: "AI career coach, career guidance, interview preparation, professional development, resume analyzer",
  authors: [{ name: "Nexus.ai Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="font-sans antialiased bg-gray-50">
          <Provider>
            {children}
            <Toaster />
            <FloatingChatWidget />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
