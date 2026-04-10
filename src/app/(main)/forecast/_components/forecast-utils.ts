import landCoverData from "../../../../../land_cover_data.json"
import type { LandCoverQuarterData } from "@/lib/types/barangay-landcover-timeseries"

interface RawLandCoverData extends LandCoverQuarterData {
  barangay: string
  year: number
}

export function getBarangayTimeSeries(barangay: string) {
  const barangayData = (landCoverData as RawLandCoverData[]).filter(
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

export function generateChartData(
  selectedBarangay: string | null,
  startYear: number,
  endYear: number
) {
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

export function generateTableData(
  selectedBarangay: string | null,
  chartData: Array<{ year: number | string; [key: string]: number | string }>,
  selectedClasses: Set<string>,
  landCoverClasses: any[]
) {
  if (!selectedBarangay || chartData.length === 0) return []

  const latest = chartData[chartData.length - 1]
  const first = chartData[0]

  return landCoverClasses
    .filter((c) => selectedClasses.has(c.id))
    .map((cls) => {
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
    })
}
