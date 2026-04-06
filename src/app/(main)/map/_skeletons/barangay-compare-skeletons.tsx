"use client";

import { X, SearchX } from "lucide-react";

export function BarangayCompareLoading() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm animate-in fade-in duration-500">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="py-3 px-4"><div className="h-4 w-12 bg-muted rounded animate-pulse" /></th>
            <th className="py-3 px-4"><div className="h-6 w-16 bg-muted rounded mx-auto animate-pulse" /></th>
            <th className="py-3 px-4"><div className="h-6 w-16 bg-muted rounded mx-auto animate-pulse" /></th>
            <th className="py-3 px-4"><div className="h-4 w-16 bg-muted rounded mx-auto animate-pulse" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[...Array(7)].map((_, i) => (
            <tr key={i}>
              <td className="py-4 px-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-muted animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </td>
              <td className="py-4 px-4"><div className="h-4 w-12 bg-muted rounded mx-auto animate-pulse" /></td>
              <td className="py-4 px-4"><div className="h-4 w-12 bg-muted rounded mx-auto animate-pulse" /></td>
              <td className="py-4 px-4"><div className="h-6 w-16 bg-muted rounded mx-auto animate-pulse" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BarangayCompareEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/10 rounded-xl border border-dashed border-border/50 animate-in fade-in duration-500">
      <div className="p-3 bg-muted/20 rounded-full mb-4">
        <SearchX className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">No comparison data available</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
        Try selecting different years to compare the land cover changes.
      </p>
    </div>
  );
}
