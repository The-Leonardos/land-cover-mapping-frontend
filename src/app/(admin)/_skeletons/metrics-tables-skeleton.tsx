export function MetricsTablesSkeleton() {
  return (
    <div className="w-full text-zinc-100 flex flex-col animate-pulse">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-0 mb-6 gap-4 relative">
        <div className="h-7 w-40 bg-zinc-800 rounded/lg md:pb-3 mb-2 md:mb-1"></div>
        
        <div className="flex gap-4 h-9">
          <div className="h-full w-32 md:w-48 bg-zinc-800 rounded-t-sm border-b-2 border-zinc-700"></div>
          <div className="h-full w-32 md:w-48 bg-zinc-800 rounded-t-sm border-b-2 border-zinc-700"></div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <div className="h-5 w-64 bg-zinc-800 rounded mb-3"></div>
          <div className="h-4 w-80 max-w-full bg-zinc-800 rounded"></div>
        </div>
        
        <div className="overflow-x-auto p-0">
          <div className="bg-zinc-950/50 border-b border-zinc-800 h-12 w-full flex items-center px-6 gap-6 min-w-max">
            <div className="h-3 w-32 bg-zinc-800 rounded flex-shrink-0"></div>
            <div className="h-3 w-28 bg-zinc-800 rounded flex-shrink-0"></div>
            <div className="h-3 w-20 bg-zinc-800 rounded flex-shrink-0"></div>
            <div className="h-3 w-16 bg-zinc-800 rounded flex-shrink-0"></div>
            <div className="h-3 w-16 bg-zinc-800 rounded flex-shrink-0"></div>
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-zinc-800/50 h-14 w-full flex items-center px-6 gap-6 min-w-max">
              <div className="h-4 w-32 bg-zinc-800 rounded flex-shrink-0"></div>
              <div className="h-4 w-28 bg-zinc-800 rounded flex-shrink-0"></div>
              <div className="h-4 w-16 bg-zinc-800 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-zinc-800 rounded flex-shrink-0"></div>
              <div className="h-4 w-12 bg-zinc-800 rounded flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
