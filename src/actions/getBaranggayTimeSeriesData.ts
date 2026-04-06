"use server";

import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { prisma } from "@/lib/prisma/prisma";

export async function getAllBarangays() {
  return prisma.barangay.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getBarangayAllYearsData(barangayId: number) {
  return prisma.landCoverTimeseries.findMany({
    where: {
      barangayId,
    },
    orderBy: {
      year: "asc",
    },
  });
}

/**
 * Fetches the time series data for a specific barangay and year.
 * @param barangayId The ID of the barangay.
 * @param year The year for which to fetch the time series data.
 * @returns A promise that resolves to the time series data for the specified barangay and year.
 */
export const getBaranggayTimeSeriesData = async (
  barangayId: number,
  year: number,
): Promise<BarangayLandCoverTimeSeries> => {
  // Fetch the barangay name
  const barangay = await prisma.barangay.findUnique({
    where: { id: barangayId },
  });

  if (!barangay) {
    throw new Error(`Barangay with ID ${barangayId} not found`);
  }

  // Fetch the land cover time series data for requested year
  let timeseries = await prisma.landCoverTimeseries.findMany({
    where: {
      barangayId,
      year,
    },
    orderBy: {
      quarter: "asc",
    },
  });

  let responseYear = year;

  if (timeseries.length === 0) {
    // Fallback: if no data for requested year, pick most recent year for this barangay
    const latestRecord = await prisma.landCoverTimeseries.findFirst({
      where: {
        barangayId,
      },
      orderBy: [{ year: "desc" }, { quarter: "asc" }],
    });

    if (!latestRecord) {
      throw new Error(`No time series data for barangay ID ${barangayId}`);
    }

    responseYear = latestRecord.year;
    timeseries = await prisma.landCoverTimeseries.findMany({
      where: {
        barangayId,
        year: responseYear,
      },
      orderBy: {
        quarter: "asc",
      },
    });
  }

  // Map the data to the required format
  const data = timeseries.map((ts) => ({
    quarter: ts.quarter,
    water: ts.water,
    trees: ts.trees,
    grass: ts.grass,
    floodedVegetation: ts.floodedVegetation,
    crops: ts.crops,
    shrub: ts.shrub,
    snow: ts.snow,
    built: ts.built,
    bare: ts.bare,
  }));

  return {
    barangay: barangay.name,
    year: responseYear,
    data,
  };
};
