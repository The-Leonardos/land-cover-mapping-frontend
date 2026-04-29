export function ModelStatusCardSkeleton() {
  return (
    <div className="md:col-span-1 rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg p-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 mb-6">
        <div className="h-5 w-36 bg-zinc-800 rounded" />
        <div className="h-4 w-64 bg-zinc-800 rounded" />
      </div>

      {/* Status pill */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-800/50">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="h-5 w-20 bg-zinc-700 rounded" />
        </div>
      </div>

      {/* Auto-refresh label */}
      <div className="mt-4">
        <div className="h-4 w-28 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}
