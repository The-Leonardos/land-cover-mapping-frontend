"use server"

import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import {prisma} from "@/lib/prisma";

/**
 * Fetches the time series data for a specific barangay and year.
 * @param barangayId The ID of the barangay.
 * @param year The year for which to fetch the time series data.
 * @returns A promise that resolves to the time series data for the specified barangay and year.
 */
export const getBaranggayTimeSeriesData = async (
  barangayName: string,
  year: number,
): Promise<BarangayLandCoverTimeSeries> => {
  try {      
    const fetchedData = await prisma.landCoverTimeSeries.findMany({
      where: {
        barangay_name: barangayName,
        year: year,
      }
    })

    const barangay: BarangayLandCoverTimeSeries = {
      barangay_name: barangayName,
      year: year,
      data: fetchedData.map((data) => ({
        quarter: data.quarter,
        crops: data.crops,
        grass: data.grass,
        trees: data.trees,
        water: data.water,
        bare_ground: data.bare_ground,
        built_up_area: data.built_up_area,
        shrub_and_scrub: data.shrub_and_scrub,
      })),
    }

    return barangay;
  } catch (error) {
    console.error("Error fetching barangay time series data:", error);
    return {
      barangay_name: barangayName,
      year: year,
      data: [],
    };
  }
};
