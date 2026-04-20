import { create } from "zustand";
import { getYears } from "@/actions/getYears";

interface ZoomTarget {
  x: number; // SVG pixel x (within 0-1008 viewBox)
  y: number; // SVG pixel y (within 0-823 viewBox)
}

interface BarangayStore {
  currentYear: number;
  YEARS: number[];
  selectedBarangay: string | null;
  zoomTarget: ZoomTarget | null;
  isDataUnavailable: boolean;
  setCurrentYear: (year: number) => void;
  setYears: (years: number[]) => void;
  setSelectedBarangay: (barangay: string | null) => void;
  setZoomTarget: (target: ZoomTarget | null) => void;
  clearZoomTarget: () => void;
  fetchYears: () => Promise<void>;
}

export const useBarangayStore = create<BarangayStore>((set) => ({
  currentYear: 2025,
  setCurrentYear: (year: number) => set({ currentYear: year }),

  YEARS: [],
  setYears: (years: number[]) => set({ YEARS: years }),

  selectedBarangay: null,
  setSelectedBarangay: (barangay: string | null) =>
    set({ selectedBarangay: barangay }),

  zoomTarget: null,
  setZoomTarget: (target: ZoomTarget | null) => set({ zoomTarget: target }),
  clearZoomTarget: () => set({ zoomTarget: null }),

  isDataUnavailable: false,

  fetchYears: async () => {
    try {
      const years = await getYears();
      set({ YEARS: years });
      set({ currentYear: years[years.length - 1] }); // latest year will be the current year
    } catch (error) {
      console.error("Failed to fetch years:", error);
    }
  },
}));
