import { Loader2 } from "lucide-react";

interface DataPipelineOverlayProps {
  currentYear: number | string;
}

export const DataPipelineOverlay = ({ currentYear }: DataPipelineOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
      <div className="text-center p-8 border border-zinc-800 rounded-xl bg-zinc-900 shadow-2xl max-w-md mx-4">
        <p className="text-amber-500 mb-2 font-mono text-sm uppercase tracking-widest font-bold">
          Data Pipeline Active
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 leading-tight">
          Visual map data for {currentYear} is currently being processed.
        </h3>
        <p className="text-zinc-400 text-sm md:text-base">
          Please wait until Q1 mapping inference operations are finalized. The data
          will appear here automatically.
        </p>
      </div>
    </div>
  );
};
