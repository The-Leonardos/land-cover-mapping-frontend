import { BarChart2, Layers } from "lucide-react"

type ForecastChartEmptyProps = {
  reason: "no-data" | "no-classes"
}

export function ForecastChartEmpty({ reason }: ForecastChartEmptyProps) {
  const isNoData = reason === "no-data"

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
      {/* Muted chart illustration */}
      <div className="relative flex items-end gap-1.5 h-16 opacity-20">
        {[40, 65, 50, 80, 55, 70, 45, 60, 75, 50].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm bg-muted-foreground"
            style={{ height: `${h}%` }}
          />
        ))}
        {/* Overlay scan line */}
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-muted-foreground/40" />
        </div>
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/60">
        {isNoData ? (
          <BarChart2 className="w-5 h-5 text-muted-foreground/60" />
        ) : (
          <Layers className="w-5 h-5 text-muted-foreground/60" />
        )}
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground/60 font-medium">
        {isNoData ? "No data for this range" : "No classes selected"}
      </p>
    </div>
  )
}
