"use client";

import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";

export function BarangayDetailChart({ quarterData }: { quarterData: any }) {
  if (!quarterData) return null;

  const total = LAND_COVER_CLASSES.reduce(
    (sum, entry) =>
      sum + (quarterData[entry.id as keyof typeof quarterData] || 0),
    0,
  );

  // Sorting for top 3 (from largest to lowest)
  const sortedEntries = [...LAND_COVER_CLASSES]
    .map((entry) => ({
      ...entry,
      value: quarterData[entry.id as keyof typeof quarterData] || 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4">
      {/* Stacked Bar */}
      <div className="flex h-6 rounded-md overflow-hidden bg-muted border border-border shadow-sm">
        {LAND_COVER_CLASSES.map((entry) => {
          const value = quarterData[entry.id as keyof typeof quarterData] || 0;
          const percentage = (value / total) * 100;
          const color =
            LAND_COVER_CLASSES.find((c) => c.id === entry.id)?.color ||
            "#ccc";

          if (percentage === 0) return null;

          return (
            <div
              key={entry.id}
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
              className="h-full transition-all duration-300 hover:opacity-90"
              title={`${entry.label}: ${value.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* Top 3 List */}
      <div className="text-xs text-muted-foreground space-y-2">
        <h3 className="font-semibold text-xs md:text-sm text-foreground mb-2">
          Top Cover Types
        </h3>
        {sortedEntries
          .filter((entry) => entry.value > 5)
          .slice(0, 3)
          .map((entry) => {
            const color =
              LAND_COVER_CLASSES.find((c) => c.id === entry.id)?.color || "#ccc";
            return (
              <div key={entry.id} className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded-md border border-border/50">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span>{entry.label}</span>
                </div>
                <span className="font-medium text-foreground">
                  {entry.value.toFixed(1)}%
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
