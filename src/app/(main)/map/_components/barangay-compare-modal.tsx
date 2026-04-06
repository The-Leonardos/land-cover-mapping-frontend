"use client";

import { X } from "lucide-react";
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";
import { YEARS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { getBaranggayTimeSeriesData } from "../_actions/getBaranggayTimeSeriesData";
import { BarangayCompareEmpty, BarangayCompareLoading } from "../_skeletons/barangay-compare-skeletons";

export type BarangayCompareModalProps = {
  currentYear: number;
  selectedBarangay: string;
  onClose: () => void;
};

export function BarangayCompareModal({
  currentYear,
  selectedBarangay,
  onClose,
}: BarangayCompareModalProps) {
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Compare Years
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Analyzing changes for {selectedBarangay}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Year Selection */}
          <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-lg border border-border/50">
            <div className="flex-1 space-y-2 text-center">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Year</label>
              <select
                value={comparisonYear1}
                onChange={(e) => setComparisonYear1(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer hover:border-primary/30"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center pt-5">
              <span className="text-muted-foreground font-bold bg-muted px-2 py-1 rounded text-xs">VS</span>
            </div>
            <div className="flex-1 space-y-2 text-center">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Compare Year</label>
              <select
                value={comparisonYear2}
                onChange={(e) => setComparisonYear2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          {comparisonLoading ? (
            <BarangayCompareLoading />
          ) : comparisonData1 && comparisonData2 ? (
            <RenderTableComparison
              comparisonData1={comparisonData1}
              comparisonData2={comparisonData2}
              comparisonYear1={comparisonYear1}
              comparisonYear2={comparisonYear2}
            />
          ) : (
            <BarangayCompareEmpty />
          )}
        </div>
      </div>
    </div>
  );
}

// helper function to render the table
function RenderTableComparison({
  comparisonData1,
  comparisonData2,
  comparisonYear1,
  comparisonYear2,
}: {
  comparisonData1: BarangayLandCoverTimeSeries;
  comparisonData2: BarangayLandCoverTimeSeries;
  comparisonYear1: number;
  comparisonYear2: number;
}) {
  return (
    <div className="rounded-xl border border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-4 px-5 font-bold text-foreground">
                Class
              </th>
              <th className="text-center py-4 px-5 font-bold text-foreground">
                <span className="bg-background px-3 py-1.5 rounded-lg border border-border shadow-xs text-xs font-black">
                  {comparisonYear1}
                </span>
              </th>
              <th className="text-center py-4 px-5 font-bold text-foreground">
                <span className="bg-background px-3 py-1.5 rounded-lg border border-border shadow-xs text-xs font-black">
                  {comparisonYear2}
                </span>
              </th>
              <th className="text-center py-4 px-5 font-bold text-foreground">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(() => {
              // Get first quarter data for comparison
              const data1Q1 = comparisonData1.data.find(
                (d: any) => d.quarter === 1,
              );
              const data2Q1 = comparisonData2.data.find(
                (d: any) => d.quarter === 1,
              );

              if (!data1Q1 || !data2Q1) return null;

              return LAND_COVER_CLASSES.map((entry) => {
                const value1 = data1Q1[entry.id as keyof typeof data1Q1] || 0;
                const value2 = data2Q1[entry.id as keyof typeof data2Q1] || 0;
                const change = value2 - value1;
                const isIncrease = change > 0;
                const isZero = change === 0;

                const color = entry.color || "#ccc";

                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="py-4 px-5 text-foreground font-bold flex items-center gap-4">
                      <div
                        className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-sm transition-transform ring-1 ring-black/5 group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                      {entry.label}
                    </td>
                    <td className="py-4 px-5 text-center text-muted-foreground font-semibold">
                      {value1.toFixed(1)}%
                    </td>
                    <td className="py-4 px-5 text-center text-muted-foreground font-semibold">
                      {value2.toFixed(1)}%
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isZero
                            ? "text-muted-foreground bg-muted/50"
                            : isIncrease
                            ? "text-emerald-700 bg-emerald-500/15 dark:text-emerald-400 dark:bg-emerald-500/20"
                            : "text-rose-700 bg-rose-500/15 dark:text-rose-400 dark:bg-rose-500/20"
                        }`}
                      >
                        {!isZero && (isIncrease ? "↑" : "↓")}
                        {Math.abs(change).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}