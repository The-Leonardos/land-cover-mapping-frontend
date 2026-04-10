"use server";

export type ModelStatus = "not_started" | "training" | "trained"; // both models, time series and image prediction
export type InferenceStatus = "not_started" | "completed"; // this is only for image prediction

export interface PipelineStatus {
  modelStatus: ModelStatus;
  inferenceStatus: InferenceStatus;
}

/**
 * Fetches the current pipeline status for a given year.
 */
export async function getPipelineStatus(year: number): Promise<PipelineStatus> {
  // Mock delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    modelStatus: "trained",
    inferenceStatus: "not_started",
  };
}
