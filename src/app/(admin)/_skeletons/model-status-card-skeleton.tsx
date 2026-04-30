export function ModelStatusCardSkeleton() {
  return (
    <div className="md:col-span-1 rounded-xl border border-border bg-card shadow-xl shadow-black/20 p-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col space-y-2 mb-10">
        <div className="h-5 w-36 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted/60 rounded" />
      </div>

      {/* Simplified Status Block */}
      <div className="h-10 w-40 bg-muted/40 rounded-full mb-6" />

      {/* Bottom label */}
      <div className="h-3 w-28 bg-muted/60 rounded" />
    </div>
  );
}
