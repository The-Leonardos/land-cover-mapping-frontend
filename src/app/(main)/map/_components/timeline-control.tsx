"use client";

import { YEARS } from "@/lib/utils/constants";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";

export function TimelineControl() {
  const { currentYear, setCurrentYear } = useBarangayStore();
  return (
    <div className="flex items-center gap-2 md:gap-4 w-full">
      {/* Slider and Year Labels */}
      <div className="flex-1 space-ys-1 md:space-y-2">
        <div className="relative">
          <input
            type="range"
            min={YEARS[0]}
            max={YEARS[YEARS.length - 1]}
            value={currentYear}
            onChange={(e) => setCurrentYear(Number.parseInt(e.target.value))}
            className="w-full h-1.5 md:h-2 bg-muted/50 dark:bg-muted/30 rounded-full appearance-none cursor-pointer slider-primary"
          />
          {/* Custom track fill */}
          <div
            className="absolute top-0 left-0 h-1.5 md:h-2 bg-primary rounded-full pointer-events-none"
            style={{
              width: `${((currentYear - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) * 100}%`,
            }}
          />
        </div>
        <div className="hidden sm:flex justify-between text-xs text-muted-foreground px-0.5">
          {YEARS.map((year) => (
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
          {YEARS.filter((_, i) => i % 2 === 0 || i === YEARS.length - 1).map(
            (year) => (
              <span
                key={year}
                className={`transition-colors ${currentYear === year ? "font-bold text-primary" : ""}`}
              >
                {year}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Year Selected Display */}
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Year Selected
        </p>
        <p className="text-2xl md:text-4xl font-bold text-foreground">
          {currentYear}
        </p>
      </div>
    </div>
  );
}
