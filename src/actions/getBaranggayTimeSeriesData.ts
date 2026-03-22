"use server";

import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";

/**
 * Fetches the time series data for a specific barangay and year.
 * @param barangay The name of the barangay.
 * @param year The year for which to fetch the time series data.
 * @returns A promise that resolves to the time series data for the specified barangay and year.
 */
export const getBaranggayTimeSeriesData = async (
  barangay: string,
  year: number,
): Promise<BarangayLandCoverTimeSeries> => {
  //todo: fetch the data in the database using prisma. For those who are reading this, I am using a mock data for now.

  // Mock data that varies by year to simulate changes over time
  const yearOffset = (year - 2016) * 2; // Simulate gradual changes

  return {
    barangay,
    year,
    data: [
      {
        quarter: 1,
        water: Math.max(0, 2 + yearOffset * 0.1),
        trees: Math.max(0, 15 - yearOffset * 0.2),
        grass: 10 + yearOffset * 0.15,
        floodedVegetation: 1 + yearOffset * 0.05,
        crops: 5 + yearOffset * 0.1,
        shrub: 5 - yearOffset * 0.08,
        snow: 0,
        built: 57 + yearOffset * 0.3,
        bare: 5 - yearOffset * 0.05,
      },
      {
        quarter: 2,
        water: 5 + yearOffset * 0.12,
        trees: Math.max(0, 12 - yearOffset * 0.15),
        grass: 18 + yearOffset * 0.1,
        floodedVegetation: 2 + yearOffset * 0.08,
        crops: 8 + yearOffset * 0.2,
        shrub: 10 - yearOffset * 0.1,
        snow: 0,
        built: 40 + yearOffset * 0.25,
        bare: 5 - yearOffset * 0.03,
      },
      {
        quarter: 3,
        water: 2 + yearOffset * 0.08,
        trees: 20 - yearOffset * 0.1,
        grass: 15 + yearOffset * 0.12,
        floodedVegetation: 1 + yearOffset * 0.06,
        crops: 12 + yearOffset * 0.18,
        shrub: 5 - yearOffset * 0.09,
        snow: 0,
        built: 35 + yearOffset * 0.35,
        bare: 10 - yearOffset * 0.07,
      },
      {
        quarter: 4,
        water: 1 + yearOffset * 0.1,
        trees: 18 - yearOffset * 0.12,
        grass: 12 + yearOffset * 0.14,
        floodedVegetation: 3 + yearOffset * 0.07,
        crops: 7 + yearOffset * 0.15,
        shrub: 9 - yearOffset * 0.11,
        snow: 0,
        built: 45 + yearOffset * 0.28,
        bare: 5 - yearOffset * 0.04,
      },
    ],
  };
};
