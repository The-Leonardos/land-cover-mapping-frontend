"use server";

import { prisma } from "@/lib/prisma";
import { DeepLabMetrics } from "@/lib/types/metrics";

export async function getDeepLabMetrics(): Promise<DeepLabMetrics[]> {
  const runs = await prisma.modelsRun.findMany({
    where: {
      deeplabPerformance: { isNot: null },
    },
    include: {
      model: true,
      deeplabPerformance: true,
    },
  });

  return runs.map((run) => ({
    modelName: run.model.model_name,
    trainingDate: run.training_date ? run.training_date.toISOString().split("T")[0] : "—",
    year: String(run.forecast_year),

    iou: run.deeplabPerformance?.iou != null ? run.deeplabPerformance.iou.toFixed(4) : "—",
    accuracy: run.deeplabPerformance?.accuracy != null ? run.deeplabPerformance.accuracy.toFixed(4) : "—",
    precision: run.deeplabPerformance?.precision != null ? run.deeplabPerformance.precision.toFixed(4) : "—",
    recall: run.deeplabPerformance?.recall != null ? run.deeplabPerformance.recall.toFixed(4) : "—",
    f1: run.deeplabPerformance?.f1_score != null ? run.deeplabPerformance.f1_score.toFixed(4) : "—",
  }));
}
