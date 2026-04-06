import { X } from "lucide-react";

export function BarangayDetailPanelSkeleton({onClose}: {onClose: () => void}) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-card animate-in fade-in duration-300">
        {/* Header */}
        <div className="p-4 md:p-5 flex items-start justify-between border-b border-border/60 bg-muted/10">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Loading...
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 md:p-5 space-y-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((q) => (
               <div key={q} className="flex-1 h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
}