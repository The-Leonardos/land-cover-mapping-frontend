import { create } from "zustand";
import { getYears } from "@/actions/getYears";

interface BarangayStore {
  currentYear: number;
  YEARS: number[];
  selectedBarangay: string | null;
  setCurrentYear: (year: number) => void;
  setYears: (years: number[]) => void;
  setSelectedBarangay: (barangay: string | null) => void;
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
