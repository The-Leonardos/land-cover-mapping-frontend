"use client"

import { useState } from "react"
import { generateSegmentationOverlay } from "@/lib/utils/segmentation-mapper"

interface InteractiveMapGridProps {
    barangays: readonly string[]
    selectedBarangay: string | null
    onBarangaySelect: (barangay: string) => void
    year: number
    shouldRenderSegmentation?: boolean
}

export function InteractiveMapGrid({
                                       barangays,
                                       selectedBarangay,
                                       onBarangaySelect,
                                       year,
                                       shouldRenderSegmentation,
                                   }: InteractiveMapGridProps) {

    const [hoveredBarangay, setHoveredBarangay] = useState<string | null>(null)

    const width = typeof window !== "undefined" ? window.innerWidth : 1200
    const gridCols = width < 640 ? 3 : width < 1024 ? 5 : 9

    const gridRows = Math.ceil(129 / gridCols)

    return (
        <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-muted dark:to-black/80 overflow-auto">
            <div
                className="gap-1"
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gap: "4px",
                    width: "100%",
                    maxWidth: "1200px",
                    aspectRatio: gridCols < 5 ? "1" : "16/9",
                }}
            >
                {barangays.slice(0, gridCols * gridRows).map((barangay, idx) => {
                    const segmentation = generateSegmentationOverlay(barangay, year)
                    const dominantClass = Object.entries(segmentation.classDistribution).sort(([, a], [, b]) => b - a)[0]
                    const dominantColor = dominantClass
                        ? {
                        water: "#1e40af",
                        trees: "#15803d",
                        grass: "#84cc16",
                        flooded_veg: "#0d9488",
                        crops: "#f59e0b",
                        shrub: "#ca8a04",
                        snow: "#f8fafc",
                        built: "#64748b",
                        bare: "#92400e",
                    }[dominantClass[0]] || "#374151"
                        : "#374151"

                    const isSelected = selectedBarangay === barangay
                    const isHovered = hoveredBarangay === barangay

                    return (
                        <button
                            key={idx}
                            onClick={() => onBarangaySelect(barangay)}
                            onMouseEnter={() => setHoveredBarangay(barangay)}
                            onMouseLeave={() => setHoveredBarangay(null)}
                            className="relative rounded-lg transition-all duration-200 group touch-active"
                            style={{
                                backgroundColor: dominantColor,
                                border: isSelected
                                    ? "3px solid #10b981"
                                    : isHovered
                                        ? "2px solid #06b6d4"
                                        : "2px solid rgba(255,255,255,0.1)",
                                opacity: isSelected ? 1 : isHovered ? 0.9 : 0.8,
                                transform: isSelected ? "scale(1.05)" : isHovered ? "scale(1.02)" : "scale(1)",
                                cursor: "pointer",
                                minHeight: "40px",
                            }}
                        >
                            {/* Tooltip on hover */}
                            {isHovered && (
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card dark:bg-black/90 text-foreground text-xs px-2 py-1 rounded whitespace-nowrap z-10 border border-border shadow-lg">
                                    {barangay}
                                </div>
                            )}

                            {/* Cell content */}
                            <div className="w-full h-full flex items-center justify-center p-1 text-xs text-white/60 font-mono font-semibold">
                                {barangay.length > 8 ? barangay.slice(0, 6) + ".." : barangay}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Help text - Responsive */}
            <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-xs text-muted-foreground bg-card/70 backdrop-blur-sm px-2 py-1.5 md:px-3 md:py-2 rounded-lg max-w-xs">
                <span className="hidden sm:inline">Click any cell to view detailed barangay analysis</span>
                <span className="sm:hidden">Tap cell for analysis</span>
            </div>
        </div>
    )
}
