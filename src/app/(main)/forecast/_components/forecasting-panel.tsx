"use client"

import { useEffect, useState, useMemo } from "react"
import {
  getBarangayAllYearsTimeSeries,
  type TimeSeriesDataPoint,
} from "../_actions/getBarangayAllYearsTimeSeries"
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"
import {
  generateChartData,
  computeClassStats,
  getAvailableYears,
} from "./forecast-utils"
import { ForecastHeader } from "./forecast-header"
import { ForecastQuickStats } from "./forecast-quick-stats"
import { ForecastClassesSelector } from "./forecast-classes-selector"
import { ForecastYearFilters } from "./forecast-year-filters"
import { ForecastChart } from "./forecast-chart"
import { ForecastSkeleton } from "../_skeletons/forecast-skeleton"
import { Separator } from "@/components/ui/separator"

interface ForecastingPanelProps {
  selectedBarangay: string | null
}

export function ForecastingPanel({ selectedBarangay }: ForecastingPanelProps) {
  const [rawData, setRawData] = useState<TimeSeriesDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set(["trees", "built_up_area", "grass", "water"])
  )

  const currentYear = new Date().getFullYear()

  // Derived values
  const availableYears = useMemo(() => getAvailableYears(rawData), [rawData])

  const [startYear, setStartYear] = useState<number>(2016)
  const [endYear, setEndYear] = useState<number>(currentYear)

  // Reset year range when data loads (or barangay changes)
  useEffect(() => {
    if (availableYears.length > 0) {
      setStartYear(availableYears[0])
      setEndYear(availableYears[availableYears.length - 1])
    }
  }, [availableYears])

  // Fetch all data for the barangay
  useEffect(() => {
    async function fetchData() {
      if (!selectedBarangay) return
      setLoading(true)
      try {
        const data = await getBarangayAllYearsTimeSeries(selectedBarangay)
        setRawData(data)
      } catch (error) {
        console.error("Error fetching forecast data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedBarangay])

  // Chart & stats (memoized)
  const chartData = useMemo(
    () => generateChartData(rawData, startYear, endYear, currentYear),
    [rawData, startYear, endYear, currentYear]
  )

  const classStats = useMemo(
    () => computeClassStats(chartData, selectedClasses, currentYear),
    [chartData, selectedClasses, currentYear]
  )

  // Check if the full dataset (not just the filtered view) has forecast data
  const hasForecastData = useMemo(
    () => rawData.some((d) => d.year >= currentYear),
    [rawData, currentYear]
  )

  const yearRange: [number, number] | null =
    availableYears.length > 0
      ? [availableYears[0], availableYears[availableYears.length - 1]]
      : null

  // ── Handlers ─────────────────────────────────────────────────────

  const toggleClass = (classId: string) => {
    const next = new Set(selectedClasses)
    if (next.has(classId)) {
      next.delete(classId)
    } else {
      next.add(classId)
    }
    setSelectedClasses(next)
  }

  const selectAll = () => {
    if (selectedClasses.size === LAND_COVER_CLASSES.length) {
      setSelectedClasses(new Set())
    } else {
      setSelectedClasses(new Set(LAND_COVER_CLASSES.map((c) => c.id)))
    }
  }

  // ── Loading state ────────────────────────────────────────────────

  if (loading) {
    return <ForecastSkeleton />
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full gap-4 md:gap-5 p-3 md:p-6 overflow-auto bg-background">
      {/* Header */}
      <ForecastHeader
        selectedBarangay={selectedBarangay}
        hasForecastData={hasForecastData}
        yearRange={yearRange}
      />

      {/* Quick stat cards (dynamic, only selected classes) */}
      <ForecastQuickStats stats={classStats} />

      <Separator />

      {/* Controls: class filter + year range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <ForecastClassesSelector
          selectedClasses={selectedClasses}
          onToggleClass={toggleClass}
          onSelectAll={selectAll}
        />
        <ForecastYearFilters
          startYear={startYear}
          endYear={endYear}
          availableYears={availableYears}
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
        />
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[350px] md:min-h-[400px] rounded-xl ring-1 ring-foreground/10 bg-card p-3 md:p-4 overflow-hidden">
        <ForecastChart
          chartData={chartData}
          selectedClasses={selectedClasses}
          currentYear={currentYear}
        />
      </div>
    </div>
  )
}
