export function PipelineTriggersSkeleton() {
  return (
    <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 shadow p-6 animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex flex-col space-y-2">
            {/* Title Skeleton */}
            <div className="h-6 w-48 bg-zinc-800 rounded"></div>
            {/* Description Skeleton */}
            <div className="h-4 w-72 bg-zinc-800 rounded"></div>
          </div>
          {/* Info Button Skeleton */}
          <div className="h-5 w-5 bg-zinc-800 rounded-full shrink-0"></div>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Row 1 Skeleton (ControlButton) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="w-full space-y-2">
              <div className="h-5 w-32 bg-zinc-800 rounded"></div>
              <div className="h-4 w-56 bg-zinc-800 rounded"></div>
            </div>
            <div className="h-8 w-full md:w-[170px] bg-zinc-800/50 rounded-md"></div>
          </div>

          {/* Separator */}
          <div className="border-t border-zinc-800" />

          {/* Row 2 Skeleton (ControlButton) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="w-full space-y-2">
              <div className="h-3 w-36 bg-zinc-800 rounded"></div>
              <div className="h-3 w-64 bg-zinc-800 rounded"></div>
            </div>
            <div className="h-8 w-full md:w-[170px] bg-zinc-800/50 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
