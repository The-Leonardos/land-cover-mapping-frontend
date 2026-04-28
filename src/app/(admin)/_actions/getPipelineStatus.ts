"use server";

import {prisma} from "@/lib/prisma";

export type ModelStatus = "not_started" | "training" | "trained";
export type InferenceStatus = "not_started" | "completed";

export interface PipelineStatus {
  modelStatus: ModelStatus;
  inferenceStatus: InferenceStatus;
}

/**
 * Fetches the current pipeline status for a given year.
 * Returns the most recently created ModelsRun for that forecast_year.
 * If no run exists, defaults to not_started / not_started.
 */
export async function getPipelineStatus(currentYear: number): Promise<PipelineStatus> {
  const run = await prisma.modelsRun.findFirst({
    where: { forecast_year: currentYear },
    orderBy: { training_date: "desc" },
  });

  if (!run) {
    return {
      modelStatus: "not_started",
      inferenceStatus: "not_started",
    };
  }

  return {
    modelStatus: run.training_status as ModelStatus,
    inferenceStatus: (run.inference_status ?? "not_started") as InferenceStatus,
  };
}
