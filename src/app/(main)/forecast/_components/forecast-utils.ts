import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"
import type { TimeSeriesDataPoint } from "../_actions/getBarangayAllYearsTimeSeries"

/** All land-cover class keys that match the DB schema and LAND_COVER_CLASSES ids */
const CLASS_KEYS = [
  "water",
  "trees",
  "grass",
  "crops",
  "shrub_and_scrub",
  "built_up_area",
  "bare_ground",
] as const

type ClassKey = (typeof CLASS_KEYS)[number]

/**
 * A single data point for the chart.
 * Each class has two keys: `classId` (historical) and `classId_forecast` (forecast).
 * Only one of them will be set per data point (except at the boundary where both are set for continuity).
 */
export interface ChartDataPoint {
  year: number
  quarter: number
  /** Numeric X key: year + (quarter - 1) * 0.25. E.g. 2022 Q2 → 2022.25 */
  xKey: number
  /** Human-readable label for tooltip: "2022 Q2" */
  displayLabel: string
  isForecast: boolean
  [key: string]: number | boolean | string | undefined
}

/**
 * Transforms raw quarterly DB data into per-quarter chart data points
 * with separate keys for historical vs forecast values.
 *
 * Historical: `trees = 45.2`
 * Forecast:   `trees_forecast = 43.1`
 * Boundary:   both keys set to the same value (for seamless line connection)
 */
export function generateChartData(
  rawData: TimeSeriesDataPoint[],
  startYear: number,
  endYear: number,
  currentYear: number
): ChartDataPoint[] {
  if (rawData.length === 0) return []

  // Filter and sort the raw data
  const filtered = rawData
    .filter((d) => d.year >= startYear && d.year <= endYear)
    .sort((a, b) => a.year - b.year || a.quarter - b.quarter)

  if (filtered.length === 0) return []

  // Find the last historical quarter (before currentYear)
  const historicalPoints = filtered.filter((d) => d.year < currentYear)
  const lastHistorical =
    historicalPoints.length > 0
      ? historicalPoints[historicalPoints.length - 1]
      : null

  const hasForecastPoints = filtered.some((d) => d.year >= currentYear)

  const data: ChartDataPoint[] = []

  for (const point of filtered) {
    const isForecast = point.year >= currentYear
    const xKey = point.year + (point.quarter - 1) * 0.25
    const displayLabel = `${point.year} Q${point.quarter}`

    const chartPoint: ChartDataPoint = {
      year: point.year,
      quarter: point.quarter,
      xKey,
      displayLabel,
      isForecast,
    }

    for (const key of CLASS_KEYS) {
      const val = point[key]

      if (!isForecast) {
        chartPoint[key] = val
        // At the boundary, also set forecast key for seamless line connection
        const isLastHistorical =
          lastHistorical &&
          point.year === lastHistorical.year &&
          point.quarter === lastHistorical.quarter &&
          hasForecastPoints

        if (isLastHistorical) {
          chartPoint[`${key}_forecast`] = val
        }
      } else {
        chartPoint[`${key}_forecast`] = val
      }
    }

    data.push(chartPoint)
  }

  return data
}

/**
 * Computes a tight Y-axis domain based on only the visible (selected) classes.
 * Adds ~10% padding and floors at 0.
 */
export function computeYAxisDomain(
  chartData: ChartDataPoint[],
  selectedClasses: Set<string>
): [number, number] {
  if (chartData.length === 0 || selectedClasses.size === 0) return [0, 100]

  let min = Infinity
  let max = -Infinity

  for (const point of chartData) {
    for (const classId of selectedClasses) {
      const hVal = point[classId] as number | undefined
      const fVal = point[`${classId}_forecast`] as number | undefined

      if (hVal != null) {
        min = Math.min(min, hVal)
        max = Math.max(max, hVal)
      }
      if (fVal != null) {
        min = Math.min(min, fVal)
        max = Math.max(max, fVal)
      }
    }
  }

  if (min === Infinity || max === -Infinity) return [0, 100]

  const range = max - min
  const padding = Math.max(range * 0.1, 2) // at least 2% padding

  return [
    Math.max(0, Math.floor(min - padding)),
    Math.min(100, Math.ceil(max + padding)),
  ]
}

// ── Stats ────────────────────────────────────────────────────────────

export interface ClassStat {
  id: string
  label: string
  color: string
  latestValue: number
  firstValue: number
  change: number
  trend: "up" | "down" | "stable"
}

/**
 * Computes summary stats for each selected class based on historical data only.
 */
export function computeClassStats(
  chartData: ChartDataPoint[],
  selectedClasses: Set<string>,
  _currentYear: number
): ClassStat[] {
  if (chartData.length === 0) return []

  const historicalData = chartData.filter((d) => !d.isForecast)
  if (historicalData.length === 0) return []

  const first = historicalData[0]
  const latest = historicalData[historicalData.length - 1]

  return LAND_COVER_CLASSES.filter((cls) => selectedClasses.has(cls.id)).map(
    (cls) => {
      const firstVal = (first[cls.id] as number) ?? 0
      const latestVal = (latest[cls.id] as number) ?? 0
      const change = latestVal - firstVal

      return {
        id: cls.id,
        label: cls.label,
        color: cls.color,
        latestValue: latestVal,
        firstValue: firstVal,
        change,
        trend:
          change > 0.1 ? "up" : change < -0.1 ? "down" : ("stable" as const),
      }
    }
  )
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Extracts the unique sorted list of years present in the raw data. */
export function getAvailableYears(rawData: TimeSeriesDataPoint[]): number[] {
  const years = new Set(rawData.map((d) => d.year))
  return Array.from(years).sort((a, b) => a - b)
}
