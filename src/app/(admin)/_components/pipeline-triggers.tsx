"use client";

import { useEffect, useState } from "react";
import { TriggerButtons } from "./trigger-buttons";
import PipelineManualInfoDialog from "./pipeline-manual-info-dialog";
import { usePipelineStore } from "../_stores/pipelineStore";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { PipelineTriggersSkeleton } from "../_skeletons/pipeline-triggers-skeleton";

export function PipelineTriggers() {
  const [timeInfo, setTimeInfo] = useState<{
    currentYear: number;
    isModelUnlockedByTime: boolean;
    isInferenceUnlockedByTime: boolean;
  } | null>(null);

  const modelStatus = usePipelineStore((state) => state.modelStatus);
  const inferenceStatus = usePipelineStore((state) => state.inferenceStatus);
  const latestYear = useBarangayStore((state) => state.YEARS).at(-1);

  // Compute time-based locks once we know the current year
  useEffect(() => {
    if (!latestYear) return;

    const _today = new Date();
    const now = new Date(Date.UTC(latestYear, _today.getUTCMonth(), _today.getUTCDate()));

    const retrainUnlockTime  = new Date(Date.UTC(latestYear, 0, 1, 0, 0, 0)); // Jan 1
    const inferenceUnlockTime = new Date(Date.UTC(latestYear, 3, 1, 0, 0, 0)); // Apr 1

    setTimeInfo({
      currentYear: latestYear,
      isModelUnlockedByTime:     now >= retrainUnlockTime,
      isInferenceUnlockedByTime: now >= inferenceUnlockTime,
    });
  }, [latestYear]);

  // Don't render until time info and at least a status are known
  if (!timeInfo || modelStatus === null || inferenceStatus === null) return <PipelineTriggersSkeleton />;

  return (
    <div className="md:col-span-2 rounded-xl border border-border bg-card shadow-xl shadow-black/20 text-foreground p-6 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Manual Pipeline Triggers</h3>
            <p className="text-sm text-muted-foreground">Manage model training and map generation workflows.</p>
          </div>
          <PipelineManualInfoDialog 
            trigger={
              <button 
                className="p-1.5 -mr-1.5 -mt-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shrink-0" 
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
          currentYear={timeInfo.currentYear}
          isModelUnlockedByTime={timeInfo.isModelUnlockedByTime}
          isInferenceUnlockedByTime={timeInfo.isInferenceUnlockedByTime}
          modelStatus={modelStatus}
          inferenceStatus={inferenceStatus}
        />
      </div>
    </div>
  );
}
