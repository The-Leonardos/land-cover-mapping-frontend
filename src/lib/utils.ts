import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BARANGAY_AREAS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBarangayAreaByName(barangayName: string): number{
  return BARANGAY_AREAS[barangayName];
}

export function formatDisplayArea(value: number) {
  if (value === 0) return "0 m²";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value) + " m²";
}