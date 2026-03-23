import { create } from "zustand";

interface LoadingLayerStore {
  loadingLayer: boolean;
  setLoadingLayer: (loadingLayer: boolean) => void;
}

export const useLoadingLayerStore = create<LoadingLayerStore>((set)=> ({
  loadingLayer: false,
  setLoadingLayer: (loadingLayer: boolean) => set({ loadingLayer }),
}))