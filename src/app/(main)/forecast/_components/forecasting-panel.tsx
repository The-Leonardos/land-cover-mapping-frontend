"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { YEARS } from "@/lib/constants"
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore"
import landCoverData from "../../../../../land_cover_data.json"

interface QuarterlyLandCoverData {
  barangay: string
  year: number
  quarter: number
  water: number
  trees: number
  grass: number
  crops: number
  shrub: number
  built: number
  bare: number
}

function getBarangayTimeSeries(barangay: string) {
  const barangayData = (landCoverData as QuarterlyLandCoverData[]).filter(
    (d) => d.barangay.toLowerCase() === barangay.toLowerCase()
  )

  // Group by year and take average of all quarters
  const yearlyAverages: { [key: number]: { [key: string]: number } } = {}

  barangayData.forEach((point) => {
    if (!yearlyAverages[point.year]) {
      yearlyAverages[point.year] = {
        water: 0,
        trees: 0,
        grass: 0,
        crops: 0,
        shrub: 0,
        built: 0,
        bare: 0,
        count: 0,
      }
    }

    yearlyAverages[point.year].water += point.water
    yearlyAverages[point.year].trees += point.trees
    yearlyAverages[point.year].grass += point.grass
    yearlyAverages[point.year].crops += point.crops
    yearlyAverages[point.year].shrub += point.shrub
    yearlyAverages[point.year].built += point.built
    yearlyAverages[point.year].bare += point.bare
    ;(yearlyAverages[point.year] as any).count += 1
  })

  // Calculate averages
  const result: { [key: string]: (number | string)[] } = {
    water: [],
    trees: [],
    grass: [],
    crops: [],
    shrub: [],
    built: [],
    bare: [],
    timestamps: [],
  }

  Object.keys(yearlyAverages)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((year) => {
      const count = (yearlyAverages[year] as any).count
      result.timestamps.push(year)
      result.water.push(yearlyAverages[year].water / count)
      result.trees.push(yearlyAverages[year].trees / count)
      result.grass.push(yearlyAverages[year].grass / count)
      result.crops.push(yearlyAverages[year].crops / count)
      result.shrub.push(yearlyAverages[year].shrub / count)
      result.built.push(yearlyAverages[year].built / count)
      result.bare.push(yearlyAverages[year].bare / count)
    })

  return result
}

