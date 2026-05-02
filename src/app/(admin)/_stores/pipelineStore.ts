import { create } from "zustand";
import type { ModelStatus, InferenceStatus } from "../_actions/getPipelineStatus";

interface PipelineStore {
  modelStatus: ModelStatus | null;
  inferenceStatus: InferenceStatus | null;
  setModelStatus: (status: ModelStatus) => void;
  setInferenceStatus: (status: InferenceStatus) => void;
  setPipelineStatus: (modelStatus: ModelStatus, inferenceStatus: InferenceStatus) => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  modelStatus: null,
  inferenceStatus: null,
  setModelStatus: (modelStatus) => set({ modelStatus }),
  setInferenceStatus: (inferenceStatus) => set({ inferenceStatus }),
  setPipelineStatus: (modelStatus, inferenceStatus) => set({ modelStatus, inferenceStatus }),
}));
