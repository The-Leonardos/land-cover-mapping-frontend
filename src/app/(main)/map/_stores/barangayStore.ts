import { create } from "zustand";

interface BarangayStore {
  currentYear: number;
  selectedBarangay: string | null;
  setCurrentYear: (year: number) => void;
  setSelectedBarangay: (barangay: string | null) => void;
}

export const useBarangayStore = create<BarangayStore>((set) => ({
  // Use a concrete year we know is in the seed data range and safe for this dataset
  currentYear: 2025,
  setCurrentYear: (year: number) => set({ currentYear: year }),

  selectedBarangay: null,
  setSelectedBarangay: (barangay: string | null) =>
    set({ selectedBarangay: barangay }),
}));
