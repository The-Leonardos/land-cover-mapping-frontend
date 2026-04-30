import type { Metadata } from "next";
import { type ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Land Cover Monitoring Agent",
  description: "DeepLabV3+ & DeepAR-based environmental monitoring system for Baguio City",
}

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased text-foreground`}>
        <TooltipProvider>
          {children}
          <Toaster richColors theme="dark" />
        </TooltipProvider>
      </body>
    </html>
  )
}
