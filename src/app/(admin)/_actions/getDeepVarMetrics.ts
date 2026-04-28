"use server";

import { prisma } from "@/lib/prisma";
import { DeepVarMetrics } from "@/lib/types/metrics";

export async function getDeepVarMetrics(): Promise<DeepVarMetrics[]> {
  const rows = await prisma.deepVarPerformance.findMany({
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

    mae:  row.mae  != null ? row.mae.toFixed(6)  : "—",
    rmse: row.rmse != null ? row.rmse.toFixed(6) : "—",
    r2:   row.r2   != null ? row.r2.toFixed(4)   : "—",
    crps: row.crps != null ? row.crps.toFixed(6) : "—",
  }));
}
