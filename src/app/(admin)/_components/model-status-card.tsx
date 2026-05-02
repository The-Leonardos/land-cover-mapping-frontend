"use client";

import { useEffect, useState } from "react";
import { getPipelineStatus, ModelStatus } from "../_actions/getPipelineStatus";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { ModelStatusCardSkeleton } from "../_skeletons/model-status-card-skeleton";
import { usePipelineStore } from "../_stores/pipelineStore";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";

const statusStyles = {
  not_started: {
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
  training: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  trained: {
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

const STATUS_CONFIG: Record<ModelStatus, { label: string; icon: React.ReactNode }> = {
  not_started: {
    label: "Not Started",
    icon: <Clock className="w-4 h-4" />,
  },
  training: {
    label: "Training",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  trained: {
    label: "Trained",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

const REFRESH_INTERVAL = 2000;

/**
 * Polls the pipeline status every 5 seconds and broadcasts it to the
 * shared pipelineStore so TriggerButtons and MetricsTables stay in sync.
 */
export function ModelStatusCard() {
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const latestYear = useBarangayStore((state) => state.YEARS).at(-1);
  const fetchYears = useBarangayStore((state) => state.fetchYears);
  const setPipelineStatus = usePipelineStore((state) => state.setPipelineStatus);

  // fetch years on mount 
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  // Polling pipeline status every 5 seconds and syncing to shared store
  useEffect(() => {
    if (!latestYear) return;
    
    const updatePipelineStatus = async () => {
      const pipelineStatus = await getPipelineStatus(latestYear);
      setStatus(pipelineStatus.modelStatus);
      setPipelineStatus(pipelineStatus.modelStatus, pipelineStatus.inferenceStatus);
    };
    updatePipelineStatus();
    const interval = setInterval(updatePipelineStatus, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [latestYear, setPipelineStatus]);
  
  // Show skeleton while the first status fetch is in flight
  if (status === null) return <ModelStatusCardSkeleton />;

  const { label, icon } = STATUS_CONFIG[status];
  const styles = statusStyles[status];

  return (
    <div className={`md:col-span-1 rounded-xl border ${styles.border} bg-card shadow-xl shadow-black/20 text-foreground p-6 transition-all duration-500`}>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Pipeline Status</h3>
        <p className="text-sm text-muted-foreground">Real-time status of the current model training pipeline.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border ${styles.border} ${styles.bg} transition-all duration-500 shadow-sm`}>
          <span className={styles.color}>{icon}</span>
          <span className={`text-lg font-semibold tracking-tight ${styles.color}`}>
            {label}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <p className="text-sm text-muted-foreground/60 font-medium">Auto-refresh: 1min</p>
      </div>
    </div>
  );
}