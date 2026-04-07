import { X } from "lucide-react";

export function BarangayDetailPanelSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-card rounded-r-xl border-l border-border shadow-2xl animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="p-4 md:p-5 flex items-start justify-between border-b border-border/80">
        <div className="space-y-1.5 flex-1">
          {/* Barangay Name (Black font style) */}
          <div className="h-8 md:h-9 w-64 bg-muted rounded animate-pulse" />

          {/* Subtitle with pulse indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-pulse" />
            <div className="h-4 w-56 bg-muted/60 rounded animate-pulse" />
          </div>

          {/* Compare Button */}
          <div className="mt-4 h-8 w-32 bg-primary/5 rounded-full animate-pulse" />
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
        {/* Quarter Selection Tabs */}
        <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
          {[1, 2, 3, 4].map((q) => (
            <div key={q} className="flex-1 h-8 md:h-9 bg-background/50 rounded-md animate-pulse" />
          ))}
        </div>

        {/* Chart Section (Stacked Bar & Top Types) */}
        <div className="space-y-4">
          <div className="h-6 w-full bg-muted/40 rounded-md border border-border/50 animate-pulse" />
          
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse mb-3" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-full bg-muted/30 rounded-md border border-border/40 animate-pulse" />
            ))}
          </div>
        </div>

        {/* All Categories Container Skeleton */}
        <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-muted animate-pulse" />
                <div className="flex-1 h-3.5 bg-muted/40 rounded animate-pulse" />
                <div className="h-6 w-12 bg-background border border-border rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
