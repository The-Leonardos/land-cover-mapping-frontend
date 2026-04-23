"use client";

import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";
import { useEffect, useState } from "react";
import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { getBaranggayTimeSeriesData } from "../_actions/getBaranggayTimeSeriesData";
import { BarangayCompareEmpty, BarangayCompareLoading } from "../_skeletons/barangay-compare-skeletons";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useBarangayStore } from "../_stores/barangayStore";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatDisplayArea, getBarangayAreaByName } from "@/lib/utils";
import { BarangayCompareYearFilters } from "./barangay-compare-year-filters";

export type BarangayCompareModalProps = {
  currentYear: number;
  selectedBarangay: string;
  trigger: React.ReactNode;
};

export function BarangayCompareModal({
  currentYear,
  selectedBarangay,
  trigger
}: BarangayCompareModalProps) {
  const YEARS = useBarangayStore((state) => state.YEARS);
  const [comparisonYear1, setComparisonYear1] = useState<number>(currentYear - 1);
  const [comparisonYear2, setComparisonYear2] = useState<number>(currentYear);

  const [comparisonData1, setComparisonData1] = useState<BarangayLandCoverTimeSeries>();
  const [comparisonData2, setComparisonData2] = useState<BarangayLandCoverTimeSeries>();
  const [comparisonLoading, setComparisonLoading] = useState<boolean>(false);

  // fetch the comparison data when the comparisonYear1 or comparisonYear2 or the selectedBarangay changes
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!comparisonYear1 || !comparisonYear2 || !selectedBarangay) return;

      try {
        setComparisonLoading(true);
        const data1 = await getBaranggayTimeSeriesData(
          selectedBarangay,
          comparisonYear1,
        );
        const data2 = await getBaranggayTimeSeriesData(
          selectedBarangay,
          comparisonYear2,
        );
        setComparisonData1(data1);
        setComparisonData2(data2);
      } catch (error) {
        console.error("Failed to fetch comparison data:", error);
      } finally {
        setComparisonLoading(false);
      }
    };

    fetchComparisonData();
  }, [comparisonYear1, comparisonYear2, selectedBarangay]);

   return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 md:p-6 border-b border-border bg-muted/30 flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Compare Years
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Analyzing changes for {selectedBarangay}
            </p>
          </div>
        </DialogHeader>

        <div className="p-4 md:p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Year Selection */}
          <BarangayCompareYearFilters
            comparisonYear1={comparisonYear1}
            comparisonYear2={comparisonYear2}
            availableYears={YEARS as unknown as number[]}
            onYear1Change={setComparisonYear1}
            onYear2Change={setComparisonYear2}
          />

          {/* Comparison Table Container */}
          <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">              
            {/* Horizontal scroll wrapper so Change column is never clipped */}
            <div className="overflow-x-auto">
            {comparisonLoading ? (
              <BarangayCompareLoading />
              ) : comparisonData1 && comparisonData2 ? (
                <RenderTableComparison
                  comparisonData1={comparisonData1}
                  comparisonData2={comparisonData2}
                  comparisonYear1={comparisonYear1}
                  comparisonYear2={comparisonYear2}
                  selectedBarangay={selectedBarangay}
                />
              ) : (
                <BarangayCompareEmpty />
              )}          
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// helper function to render the table
function RenderTableComparison({
  comparisonData1,
  comparisonData2,
  comparisonYear1,
  comparisonYear2,
  selectedBarangay
}: {
  comparisonData1: BarangayLandCoverTimeSeries;
  comparisonData2: BarangayLandCoverTimeSeries;
  comparisonYear1: number;
  comparisonYear2: number;
  selectedBarangay: string;
}) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const toggleSort = () => {
    if (sortOrder === null) setSortOrder("desc");
    else if (sortOrder === "desc") setSortOrder("asc");
    else setSortOrder(null);
  };

  return (
    <table className="w-full text-xs min-w-[440px]">
      <thead>
        <tr className="border-b border-border bg-muted/30">
          <th className="text-left py-2 px-3 font-bold text-foreground whitespace-nowrap">
            Class
          </th>
          <th className="text-center py-2 px-3 font-bold text-foreground whitespace-nowrap">
            <span className="px-2 py-1 rounded text-xs font-bold">
              {comparisonYear1}
            </span>
          </th>
          <th className="text-center py-2 px-3 font-bold text-foreground whitespace-nowrap">
            <span className="px-2 py-1 rounded text-xs font-bold">
              {comparisonYear2}
            </span>
          </th>
          <thead 
            className="text-center py-2 px-3 font-bold text-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 transition-colors select-none"
            onClick={toggleSort}
          >
            <div className="flex items-center justify-center gap-1">
              Change
              {sortOrder === "asc" ? (
                <ArrowUp className="w-3 h-3 text-primary" />
              ) : sortOrder === "desc" ? (
                <ArrowDown className="w-3 h-3 text-primary" />
              ) : (
                <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-50" />
              )}
            </div>
          </thead>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {(() => {
          const data1Q1 = comparisonData1.data.find((d: any) => d.quarter === 1);
          const data2Q1 = comparisonData2.data.find((d: any) => d.quarter === 1);

          if (!data1Q1 || !data2Q1) return null;

          let rows = LAND_COVER_CLASSES.map((entry) => {
            const value1 = data1Q1[entry.id as keyof typeof data1Q1] || 0;
            const value2 = data2Q1[entry.id as keyof typeof data2Q1] || 0;
            const change = value2 - value1;
            return { entry, value1, value2, change };
          });

          if (sortOrder === "asc") {
            rows.sort((a, b) => a.change - b.change);
          } else if (sortOrder === "desc") {
            rows.sort((a, b) => b.change - a.change);
          }

          return rows.map(({ entry, value1, value2, change }) => {
            const isIncrease = change > 0;
            const isZero = change === 0;
            const color = entry.color || "#ccc";

            return (
              <tr
                key={entry.id}
                className="hover:bg-muted/20 transition-colors group"
              >
                <td className="py-2.5 md:py-3 px-3 md:px-4 text-foreground font-semibold whitespace-nowrap text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-[3px] shrink-0 shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                    {entry.label}
                  </div>
                </td>
                <td className="py-2.5 md:py-3 px-3 md:px-4 text-center whitespace-nowrap text-xs md:text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-white">{value1.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDisplayArea(getBarangayAreaByName(selectedBarangay) * (value1 / 100))}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 md:py-3 px-3 md:px-4 text-center whitespace-nowrap text-xs md:text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-white">{value2.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDisplayArea(getBarangayAreaByName(selectedBarangay) * (value2 / 100))}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 md:py-3 px-3 md:px-4 text-center whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs md:text-xs font-semibold ${
                        isZero
                          ? "text-muted-foreground bg-muted/50"
                          : isIncrease
                          ? "text-emerald-700 bg-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-500/20"
                          : "text-rose-700 bg-rose-500/15 dark:text-rose-400 dark:bg-rose-500/20"
                      }`}
                    >
                      {!isZero && (isIncrease ? "↑ " : "↓ ")}
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    {!isZero && (
                      <span className={`text-xs font-medium ${
                        isIncrease 
                          ? "text-emerald-600/70 dark:text-emerald-400/60" 
                          : "text-rose-600/70 dark:text-rose-400/60"
                      }`}>
                        {isIncrease ? "+" : "-"}{formatDisplayArea(getBarangayAreaByName(selectedBarangay) * (Math.abs(change) / 100))}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          });
        })()}
      </tbody>
    </table>
  );
}