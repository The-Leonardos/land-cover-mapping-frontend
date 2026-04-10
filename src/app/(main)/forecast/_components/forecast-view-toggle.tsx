interface ForecastViewToggleProps {
  viewMode: "chart" | "table"
  onViewModeChange: (mode: "chart" | "table") => void
}

export function ForecastViewToggle({
  viewMode,
  onViewModeChange,
}: ForecastViewToggleProps) {
  return (
    <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-4">
      <button
        onClick={() => onViewModeChange("chart")}
        className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
          viewMode === "chart"
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50 dark:bg-black/30 text-muted-foreground hover:text-foreground"
        }`}
      >
        Chart View
      </button>
      <button
        onClick={() => onViewModeChange("table")}
        className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
          viewMode === "table"
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50 dark:bg-black/30 text-muted-foreground hover:text-foreground"
        }`}
      >
        Table View
      </button>
    </div>
  )
}
