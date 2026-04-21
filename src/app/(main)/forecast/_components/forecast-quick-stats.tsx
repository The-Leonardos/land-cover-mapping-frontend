import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { ClassStat } from "./forecast-utils"

interface ForecastQuickStatsProps {
  stats: ClassStat[]
}

export function ForecastQuickStats({ stats }: ForecastQuickStatsProps) {
  if (stats.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex-shrink-0 min-w-[130px] rounded-xl p-3 transition-all hover:shadow-sm"
          style={{ backgroundColor: `${stat.color}15` }}
        >
          {/* Class label */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: stat.color }}
            />
            <span 
              className="text-[11px] font-semibold truncate"
              style={{ color: stat.color }}
            >
              {stat.label}
            </span>
          </div>

          {/* Value & trend */}
          <div className="flex items-end justify-between gap-2">
            <span 
              className="text-lg font-bold tabular-nums leading-none"
              style={{ color: stat.color }}
            >
              {stat.latestValue.toFixed(1)}%
            </span>

            <div
              className={`flex items-center gap-0.5 text-[11px] font-medium leading-none ${
                stat.trend === "up"
                  ? "text-emerald-500"
                  : stat.trend === "down"
                    ? "text-rose-500"
                    : "text-muted-foreground"
              }`}
            >
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : stat.trend === "down" ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              <span className="tabular-nums">
                {stat.change > 0 ? "+" : ""}
                {stat.change.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
