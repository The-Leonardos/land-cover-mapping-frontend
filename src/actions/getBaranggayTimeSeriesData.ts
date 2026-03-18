'use server'

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
  return {
    barangay,
    year,
    data: [
      {
        quarter: 1,
        water: 2,
        trees: 15,
        grass: 10,
        floodedVegetation: 1,
        crops: 5,
        shrub: 5,
        snow: 0,
        built: 57,
        bare: 5,
      },
      {
        quarter: 2,
        water: 5,
        trees: 12,
        grass: 18,
        floodedVegetation: 2,
        crops: 8,
        shrub: 10,
        snow: 0,
        built: 40,
        bare: 5,
      },
      {
        quarter: 3,
        water: 2,
        trees: 20,
        grass: 15,
        floodedVegetation: 1,
        crops: 12,
        shrub: 5,
        snow: 0,
        built: 35,
        bare: 10,
      },
      {
        quarter: 4,
        water: 1,
        trees: 18,
        grass: 12,
        floodedVegetation: 3,
        crops: 7,
        shrub: 9,
        snow: 0,
        built: 45,
        bare: 5,
      },
    ],
  };
};
