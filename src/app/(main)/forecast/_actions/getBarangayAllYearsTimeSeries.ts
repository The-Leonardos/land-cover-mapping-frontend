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
 * Fetches all time series data for a barangay across every year from the database.
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

    return data
  } catch (error) {
    console.error("Error fetching all years time series data:", error)
    return []
  }
}
