"use server"

import { prisma } from "@/lib/prisma"

export interface TimeSeriesDataPoint {
  year: number
  quarter: number
  water: number
  trees: number
  grass: number
  crops: number
  shrub_and_scrub: number
  built_up_area: number
  bare_ground: number
}

/**
 * Generates deterministic mock forecast data for CAMP 7 only.
 * Simulates 10-year lookahead (2026–2035) with realistic urban growth trends.
 */
function getCamp7MockForecastData(): TimeSeriesDataPoint[] {
  const mockData: TimeSeriesDataPoint[] = []

  // Base values approximating CAMP 7's last historical year
  const base = {
    water: 0.3,
    trees: 30,
    grass: 5,
    crops: 2,
    shrub_and_scrub: 3,
    built_up_area: 55,
    bare_ground: 1.5,
  }

  for (let year = 2026; year <= 2035; year++) {
    const offset = year - 2026
    for (let quarter = 1; quarter <= 4; quarter++) {
      // Deterministic variation using sin/cos for consistency across renders
      const seed = year * 4 + quarter
      const v = Math.sin(seed * 0.7) * 0.5 + Math.cos(seed * 1.3) * 0.3

      mockData.push({
        year,
        quarter,
        water: +Math.max(0, base.water - offset * 0.008 + v * 0.05).toFixed(4),
        trees: +Math.max(0, base.trees - offset * 1.0 + v * 1.2).toFixed(4),
        grass: +Math.max(0, base.grass - offset * 0.15 + v * 0.4).toFixed(4),
        crops: +Math.max(0, base.crops - offset * 0.06 + v * 0.2).toFixed(4),
        shrub_and_scrub: +Math.max(0, base.shrub_and_scrub - offset * 0.12 + v * 0.3).toFixed(4),
        built_up_area: +Math.min(100, base.built_up_area + offset * 1.3 + v * 0.6).toFixed(4),
        bare_ground: +Math.max(0, base.bare_ground - offset * 0.03 + v * 0.1).toFixed(4),
      })
    }
  }
  return mockData
}

/**
 * Fetches all time series data for a barangay across every year from the database.
 * For CAMP 7 only, appends 10 years of mock forecast data (2026–2035).
 */
export async function getBarangayAllYearsTimeSeries(
  barangayName: string
): Promise<TimeSeriesDataPoint[]> {
  try {
    const fetchedData = await prisma.landCoverTimeSeries.findMany({
      where: { barangay_name: barangayName },
      orderBy: [{ year: "asc" }, { quarter: "asc" }],
    })

    const data: TimeSeriesDataPoint[] = fetchedData.map((d) => ({
      year: d.year,
      quarter: d.quarter,
      water: d.water,
      trees: d.trees,
      grass: d.grass,
      crops: d.crops,
      shrub_and_scrub: d.shrub_and_scrub,
      built_up_area: d.built_up_area,
      bare_ground: d.bare_ground,
    }))

    // Add mock forecast data for CAMP 7 only
    if (barangayName.toUpperCase() === "CAMP 7") {
      data.push(...getCamp7MockForecastData())
    }

    return data
  } catch (error) {
    console.error("Error fetching all years time series data:", error)
    return []
  }
}
