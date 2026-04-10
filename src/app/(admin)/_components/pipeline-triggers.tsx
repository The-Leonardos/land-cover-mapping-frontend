import { getPipelineStatus } from "../_actions/getPipelineStatus";
import { TriggerButtons } from "./trigger-buttons";

export async function PipelineTriggers() {
  // Use UTC time for system-wide consistency
  const now = new Date();
  const currentYear = now.getUTCFullYear();

  // 1. Fetch current status from the database/API
  const { modelStatus, inferenceStatus } = await getPipelineStatus(currentYear);

  // 2. Calculate Time-based Locks (strictly UTC 12:00 AM)
  const retrainUnlockTime = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0)); // Jan 1, 00:00 UTC
  const inferenceUnlockTime = new Date(Date.UTC(currentYear, 3, 1, 0, 0, 0)); // April 1, 00:00 UTC

  const isModelUnlockedByTime = now >= retrainUnlockTime;
  const isInferenceUnlockedByTime = now >= inferenceUnlockTime;

  return (
    <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 shadow text-zinc-100 p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-col space-y-1.5 mb-6">
          <h3 className="font-semibold leading-none tracking-tight">Manual Pipeline Triggers</h3>
          <p className="text-sm text-zinc-400">Manage model training and map generation workflows.</p>
        </div>
        
        <TriggerButtons 
          currentYear={currentYear}
          isModelUnlockedByTime={isModelUnlockedByTime}
          isInferenceUnlockedByTime={isInferenceUnlockedByTime}
          modelStatus={modelStatus}
          inferenceStatus={inferenceStatus}
        />
      </div>
    </div>
  );
}
