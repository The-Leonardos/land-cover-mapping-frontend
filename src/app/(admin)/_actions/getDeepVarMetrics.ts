"use server";

import { prisma } from "@/lib/prisma";
import { DeepVarMetrics } from "@/lib/types/metrics";


export async function getDeepVarMetrics(): Promise<DeepVarMetrics[]> {
  const runs = await prisma.modelsRun.findMany({
    where: {
      deepvarPerformance: { isNot: null },
    },
    include: {
      model: true,
      deepvarPerformance: true,
    },
  });

  return runs.map((run) => ({
    modelName: run.model.model_name,
    trainingDate: run.training_date ? run.training_date.toISOString().split("T")[0] : "—",
    year: String(run.forecast_year),

    mae: run.deepvarPerformance?.mae != null ? run.deepvarPerformance.mae.toFixed(4) : "—",
    rmse: run.deepvarPerformance?.rmse != null ? run.deepvarPerformance.rmse.toFixed(4) : "—",
    r2: run.deepvarPerformance?.r2 != null ? run.deepvarPerformance.r2.toFixed(4) : "—",
    crps: run.deepvarPerformance?.crps != null ? run.deepvarPerformance.crps.toFixed(4) : "—",
  }));
}
