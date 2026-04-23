"use client"

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"
import type { ChartDataPoint } from "./forecast-utils"
import { computeYAxisDomain } from "./forecast-utils"

import { formatDisplayArea, getBarangayAreaByName } from "@/lib/utils"

// ── Props ────────────────────────────────────────────────────────────

interface ForecastChartProps {
  chartData: ChartDataPoint[]
  selectedClasses: Set<string>
  currentYear: number
  selectedBarangay: string
}

// ── Custom tooltip ───────────────────────────────────────────────────

function ForecastTooltipContent({
  active,
  payload,
  label,
  selectedBarangay,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value?: number; color?: string }>
  label?: string | number
  selectedBarangay: string
}) {
  if (!active || !payload?.length) return null

  // Merge historical + forecast entries per class (deduplicate at boundary)
  const classValues = new Map<
    string,
    { value: number; isForecast: boolean; color: string; label: string }
  >()

  for (const item of payload) {
    const dataKey = String(item.dataKey)
    if (item.value == null) continue

    const isForecast = dataKey.endsWith("_forecast")
    const classId = isForecast ? dataKey.replace("_forecast", "") : dataKey

    const cls = LAND_COVER_CLASSES.find((c) => c.id === classId)
    if (!cls) continue

    // Keep the first occurrence (historical takes priority at boundary)
    if (!classValues.has(classId)) {
      classValues.set(classId, {
        value: Number(item.value),
        isForecast,
        color: cls.color,
        label: cls.label,
      })
    }
  }

  if (classValues.size === 0) return null

  const isForecastPoint = (
    payload[0] as unknown as { payload?: { isForecast?: boolean } }
  )?.payload?.isForecast

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2.5 shadow-xl text-xs">
      {/* Quarter label */}
      <div className="font-medium mb-2 flex items-center gap-2">
        <span>{
          (payload[0] as unknown as { payload?: { displayLabel?: string } })?.payload?.displayLabel ?? label
        }</span>
        {isForecastPoint && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Forecast
          </span>
        )}
      </div>

      {/* Class values */}
      <div className="grid gap-1">
        {Array.from(classValues.entries())
          .sort(([, a], [, b]) => b.value - a.value)
          .map(([classId, info]) => {
            const totalArea = selectedBarangay ? getBarangayAreaByName(selectedBarangay) : 0;
            const classArea = totalArea * (info.value / 100);

            return (
              <div
                key={classId}
                className="flex items-center justify-between gap-6"
                style={{ fontWeight: isForecastPoint && info.isForecast ? 400 : 500 }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: info.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{info.label}</span>
                    {selectedBarangay && (
                      <span className="text-xs text-muted-foreground/60 font-normal">
                        {formatDisplayArea(classArea)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono tabular-nums text-foreground">
                  {info.value.toFixed(2)}%
                </span>
              </div>
            );
          })}
      </div>
    </div>
  )
}

// ── Main chart ───────────────────────────────────────────────────────

export function ForecastChart({
  chartData,
  selectedClasses,
  currentYear,
  selectedBarangay
}: ForecastChartProps) {
  const [yMin, yMax] = computeYAxisDomain(chartData, selectedClasses)

  // Build shadcn chart config
  const chartConfig: ChartConfig = {}
  for (const cls of LAND_COVER_CLASSES) {
    chartConfig[cls.id] = { label: cls.label, color: cls.color }
    chartConfig[`${cls.id}_forecast`] = {
      label: `${cls.label} (Forecast)`,
      color: cls.color,
    }
  }

  const activeClasses = LAND_COVER_CLASSES.filter((cls) =>
    selectedClasses.has(cls.id)
  )
  const hasForecast = chartData.some((d) => d.isForecast)

  // ── Empty states ─────────────────────────────────────────────────

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No data available for the selected range.
      </div>
    )
  }

  if (selectedClasses.size === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select at least one class to display.
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-full w-full min-h-[280px]"
    >
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 16, left: -4, bottom: 10 }}
      >
        {/* Gradient definitions */}
        <defs>
          {activeClasses.map((cls) => (
            <linearGradient
              key={`g-${cls.id}`}
              id={`gradient-${cls.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={cls.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={cls.color} stopOpacity={0.03} />
            </linearGradient>
          ))}
          {activeClasses.map((cls) => (
            <linearGradient
              key={`gf-${cls.id}`}
              id={`gradient-${cls.id}-forecast`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={cls.color} stopOpacity={0.12} />
              <stop offset="95%" stopColor={cls.color} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          className="stroke-border/30"
        />

        <XAxis
          dataKey="xKey"
          type="number"
          domain={["dataMin", "dataMax"]}
          allowDecimals={true}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          ticks={Array.from(new Set(chartData.map((d) => d.year)))}
          tickFormatter={(val: number) => String(Math.round(val))}
        />

        <YAxis
          domain={[yMin, yMax]}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${value.toFixed(0)}%`}
          fontSize={12}
          width={42}
        />

        <Tooltip
          content={<ForecastTooltipContent selectedBarangay={selectedBarangay} />}
          cursor={{
            stroke: "#9ca3af",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
        />

        {/* Forecast boundary line */}
        {hasForecast && (() => {
          // Find the xKey of the last historical quarter for the boundary line
          const lastHistorical = [...chartData].reverse().find((d) => !d.isForecast)
          const boundaryXKey = lastHistorical ? lastHistorical.xKey : undefined
          return boundaryXKey != null ? (
            <ReferenceLine
              x={boundaryXKey}
              stroke="#9ca3af"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: "Forecast →",
                position: "insideTopRight",
                fill: "#9ca3af",
                fontSize: 11,
                fontWeight: 500,
              }}
            />
          ) : null
        })()}

        {/* Historical area fills — solid strokes */}
        {activeClasses.map((cls) => (
          <Area
            key={cls.id}
            type="monotone"
            dataKey={cls.id}
            stroke={cls.color}
            strokeWidth={2}
            fill={`url(#gradient-${cls.id})`}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              fill: cls.color,
              stroke: "#fff",
            }}
            connectNulls={false}
          />
        ))}

        {/* Forecast area fills — dashed strokes, lighter fill */}
        {activeClasses.map((cls) => (
          <Area
            key={`${cls.id}_forecast`}
            type="monotone"
            dataKey={`${cls.id}_forecast`}
            stroke={cls.color}
            strokeWidth={2}
            strokeDasharray="6 3"
            fill={`url(#gradient-${cls.id}-forecast)`}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              fill: cls.color,
              stroke: "#fff",
            }}
            connectNulls={false}
            legendType="none"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}
