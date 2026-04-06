"use client";

import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";

export function BarangayDetailCategories({ quarterData }: { quarterData: any }) {
  if (!quarterData) return null;

  // Sorting for all categories (from largest to lowest)
  const sortedEntries = [...LAND_COVER_CLASSES]
    .map((entry) => ({
      ...entry,
      value: quarterData[entry.id as keyof typeof quarterData] || 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border/50">
      <h3 className="text-xs md:text-sm font-semibold text-foreground">
        All Categories
      </h3>
      <div className="space-y-2">
        {sortedEntries.map((entry) => {
          const color =
            LAND_COVER_CLASSES.find((c) => c.id === entry.id)?.color || "#ccc";

          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 text-xs md:text-sm group"
            >
              <div
                className="w-3 h-3 rounded-sm shrink-0 shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: color }}
              />
              <span className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors">
                {entry.label}
              </span>
              <span className="font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-border shadow-sm">
                {entry.value.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
