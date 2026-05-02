import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";
import { LandCoverQuarterData } from "@/lib/types/barangay-landcover-timeseries";
import { formatDisplayArea, getBarangayAreaByName } from "@/lib/utils";
import { useBarangayStore } from "../_stores/barangayStore";

export function BarangayDetailChart({ quarterData }: { quarterData: LandCoverQuarterData }) {
  if (!quarterData) return null;
  
  const selectedBarangay = useBarangayStore((state)=> state.selectedBarangay);

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
              <div
                key={entry.id}
                className="flex items-center gap-3 text-xs md:text-sm group"
              >
                <div
                  className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[3px] shrink-0 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color }}
                />
                <span className="flex-1 text-muted-foreground group-hover:text-foreground transition-colors text-xs md:text-sm">
                  {entry.label}
                </span>
                <span className="text-foreground text-xs">
                  {formatDisplayArea(getBarangayAreaByName(selectedBarangay!) * (entry.value / 100))}
                </span>
                <span className="font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-border shadow-sm text-xs md:text-sm">
                  {entry.value.toFixed(1)}%
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
