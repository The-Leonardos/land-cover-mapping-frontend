"use server";

import { prisma } from "@/lib/prisma";
import { DeepVarMetrics } from "@/lib/types/metrics";

export async function getDeepVarMetrics(): Promise<DeepVarMetrics[]> {
  const rows = await prisma.deepVarPerformance.findMany({
    include: {
      model_run: true,
    },
  });

  return rows.map((row) => ({
    modelName:    row.model_name,
    trainingDate: row.model_run.training_date
      ? row.model_run.training_date.toISOString().split("T")[0]
      : "—",
    year: String(row.model_run.forecast_year ?? "—"),

    mae:  row.mae  != null ? row.mae.toFixed(4)  : "—",
    rmse: row.rmse != null ? row.rmse.toFixed(4) : "—",
    r2:   row.r2   != null ? row.r2.toFixed(4)   : "—",
    crps: row.crps != null ? row.crps.toFixed(4) : "—",
  }));
}
