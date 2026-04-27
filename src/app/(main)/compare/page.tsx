"use client";

import { useState } from "react";
import { CompareViewer } from "./_components/compare-viewer";
import { CompareYearSelector } from "./_components/compare-year-selector";

// Available years based on DW image filenames (2016–2026)
const AVAILABLE_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

export default function ComparePage() {
  const [year1, setYear1] = useState(2016);
  const [year2, setYear2] = useState(2026);

  // Ensure year1 < year2 when changing
  const handleYear1Change = (newYear: number) => {
    if (newYear >= year2) {
      const nextYear = AVAILABLE_YEARS.find((y) => y > newYear);
      if (nextYear) setYear2(nextYear);
    }
    setYear1(newYear);
  };

  const handleYear2Change = (newYear: number) => {
    if (newYear <= year1) {
      const prevYear = [...AVAILABLE_YEARS].reverse().find((y) => y < newYear);
      if (prevYear) setYear1(prevYear);
    }
    setYear2(newYear);
  };

  const year1Options = AVAILABLE_YEARS.filter((y) => y < year2);
  const year2Options = AVAILABLE_YEARS.filter((y) => y > year1);

  return (
    <>
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
        <div className="flex-1 relative min-w-0">
          <CompareViewer year1={year1} year2={year2} />
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="border-t border-border bg-card p-3 md:p-4 shrink-0 z-20">
        <div className="max-w-md mx-auto flex items-end gap-4">
          <CompareYearSelector
            year={year1}
            availableYears={year1Options}
            label="Base Year"
            onYearChange={handleYear1Change}
          />
          <div className="flex items-center justify-center pb-2.5">
            <span className="text-muted-foreground font-bold bg-muted/50 px-2.5 py-1 rounded text-xs ring-1 ring-border/50">
              VS
            </span>
          </div>
          <CompareYearSelector
            year={year2}
            availableYears={year2Options}
            label="Compare Year"
            onYearChange={handleYear2Change}
          />
        </div>
      </div>
    </>
  );
}
