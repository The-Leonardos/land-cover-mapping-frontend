export function PipelineTriggersSkeleton() {
  return (
    <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 shadow p-6 animate-pulse">
      <div className="flex flex-col space-y-2 mb-8">
        {/* Title Skeleton */}
        <div className="h-6 w-48 bg-zinc-800 rounded"></div>
        {/* Description Skeleton */}
        <div className="h-4 w-72 bg-zinc-800 rounded"></div>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* Row 1 Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full space-y-2">
            <div className="h-5 w-32 bg-zinc-800 rounded"></div>
            <div className="h-4 w-56 bg-zinc-800 rounded"></div>
          </div>
          <div className="h-10 w-full md:w-[170px] bg-zinc-800 rounded"></div>
        </div>

        {/* Separator */}
        <div className="pt-2 border-t border-zinc-800" />

        {/* Row 2 Skeleton */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full space-y-2">
            <div className="h-5 w-36 bg-zinc-800 rounded"></div>
            <div className="h-4 w-64 bg-zinc-800 rounded"></div>
          </div>
          <div className="h-10 w-full md:w-[170px] bg-zinc-800 rounded"></div>
        </div>
      </div>
    </div>
  );
}
