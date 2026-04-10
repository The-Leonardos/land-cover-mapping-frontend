"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ForecastChartProps {
  chartData: Array<{ year: number | string; [key: string]: number | string }>
  selectedClasses: Set<string>
  selectedBarangay: string | null
  startYear: number
  endYear: number
}

export function ForecastChart({
  chartData,
  selectedClasses,
  selectedBarangay,
  startYear,
  endYear,
}: ForecastChartProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Land Cover Trends
          </span>
          <span>
            {startYear} - {endYear}
          </span>
        </div>
        {selectedBarangay && (
          <div className="text-[10px] md:text-xs text-muted-foreground bg-muted/50 dark:bg-black/30 px-2 md:px-3 py-1 rounded-full">
            Data points: {chartData.length} years | Resolution: Annual
            average
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border"
          />
          <XAxis
            dataKey="year"
            stroke="currentColor"
            className="text-muted-foreground"
          />
          <YAxis
            stroke="currentColor"
            className="text-muted-foreground"
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: any) => `${Number(value).toFixed(1)}%`}
          />
          <Legend />
          {selectedClasses.has("water") && (
            <Line
              type="monotone"
              dataKey="water"
              stroke="#06b6d4"
              strokeWidth={2}
              name="Water"
              dot={false}
            />
          )}
          {selectedClasses.has("trees") && (
            <Line
              type="monotone"
              dataKey="trees"
              stroke="#22c55e"
              strokeWidth={2}
              name="Trees"
              dot={false}
            />
          )}
          {selectedClasses.has("grass") && (
            <Line
              type="monotone"
              dataKey="grass"
              stroke="#eab308"
              strokeWidth={2}
              name="Grass"
              dot={false}
            />
          )}

          {selectedClasses.has("crops") && (
            <Line
              type="monotone"
              dataKey="crops"
              stroke="#f97316"
              strokeWidth={2}
              name="Crops"
              dot={false}
            />
          )}
          {selectedClasses.has("shrub") && (
            <Line
              type="monotone"
              dataKey="shrub"
              stroke="#84cc16"
              strokeWidth={2}
              name="Shrub/Scrub"
              dot={false}
            />
          )}
          {selectedClasses.has("built") && (
            <Line
              type="monotone"
              dataKey="built"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Built-up"
              dot={false}
            />
          )}
          {selectedClasses.has("bare") && (
            <Line
              type="monotone"
              dataKey="bare"
              stroke="#a16207"
              strokeWidth={2}
              name="Bare Ground"
              dot={false}
            />
          )}

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
