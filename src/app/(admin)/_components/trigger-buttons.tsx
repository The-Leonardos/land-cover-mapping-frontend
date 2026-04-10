"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { retrainModels } from "../_actions/retrainModels";
import startImageInferencing from "../_actions/startImageInferencing";
import type { ModelStatus, InferenceStatus } from "../_actions/getPipelineStatus";

interface TriggerButtonsProps {
  currentYear: number;
  isModelUnlockedByTime: boolean;
  isInferenceUnlockedByTime: boolean;
  modelStatus: ModelStatus;
  inferenceStatus: InferenceStatus;
}

export function TriggerButtons({
  currentYear,
  isModelUnlockedByTime,
  isInferenceUnlockedByTime,
  modelStatus,
  inferenceStatus,
}: TriggerButtonsProps) {
  const [isPendingRetrain, startRetrainTransition] = useTransition();
  const [isPendingInference, startInferenceTransition] = useTransition();

  // --- Handlers ---
  const handleAction = async (
    action: (year: number) => Promise<{ success: boolean; message: string }>,
    startTransition: React.TransitionStartFunction,
    errorMsg: string
  ) => {
    startTransition(async () => {
      try {
        const result = await action(currentYear);
        if (result.success) toast.success(result.message);
        else toast.error(errorMsg);
      } catch (error) {
        toast.error(`An unexpected error occurred: ${errorMsg}`);
      }
    });
  };

  // --- Model Logic ---
  const modelLockState = getModelLockState(isModelUnlockedByTime, modelStatus, isPendingRetrain);
  const modelDescription = modelStatus === "not_started" 
      ? "Unlocks on January 1 at 12:00 AM UTC"
      : `Status: ${modelStatus === "training" ? "Training in Progress" : "Model Trained"}`;

  // --- Inference Logic ---
  const inferenceLockState = getInferenceLockState(
    isInferenceUnlockedByTime, 
    modelStatus, 
    inferenceStatus, 
    isPendingInference
  );
  const inferenceDescription = inferenceStatus === "not_started"
      ? "Unlocks on April 1 at 12:00 AM UTC (Requires Trained Model)"
      : "Status: Inference Completed";

  return (
    <div className="flex flex-col gap-6">
      <ControlButton
        title="Retrain Models"
        description={modelDescription}
        buttonText={modelLockState.text}
        isDisabled={modelLockState.disabled}
        onClick={() => handleAction(retrainModels, startRetrainTransition, "Failed to start retraining.")}
      />

      <div className="pt-4 border-t border-zinc-800" />

      <ControlButton
        title="Run Inference Map"
        description={inferenceDescription}
        buttonText={inferenceLockState.text}
        isDisabled={inferenceLockState.disabled}
        onClick={() => handleAction(startImageInferencing, startInferenceTransition, "Failed to start inference.")}
      />
    </div>
  );
}

// --- Sub-components ---

interface ControlButtonProps {
  title: string;
  description: string;
  buttonText: string;
  isDisabled: boolean;
  onClick: () => void;
  className?: string;
}

function ControlButton({ title, description, buttonText, isDisabled, onClick, className }: ControlButtonProps) {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between gap-2`}>
      <div className="w-full">
        <h4 className="font-medium text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
      <Button
        onClick={onClick}
        disabled={isDisabled}
        variant={isDisabled ? "default" : "outline"}
        className="min-w-[170px] w-full md:w-fit"
      >
        {buttonText}
      </Button>
    </div>
  );
}

// --- Logic Helpers ---

function getModelLockState(isTimeUnlocked: boolean, status: ModelStatus, isPending: boolean) {
  if (isPending) return { text: "Starting...", disabled: true };
  if (status === "training") return { text: "Training...", disabled: true };
  if (status === "trained") return { text: "Already Trained", disabled: true };
  if (!isTimeUnlocked) return { text: "Locked (Until Jan 1)", disabled: true };
  return { text: "Retrain Models", disabled: false };
}

function getInferenceLockState(isTimeUnlocked: boolean, modelStatus: ModelStatus, status: InferenceStatus, isPending: boolean) {
  if (isPending) return { text: "Starting...", disabled: true };
  if (status === "completed") return { text: "Already Completed", disabled: true };
  if (!isTimeUnlocked) return { text: "Locked (Until April 1)", disabled: true };
  if (modelStatus !== "trained") return { text: "Locked (Requires Model)", disabled: true };
  return { text: "Run Image Inference", disabled: false };
}
