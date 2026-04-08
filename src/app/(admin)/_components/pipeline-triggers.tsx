"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function PipelineTriggers() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Keep internal clock in sync for time locks
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Rules:
  // Retrain: Past Dec 31 12:00 PM UTC of current year
  // Inference: Past April 1 12:00 PM UTC of current year (technically new forecast year, but we'll use current UTC year for logic)
  const currentYear = now.getUTCFullYear();
  
  const retrainUnlockTime = new Date(Date.UTC(currentYear, 11, 31, 12, 0, 0)); // Month is 0-indexed (11 = Dec)
  const inferenceUnlockTime = new Date(Date.UTC(currentYear, 3, 1, 12, 0, 0)); // 3 = April
  
  const isRetrainUnlocked = now >= retrainUnlockTime;
  const isInferenceUnlocked = now >= inferenceUnlockTime;

  // Mock states for completing the action
  const [retrainDone, setRetrainDone] = useState(false);
  const [inferenceDone, setInferenceDone] = useState(false);

  const handleRetrain = () => {
    alert("Retrain endpoint called!");
    setRetrainDone(true);
  };

  const handleInference = () => {
    alert("Inference endpoint called!");
    setInferenceDone(true);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow text-zinc-100 p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-col space-y-1.5 mb-6">
          <h3 className="font-semibold leading-none tracking-tight">Manual Pipeline Triggers</h3>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Retrain Action */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-zinc-100">Retrain Models</h4>
              <p className="text-sm text-zinc-400">Unlocks on December 31 at 12:00 PM UTC</p>
            </div>
            <Button 
              onClick={handleRetrain} 
              disabled={!isRetrainUnlocked || retrainDone}
              variant={retrainDone ? "outline" : "default"}
              title={!isRetrainUnlocked ? "Currently prior to Dec 31 unlock time" : ""}
            >
              {retrainDone ? "Completed for Year" : isRetrainUnlocked ? "Retrain Models" : "Locked (Time)"}
            </Button>
          </div>

          {/* Inference Action */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div>
              <h4 className="font-medium text-zinc-100">Run Inference Map</h4>
              <p className="text-sm text-zinc-400">Unlocks on April 1 at 12:00 PM UTC</p>
            </div>
            <Button 
              onClick={handleInference} 
              disabled={!isInferenceUnlocked || inferenceDone}
              variant={inferenceDone ? "outline" : "default"}
              title={!isInferenceUnlocked ? "Currently prior to Apr 1 unlock time" : ""}
            >
              {inferenceDone ? "Completed for Year" : isInferenceUnlocked ? "Run Inference" : "Locked (Time)"}
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-500 mt-4 self-end">Current UTC Time: {now.toUTCString()}</p>
    </div>
  );
}
