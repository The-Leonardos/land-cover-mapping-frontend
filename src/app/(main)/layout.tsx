"use client";

import { SharedHeader } from "@/components/shared-header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      <SharedHeader />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
