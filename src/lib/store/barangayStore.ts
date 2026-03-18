import { create } from "zustand";

interface BarangayStore {
  currentYear: number;
  selectedBarangay: string;
  setCurrentYear: (year: number) => void;
  setSelectedBarangay: (barangay: string) => void;
}

export const useBarangayStore = create<BarangayStore>((set)=> ({
  currentYear: new Date().getFullYear(), // latest year
  setCurrentYear: (year: number) => set({ currentYear: year }),
  
  selectedBarangay: "",
  setSelectedBarangay: (barangay: string) => set({ selectedBarangay: barangay }),
}))