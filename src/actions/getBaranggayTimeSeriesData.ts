'use server'

import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { prisma } from "@/lib/prisma/prisma";

/**
 * Fetches all barangay names from the database.
 * @returns A promise that resolves to an array of barangay names.
 */
export const getAllBarangays = async (): Promise<string[]> => {
  const barangays = await prisma.barangay.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  });
  return barangays.map((b) => b.name);
};

/**
 * Fetches the time series data for a specific barangay across all years.
 * @param barangay The name of the barangay.
 * @returns A promise that resolves to an array of time series data for all years.
 */
export const getBarangayAllYearsData = async (
  barangay: string,
): Promise<BarangayLandCoverTimeSeries[]> => {
  const barangayRecord = await prisma.barangay.findUnique({
    where: { name: barangay },
    include: {
      landCoverTimeseries: {
        orderBy: { year: 'asc' },
      },
    },
  });

  if (!barangayRecord) {
    return [];
  }

  // Group by year
  const yearMap = new Map<number, typeof barangayRecord.landCoverTimeseries>();
  barangayRecord.landCoverTimeseries.forEach((record) => {
    if (!yearMap.has(record.year)) {
      yearMap.set(record.year, []);
    }
    yearMap.get(record.year)!.push(record);
  });

  // Convert to BarangayLandCoverTimeSeries format
  const result: BarangayLandCoverTimeSeries[] = [];
  yearMap.forEach((records, year) => {
    result.push({
      barangay,
      year,
      data: records.map((record) => ({
        quarter: record.quarter,
        water: record.water,
        trees: record.trees,
        grass: record.grass,
        floodedVegetation: record.floodedVegetation,
        crops: record.crops,
        shrub: record.shrub,
        snow: record.snow,
        built: record.built,
        bare: record.bare,
      })),
    });
  });

  return result;
};

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
  const barangayRecord = await prisma.barangay.findUnique({
    where: { name: barangay },
    include: {
      landCoverTimeseries: {
        where: { year },
        orderBy: { quarter: 'asc' },
      },
    },
  });

  if (!barangayRecord || barangayRecord.landCoverTimeseries.length === 0) {
    // Return empty data if not found
    return {
      barangay,
      year,
      data: [],
    };
  }

  return {
    barangay,
    year,
    data: barangayRecord.landCoverTimeseries.map((record) => ({
      quarter: record.quarter,
      water: record.water,
      trees: record.trees,
      grass: record.grass,
      floodedVegetation: record.floodedVegetation,
      crops: record.crops,
      shrub: record.shrub,
      snow: record.snow,
      built: record.built,
      bare: record.bare,
    })),
  };
};
