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
  //todo: fetch the data in the database using prisma
  return {
    barangay,
    year,
    data: [
      {
        quarter: 1,
        water: 0,
        trees: 0,
        grass: 0,
        floodedVegetation: 0,
        crops: 0,
        shrub: 0,
        snow: 0,
        built: 0,
        bare: 0,
      },
      {
        quarter: 2,
        water: 0,
        trees: 0,
        grass: 0,
        floodedVegetation: 0,
        crops: 0,
        shrub: 0,
        snow: 0,
        built: 0,
        bare: 0,
      },
      {
        quarter: 3,
        water: 0,
        trees: 0,
        grass: 0,
        floodedVegetation: 0,
        crops: 0,
        shrub: 0,
        snow: 0,
        built: 0,
        bare: 0,
      },
      {
        quarter: 4,
        water: 0,
        trees: 0,
        grass: 0,
        floodedVegetation: 0,
        crops: 0,
        shrub: 0,
        snow: 0,
        built: 0,
        bare: 0,
      },
    ],
  };
};
