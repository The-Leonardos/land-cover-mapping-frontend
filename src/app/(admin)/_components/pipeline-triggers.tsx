import { getPipelineStatus } from "../_actions/getPipelineStatus";
import { TriggerButtons } from "./trigger-buttons";
import InfoDialog from "./info-dialog";

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
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Manual Pipeline Triggers</h3>
            <p className="text-sm text-zinc-400">Manage model training and map generation workflows.</p>
          </div>
          <InfoDialog 
            trigger={
              <button 
                className="p-1.5 -mr-1.5 -mt-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 shrink-0" 
                aria-label="Pipeline Information"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </button>
            } 
          />
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
