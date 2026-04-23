"use client"

import type { TimeStep } from "./forecast-utils"

interface ForecastTimeStepToggleProps {
  timeStep: TimeStep
  onChange: (timeStep: TimeStep) => void
}

export function ForecastTimeStepToggle({ timeStep, onChange }: ForecastTimeStepToggleProps) {
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted/50 border border-border/50 flex-shrink-0">
      <button
        onClick={() => onChange("yearly")}
        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
          timeStep === "yearly"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Yearly
      </button>
      <button
        onClick={() => onChange("quarterly")}
        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
          timeStep === "quarterly"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Quarterly
      </button>
    </div>
  )
}
