export function MetricsTablesSkeleton() {
  return (
    <div className="w-full text-foreground flex flex-col animate-pulse">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-0 mb-6 gap-4 relative">
        <div className="h-7 w-40 bg-muted rounded mb-2 md:mb-1"></div>
        
        <div className="flex gap-4 h-9">
          <div className="h-full w-32 md:w-40 bg-muted/40 rounded-t-sm border-b-2 border-muted"></div>
          <div className="h-full w-32 md:w-40 bg-muted/40 rounded-t-sm border-b-2 border-muted"></div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xl shadow-black/20 overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="h-5 w-64 bg-muted rounded mb-3"></div>
          <div className="h-4 w-80 max-w-full bg-muted/60 rounded"></div>
        </div>
        
        <div className="overflow-x-auto p-0">
          <div className="bg-muted/50 border-b border-border h-12 w-full flex items-center px-6 gap-6 min-w-max">
            <div className="h-3 w-32 bg-muted/40 rounded flex-shrink-0"></div>
            <div className="h-3 w-28 bg-muted/40 rounded flex-shrink-0"></div>
            <div className="h-3 w-20 bg-muted/40 rounded flex-shrink-0"></div>
            <div className="h-3 w-16 bg-muted/40 rounded flex-shrink-0"></div>
            <div className="h-3 w-16 bg-muted/40 rounded flex-shrink-0"></div>
            <div className="h-3 w-16 bg-muted/40 rounded flex-shrink-0"></div>
            <div className="h-3 w-16 bg-muted/40 rounded flex-shrink-0"></div>
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-border/50 h-14 w-full flex items-center px-6 gap-6 min-w-max">
              <div className="h-4 w-32 bg-muted/60 rounded flex-shrink-0"></div>
              <div className="h-4 w-28 bg-muted/60 rounded flex-shrink-0"></div>
              <div className="h-4 w-16 bg-muted/60 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-muted/60 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-muted/60 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-muted/60 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-muted/60 rounded flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
