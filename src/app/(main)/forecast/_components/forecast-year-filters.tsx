"use client"

interface ForecastYearFiltersProps {
  startYear: number
  endYear: number
  availableYears: number[]
  onStartYearChange: (year: number) => void
  onEndYearChange: (year: number) => void
}

/**
 * Year range selector with validation.
 * - Minimum gap: 1 year (e.g. 2024–2025 is the smallest valid range).
 * - Start options are limited to years before endYear.
 * - End options are limited to years after startYear.
 */
export function ForecastYearFilters({
  startYear,
  endYear,
  availableYears,
  onStartYearChange,
  onEndYearChange,
}: ForecastYearFiltersProps) {
  // Only show valid options that maintain the 1-year minimum gap
  const startOptions = availableYears.filter((y) => y < endYear)
  const endOptions = availableYears.filter((y) => y > startYear)

  const handleStartYearChange = (value: number) => {
    if (value >= endYear) {
      // Auto-adjust endYear to maintain the minimum gap
      const nextEnd = availableYears.find((y) => y > value)
      if (nextEnd) onEndYearChange(nextEnd)
    }
    onStartYearChange(value)
  }

  const handleEndYearChange = (value: number) => {
    if (value <= startYear) {
      // Auto-adjust startYear to maintain the minimum gap
      const prevStart = [...availableYears].reverse().find((y) => y < value)
      if (prevStart) onStartYearChange(prevStart)
    }
    onEndYearChange(value)
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        Range
      </span>

      <select
        value={startYear}
        onChange={(e) => handleStartYearChange(Number(e.target.value))}
        className="h-7 px-2 bg-muted/50 dark:bg-muted/20 border border-border rounded-md text-xs text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {startOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <span className="text-muted-foreground text-xs">—</span>

      <select
        value={endYear}
        onChange={(e) => handleEndYearChange(Number(e.target.value))}
        className="h-7 px-2 bg-muted/50 dark:bg-muted/20 border border-border rounded-md text-xs text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {endOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