export function ForecastingPanel() {
  const { selectedBarangay: storeBarangay } = useBarangayStore()
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null)
  const [startYear, setStartYear] = useState(2016)
  const [endYear, setEndYear] = useState(2025)
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set(["trees", "built", "grass", "water"])
  )
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

  // Initialize from store when component mounts
  useEffect(() => {
    if (storeBarangay && !selectedBarangay) {
      setSelectedBarangay(storeBarangay)
    }
  }, [storeBarangay])

  // Update store when local selectedBarangay changes
  const toggleClass = (classId: string) => {
    const newSet = new Set(selectedClasses)
    if (newSet.has(classId)) {
      newSet.delete(classId)
    } else {
      newSet.add(classId)
    }
    setSelectedClasses(newSet)
  }

  const selectAll = () => {
    if (selectedClasses.size === LAND_COVER_CLASSES.length) {
      setSelectedClasses(new Set())
    } else {
      setSelectedClasses(new Set(LAND_COVER_CLASSES.map((c) => c.id)))
    }
  }

  // Generate chart data
  const generateChartData = () => {
    if (!selectedBarangay) return []

    const timeSeries = getBarangayTimeSeries(selectedBarangay)
    const data: Array<{ year: number | string; [key: string]: number | string }> = []

    for (let i = 0; i < timeSeries.timestamps.length; i++) {
      const year = Number(timeSeries.timestamps[i])
      if (year >= startYear && year <= endYear) {
        data.push({
          year,
          water: timeSeries.water[i] || 0,
          trees: timeSeries.trees[i] || 0,
          grass: timeSeries.grass[i] || 0,
          crops: timeSeries.crops[i] || 0,
          shrub: timeSeries.shrub[i] || 0,
          built: timeSeries.built[i] || 0,
          bare: timeSeries.bare[i] || 0,
        })
      }
    }

    return data
  }

  const chartData = generateChartData()

  // Generate table data
  const generateTableData = () => {
    if (!selectedBarangay || chartData.length === 0) return []

    const latest = chartData[chartData.length - 1]
    const first = chartData[0]

    return LAND_COVER_CLASSES.filter((c) => selectedClasses.has(c.id)).map(
      (cls) => {
        const latestVal = (latest as any)[cls.id] || 0
        const firstVal = (first as any)[cls.id] || 0
        const trend = (latestVal - firstVal) / (chartData.length - 1)
        const range = latestVal - firstVal

        return {
          ...cls,
          start: firstVal,
          latest: latestVal,
          trend: trend,
          change: range,
        }
      }
    )
  }

  const tableData = generateTableData()

  return (
    <div className="flex flex-col h-full bg-background p-3 md:p-6 overflow-auto">
      {/* Header Context */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Land Cover Time Series Analysis
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Historical land cover change tracking from 2016 to 2026
            </p>
          </div>
          {selectedBarangay && (
            <div className="text-left sm:text-right">
              <p className="text-xs md:text-sm text-muted-foreground">
                Analyzing
              </p>
              <p className="text-base md:text-lg font-semibold text-primary">
                {selectedBarangay}
              </p>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 md:px-4 py-2 md:py-3 mt-3 md:mt-4">
          <p className="text-xs md:text-sm text-foreground">
            <span className="font-semibold text-primary">Data Source:</span> Land
            cover observations from 2016-2025. Data aggregated on a yearly basis
            from quarterly observations.
          </p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-2 sm:flex sm:items-end gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">
            Start Year
          </label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm text-foreground"
          >
            {YEARS.map(
              (y: number) => (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">
            End Year
          </label>
          <select
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm text-foreground"
          >
            {YEARS.map(
              (y: number) => (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>
        </div>

        {/* Quick Stats - Hidden on small mobile */}
        {selectedBarangay && chartData.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 md:gap-4 ml-auto col-span-2">
            <div className="text-center px-3 md:px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Forest Cover
              </p>
              <p className="text-base md:text-lg font-bold text-green-500">
                {Number(chartData[chartData.length - 1]?.trees)?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="text-center px-3 md:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Built-up
              </p>
              <p className="text-base md:text-lg font-bold text-blue-500">
                {Number(chartData[chartData.length - 1]?.built)?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Quick Stats */}
      {selectedBarangay && chartData.length > 0 && (
        <div className="flex sm:hidden items-center gap-2 mb-4">
          <div className="flex-1 text-center px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-[10px] text-muted-foreground">Forest</p>
            <p className="text-base font-bold text-green-500">
              {Number(chartData[chartData.length - 1]?.trees)?.toFixed(1) || 0}%
            </p>
          </div>
          <div className="flex-1 text-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-[10px] text-muted-foreground">Built-up</p>
            <p className="text-base font-bold text-blue-500">
              {Number(chartData[chartData.length - 1]?.built)?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      )}

      {/* Classes Selection */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
          <span className="text-xs md:text-sm font-medium text-foreground">
            Classes
          </span>
          <label className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={selectedClasses.size === LAND_COVER_CLASSES.length}
              onChange={selectAll}
              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-border accent-primary"
            />
            Select All
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2">
          {LAND_COVER_CLASSES.map((cls) => (
            <label
              key={cls.id}
              className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border cursor-pointer transition-colors ${
                selectedClasses.has(cls.id)
                  ? "bg-muted/50 dark:bg-black/30 border-border"
                  : "bg-muted/20 dark:bg-black/10 border-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedClasses.has(cls.id)}
                onChange={() => toggleClass(cls.id)}
                className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-border accent-primary"
              />
              <span
                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cls.color }}
              />
              <span className="text-xs md:text-sm text-foreground truncate">
                {cls.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-4">
        <button
          onClick={() => setViewMode("chart")}
          className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
            viewMode === "chart"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 dark:bg-black/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          Chart View
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
            viewMode === "table"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 dark:bg-black/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          Table View
        </button>
      </div>

      {/* Chart or Table */}
      <div className="flex-1 border-2 border-primary/30 rounded-lg bg-muted/20 dark:bg-black/20 p-2 md:p-4 min-h-[300px] md:min-h-[400px]">
        {viewMode === "chart" ? (
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
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Class
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Start
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Latest
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Trend
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Range
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      {row.label}
                    </td>
                    <td className="py-3 px-4 text-center text-foreground">
                      {(row as any).start.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center text-foreground">
                      {row.latest.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center text-foreground">
                      {row.trend.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`flex items-center justify-center gap-1 ${
                          row.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {row.change >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(row.change).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}