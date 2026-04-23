import { Skeleton } from "@/components/ui/skeleton"

export function ForecastSkeleton() {
  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 p-3 md:p-6 overflow-auto bg-background animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[76px] min-w-[130px] rounded-lg flex-shrink-0"
          />
        ))}
      </div>

      {/* Separator */}
      <Skeleton className="h-px w-full" />

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-52 rounded-md" />
      </div>

      {/* Chart */}
      <Skeleton className="flex-1 min-h-[350px] md:min-h-[400px] rounded-xl" />
    </div>
  )
}
