import { YEARS } from "@/lib/constants"

interface ForecastYearFiltersProps {
  startYear: number
  endYear: number
  onStartYearChange: (year: number) => void
  onEndYearChange: (year: number) => void
}

export function ForecastYearFilters({
  startYear,
  endYear,
  onStartYearChange,
  onEndYearChange,
}: ForecastYearFiltersProps) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:items-end gap-2 md:gap-4 mb-4 md:mb-6">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground font-medium">
          Start Year
        </label>
        <select
          value={startYear}
          onChange={(e) => onStartYearChange(Number(e.target.value))}
          className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm text-foreground"
        >
          {YEARS.map((y: number) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground font-medium">
          End Year
        </label>
        <select
          value={endYear}
          onChange={(e) => onEndYearChange(Number(e.target.value))}
          className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm text-foreground"
        >
          {YEARS.map((y: number) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
