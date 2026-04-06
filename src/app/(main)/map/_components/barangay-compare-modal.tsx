"use client";

import { X } from "lucide-react";
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";
import { YEARS } from "@/lib/utils/constants";
import { useEffect, useState } from "react";
import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { getBaranggayTimeSeriesData } from "../_actions/getBaranggayTimeSeriesData";

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

  // fetch the comparison data
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-2xl border border-border max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Compare Years
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              {selectedBarangay}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
          {/* Year Selection */}
          <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-lg border border-border/50">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Year</label>
              <select
                value={comparisonYear1}
                onChange={(e) => setComparisonYear1(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
            <div className="flex-1 space-y-1">
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
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium animate-pulse">Loading comparison data...</p>
            </div>
          ) : comparisonData1 && comparisonData2 ? (
            <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Class
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      <span className="bg-background px-2 py-1 rounded-md border border-border shadow-sm">{comparisonYear1}</span>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      <span className="bg-background px-2 py-1 rounded-md border border-border shadow-sm">{comparisonYear2}</span>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
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
                      const value1 =
                        data1Q1[entry.id as keyof typeof data1Q1] || 0;
                      const value2 =
                        data2Q1[entry.id as keyof typeof data2Q1] || 0;
                      const change = value2 - value1;
                      const isIncrease = change > 0;
                      const isZero = change === 0;

                      const color =
                        LAND_COVER_CLASSES.find((c) => c.id === entry.id)?.color || "#ccc";

                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <td className="py-3 px-4 text-foreground font-medium flex items-center gap-3">
                             <div
                                className="w-3 h-3 rounded-sm shrink-0 shadow-sm transition-transform group-hover:scale-110"
                                style={{ backgroundColor: color }}
                              />
                            {entry.label}
                          </td>
                          <td className="py-3 px-4 text-center text-muted-foreground">
                            {value1.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-center text-muted-foreground">
                            {value2.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                                isZero 
                                  ? "text-muted-foreground bg-muted" 
                                  : isIncrease
                                  ? "text-emerald-700 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20"
                                  : "text-rose-700 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/20"
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
          ) : (
             <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/50">
               No comparison data available
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
