"use client"

import { useState } from "react"
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"
import { ForecastHeader } from "./forecast-header"
import { ForecastYearFilters } from "./forecast-year-filters"
import { ForecastQuickStatsDesktop, ForecastQuickStatsMobile } from "./forecast-quick-stats"
import { ForecastClassesSelector } from "./forecast-classes-selector"
import { ForecastViewToggle } from "./forecast-view-toggle"
import { ForecastChart } from "./forecast-chart"
import { ForecastTable } from "./forecast-table"
import {
  generateChartData,
  generateTableData,
} from "./forecast-utils"

interface ForecastingPanelProps {
  selectedBarangay: string | null
}

export function ForecastingPanel({ selectedBarangay }: ForecastingPanelProps) {
  const [startYear, setStartYear] = useState(2016)
  const [endYear, setEndYear] = useState(2025)
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set(["trees", "built", "grass", "water"])
  )
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

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

  const chartData = generateChartData(selectedBarangay, startYear, endYear)
  const tableData = generateTableData(selectedBarangay, chartData, selectedClasses, LAND_COVER_CLASSES)

  return (
    <div className="flex flex-col h-full bg-background p-3 md:p-6 overflow-auto">
      <ForecastHeader selectedBarangay={selectedBarangay} />
      <ForecastYearFilters
        startYear={startYear}
        endYear={endYear}
        onStartYearChange={setStartYear}
        onEndYearChange={setEndYear}
      />
      <ForecastQuickStatsDesktop selectedBarangay={selectedBarangay} chartData={chartData} />
      <ForecastQuickStatsMobile selectedBarangay={selectedBarangay} chartData={chartData} />
      <ForecastClassesSelector
        selectedClasses={selectedClasses}
        onToggleClass={toggleClass}
        onSelectAll={selectAll}
      />
      <ForecastViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Chart or Table */}
      <div className="flex-1 border-2 border-primary/30 rounded-lg bg-muted/20 dark:bg-black/20 p-2 md:p-4 min-h-[300px] md:min-h-[400px]">
        {viewMode === "chart" ? (
          <ForecastChart
            chartData={chartData}
            selectedClasses={selectedClasses}
            selectedBarangay={selectedBarangay}
            startYear={startYear}
            endYear={endYear}
          />
        ) : (
          <ForecastTable tableData={tableData} />
        )}
      </div>
    </div>
  )
}
