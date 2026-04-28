"use server";

import { prisma } from "@/lib/prisma";
import { DeepLabMetrics } from "@/lib/types/metrics";

export async function getDeepLabMetrics(): Promise<DeepLabMetrics[]> {
  const rows = await prisma.deepLabPerformance.findMany({
    include: {
      model: true,
      model_run: true,
    },
  });

  return rows.map((row) => ({
    modelName:    row.model.model_name,
    trainingDate: row.model_run.training_date
      ? row.model_run.training_date.toISOString().split("T")[0]
      : "—",
    year: String(row.model_run.forecast_year ?? "—"),

    iou:       row.iou       != null ? row.iou.toFixed(2)       : "—",
    accuracy:  row.accuracy  != null ? row.accuracy.toFixed(2)  : "—",
    precision: row.precision != null ? row.precision.toFixed(2) : "—",
    recall:    row.recall    != null ? row.recall.toFixed(2)    : "—",
    f1:        row.f1_score  != null ? row.f1_score.toFixed(2)  : "—",
  }));
}
