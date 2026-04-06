import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";

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
  return {
    barangay: "",
    year: 0,
    data: [],
  };
};