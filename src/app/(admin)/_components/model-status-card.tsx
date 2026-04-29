"use client";

import { useEffect, useState } from "react";
import { getPipelineStatus, ModelStatus } from "../_actions/getPipelineStatus";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { ModelStatusCardSkeleton } from "../_skeletons/model-status-card-skeleton";

  const statusStyles = {
    not_started: {
      color: "text-zinc-400",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/20",
      dot: "bg-zinc-500",
    },
    training: {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      dot: "bg-amber-500 animate-pulse",
    },
    trained: {
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      dot: "bg-emerald-500",
    },
  };

const REFRESH_INTERVAL = 5000; // 10 seconds

/**
 * Fetches the current status of the model training pipeline every 10 seconds.
 * @returns ModelStatusCard component
 */
export function ModelStatusCard() {
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const latestYear = useBarangayStore((state) => state.YEARS).at(-1);
  const fetchYears = useBarangayStore((state) => state.fetchYears);
  
  // fetch years on mount 
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  
  // Polling pipeline status every 10 seconds
  useEffect(() => {
    if (!latestYear) return;
    
    const updatePipelineStatus = async () => {
      const pipelineStatus = await getPipelineStatus(latestYear);
      setStatus(pipelineStatus.modelStatus);
    }
    updatePipelineStatus();
    const interval = setInterval(updatePipelineStatus, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [latestYear]);
  
  // Show skeleton while the first status fetch is in flight
  if (status === null) return <ModelStatusCardSkeleton />;

  return (
    <div className={`md:col-span-1 rounded-xl border ${statusStyles[status].border} border-4 bg-zinc-900 shadow-lg text-zinc-100 p-6 transition-colors duration-500`}>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Pipeline Status</h3>
        <p className="text-sm text-zinc-400">Real-time status of the current model training pipeline.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${statusStyles[status].border} ${statusStyles[status].bg} transition-all duration-500`}>
          <div className={`w-2.5 h-2.5 rounded-full ${statusStyles[status].dot}`} />
          <span className={`text-lg font-bold tracking-tight ${statusStyles[status].color}`}>
            {getLabelByStatus(status)}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-zinc-500 font-medium">Auto-refresh: 10s</p>
      </div>
    </div>
  );
}


function getLabelByStatus(status: ModelStatus) {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "training":
      return "Training";
    case "trained":
      return "Trained";
  }
}