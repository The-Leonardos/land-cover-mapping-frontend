"use client"

import { Play, Pause } from "lucide-react"

interface TimelineControlProps {
    currentYear: number
    onYearChange: (year: number) => void
    animating: boolean
    onAnimatingChange: (animating: boolean) => void
    years: number[]
}

export function TimelineControl({
                                    currentYear,
                                    onYearChange,
                                    animating,
                                    onAnimatingChange,
                                    years,
                                }: TimelineControlProps) {
    return (
        <div className="flex items-center gap-2 md:gap-4 w-full">
            {/* Play/Pause Button */}
            <button
                onClick={() => onAnimatingChange(!animating)}
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-foreground text-background rounded hover:opacity-90 transition-opacity flex-shrink-0"
            >
                {animating ? <Pause className="h-4 w-4 md:h-5 md:w-5" /> : <Play className="h-4 w-4 md:h-5 md:w-5" />}
            </button>

            {/* Slider and Year Labels */}
            <div className="flex-1 space-y-1 md:space-y-2">
                <div className="relative">
                    <input
                        type="range"
                        min={years[0]}
                        max={years[years.length - 1]}
                        value={currentYear}
                        onChange={(e) => onYearChange(Number.parseInt(e.target.value))}
                        className="w-full h-1.5 md:h-2 bg-muted/50 dark:bg-muted/30 rounded-full appearance-none cursor-pointer slider-primary"
                    />
                    {/* Custom track fill */}
                    <div
                        className="absolute top-0 left-0 h-1.5 md:h-2 bg-primary rounded-full pointer-events-none"
                        style={{ width: `${((currentYear - years[0]) / (years[years.length - 1] - years[0])) * 100}%` }}
                    />
                </div>
                <div className="hidden sm:flex justify-between text-xs text-muted-foreground px-0.5">
                    {years.map((year) => (
                        <span
                            key={year}
                            className={`transition-colors ${currentYear === year ? "font-bold text-primary" : "hover:text-foreground"}`}
                        >
              {year}
            </span>
                    ))}
                </div>
                {/* Mobile: Show only key years */}
                <div className="flex sm:hidden justify-between text-[10px] text-muted-foreground px-0.5">
                    {years.filter((_, i) => i % 2 === 0 || i === years.length - 1).map((year) => (
                        <span
                            key={year}
                            className={`transition-colors ${currentYear === year ? "font-bold text-primary" : ""}`}
                        >
              {year}
            </span>
                    ))}
                </div>
            </div>

            {/* Year Selected Display */}
            <div className="text-right flex-shrink-0">
                <p className="text-[10px] md:text-xs text-muted-foreground">Year Selected</p>
                <p className="text-2xl md:text-4xl font-bold text-foreground">{currentYear}</p>
            </div>
        </div>
    )
}
