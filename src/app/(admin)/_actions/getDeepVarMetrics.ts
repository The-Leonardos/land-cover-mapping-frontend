"use server";

import { DeepVarMetrics } from "@/lib/types/metrics";

export async function getDeepVarMetrics(): Promise<DeepVarMetrics[]> {
  // Mock fetching from database
  return [
    { modelName: "DeepVar Base", date: "2025-12-31", year: "2026", mae: "4.21", rmse: "5.67" },
  ];
}
