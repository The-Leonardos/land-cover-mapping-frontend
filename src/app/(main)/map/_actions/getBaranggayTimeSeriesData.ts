import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";

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
  // Simulating network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const generateRandomQuarter = (quarter: number) => {
    // Generate random percentages that sum to 100
    let total = 100;
    const values: Record<string, number> = {};
    const keys = ["water", "trees", "grass", "crops", "shrub", "built", "bare"];
    
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        values[key] = Math.max(0, total);
      } else {
        const val = Math.random() * (total / (keys.length - index));
        values[key] = Number(val.toFixed(2));
        total -= values[key];
      }
    });

    return {
      quarter,
      water: values.water,
      trees: values.trees,
      grass: values.grass,
      crops: values.crops,
      shrub: values.shrub,
      built: values.built,
      bare: values.bare,
    };
  };

  return {
    barangay: barangayName,
    year: year,
    data: [
      generateRandomQuarter(1),
      generateRandomQuarter(2),
      generateRandomQuarter(3),
      generateRandomQuarter(4),
    ],
  };
};