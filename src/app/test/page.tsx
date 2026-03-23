"use client";

import { DynamicWorldImageRenderer } from "@/components/dynamic-world-image-renderer";

export default function TestPage() {
    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
            <header className="p-4 border-b border-border bg-card flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold">GeoTIFF Renderer</h1>
                    <p className="text-xs text-muted-foreground">Rendering 2023_Q1.tif (Sentinel-2 B4, B3, B2 Bands)</p>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-primary/20 text-primary rounded-full uppercase font-bold tracking-wider">Divide by 10,000</span>
                    <span className="text-[10px] px-2 py-1 bg-green-500/20 text-green-500 rounded-full uppercase font-bold tracking-wider">RGB Mode</span>
                </div>
            </header>
            
            <main className="flex-1 bg-black relative flex items-center justify-center p-8 overflow-auto">
                <DynamicWorldImageRenderer url="/DW_RGB_2023_Q1.tif" />
            </main>
            
            <footer className="p-3 border-t border-border bg-card text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                land cover mapping monitoring agent - diagnostic visualization
            </footer>
        </div>
    );
}
