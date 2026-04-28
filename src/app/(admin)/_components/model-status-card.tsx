"use client";

import { useEffect, useState } from "react";
import { getPipelineStatus, ModelStatus } from "../_actions/getPipelineStatus";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";

const REFRESH_INTERVAL = 10000; // 10 seconds

/**
 * Fetches the current status of the model training pipeline every 10 seconds.
 * @returns ModelStatusCard component
 */
export function ModelStatusCard() {
  const [status, setStatus] = useState<ModelStatus>("not_started");
  const latestYear = useBarangayStore((state) => state.YEARS[state.YEARS.length - 1]);
  
  // Real polling would go here
  useEffect(() => {
    const updatePipelinStatus = async () => {
      const pipelineStatus = await getPipelineStatus(latestYear);
      setStatus(pipelineStatus.modelStatus);
    }
    updatePipelinStatus();
    const interval = setInterval(updatePipelinStatus, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

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
  }[status];

  return (
    <div className={`md:col-span-1 rounded-xl border ${statusStyles.border} bg-zinc-900 shadow-lg text-zinc-100 p-6 transition-colors duration-500`}>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Pipeline Status</h3>
        <p className="text-sm text-zinc-400">Real-time status of the current model training pipeline.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${statusStyles.border} ${statusStyles.bg} transition-all duration-500`}>
          <div className={`w-2.5 h-2.5 rounded-full ${statusStyles.dot}`} />
          <span className={`text-lg font-bold tracking-tight ${statusStyles.color}`}>
            {getLabelByStatus(status)}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-zinc-500 font-medium">Auto-refresh: {REFRESH_INTERVAL / 1000}s</p>
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