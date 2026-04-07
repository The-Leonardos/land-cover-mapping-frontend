"use client";

import { X } from "lucide-react";
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class";
import { YEARS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { getBaranggayTimeSeriesData } from "../_actions/getBaranggayTimeSeriesData";
import { BarangayCompareEmpty, BarangayCompareLoading } from "../_skeletons/barangay-compare-skeletons";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Base Year</label>
              <select
                value={comparisonYear1}
                onChange={(e) => setComparisonYear1(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer hover:border-primary/30"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center sm:pt-5">
              <span className="text-muted-foreground font-semibold bg-muted px-2.5 py-1 rounded text-xs">VS</span>
            </div>

            <div className="w-full sm:w-auto flex-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Compare Year</label>
              <select
                value={comparisonYear2}
                onChange={(e) => setComparisonYear2(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer hover:border-primary/30"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table Container */}
          <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">              
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
}: {
  comparisonData1: BarangayLandCoverTimeSeries;
  comparisonData2: BarangayLandCoverTimeSeries;
  comparisonYear1: number;
  comparisonYear2: number;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/30">
          <th className="text-left py-4 px-5 font-bold text-foreground">
            Class
          </th>
          <th className="text-center py-4 px-5 font-bold text-foreground">
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold">
              {comparisonYear1}
            </span>
          </th>
          <th className="text-center py-4 px-5 font-bold text-foreground">
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold">
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
                <td className="py-4 px-5 text-foreground font-semibold flex items-center gap-4">
                  <div
                    className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-sm transition-transform ring-1 ring-black/5 group-hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                  {entry.label}
                </td>
                <td className="py-4 px-5 text-center text-muted-foreground">
                  {value1.toFixed(1)}%
                </td>
                <td className="py-4 px-5 text-center text-muted-foreground">
                  {value2.toFixed(1)}%
                </td>
                <td className="py-4 px-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
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
  );
}