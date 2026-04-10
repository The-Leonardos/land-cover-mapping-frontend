"use server";

import { DeepLabMetrics } from "@/lib/types/metrics";

export async function getDeepLabMetrics(): Promise<DeepLabMetrics[]> {
  // Mock fetching from database
  return [
    { modelName: "DeepLab V3+ Base", date: "2025-12-31", year: "2026", iou: "0.85", acc: "0.92", prec: "0.88", rec: "0.90", f1: "0.89" },
  ];
}
