"use client";

import { useEffect, useState } from "react";

type Status = "Idle" | "Currently Training" | "Model Trained";

export function ModelStatusCard() {
  const [status, setStatus] = useState<Status>("Idle");
  
  // Real polling would go here
  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch from API...
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow text-zinc-100 p-6">
      <div className="flex flex-col space-y-1.5 mb-4">
        <h3 className="font-semibold leading-none tracking-tight">Pipeline Status</h3>
        <p className="text-sm text-zinc-400">Real-time status of the FastAPI backend model training pipeline.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-400 mb-1">Current State</span>
          <span className={`text-2xl font-bold ${status === 'Idle' ? 'text-zinc-100' : status === 'Currently Training' ? 'text-amber-500 animate-pulse' : 'text-green-500'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
