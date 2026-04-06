"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { getBaranggayTimeSeriesData } from "@/app/(main)/map/_actions/getBaranggayTimeSeriesData";
import type { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { BarangayDetailChart } from "./barangay-detail-chart";
import { BarangayDetailCategories } from "./barangay-detail-categories";
import { BarangayCompareModal } from "./barangay-compare-modal";
import { BarangayDetailPanelSkeleton } from "../_skeletons/barangay-detail-panel-skeleton";

export type BarangayDetailPanelProps = {
  onClose: () => void;
};

export function BarangayDetailPanel({ onClose }: BarangayDetailPanelProps) {
  const { selectedBarangay, currentYear } = useBarangayStore();

  const [timeSeries, setTimeSeries] = useState<BarangayLandCoverTimeSeries>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  // re-fetch time series data when the currentYear or the selectedBarangay changes
  useEffect(() => {
    const fetchTimeSeries = async () => {
      if (!selectedBarangay) return;

      try {
        setLoading(true);
        const timeSeries = await getBaranggayTimeSeriesData(
          selectedBarangay,
          currentYear,
        );
        setTimeSeries(timeSeries);
        setSelectedQuarter(1);
      } catch (error) {
        console.error("Failed to fetch time series data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSeries();
  }, [currentYear, selectedBarangay]);

  if (loading || !timeSeries) {
    return (
      <BarangayDetailPanelSkeleton onClose={onClose}/>
    );
  }

  const quarterData = timeSeries.data.find(
    (d: any) => d.quarter === selectedQuarter,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-card rounded-r-xl border-l border-border shadow-2xl">
      {/* Header */}
      <div className="p-4 md:p-5 flex items-start justify-between border-b border-border/80 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
            {timeSeries.barangay}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
            Detailed Historical Analysis ({timeSeries.year})
          </p>
          <button
            onClick={() => setShowComparisonModal(true)}
            className="mt-3 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary/50 transition-all duration-300 shadow-sm"
          >
            Compare Years
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
        <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
          {[1, 2, 3, 4].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`flex-1 px-3 py-2 rounded-md text-xs md:text-sm font-bold transition-all duration-300 ${
                selectedQuarter === q
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              Q{q}
            </button>
          ))}
        </div>

        <BarangayDetailChart quarterData={quarterData} />

        <div className="pt-2">
          <BarangayDetailCategories quarterData={quarterData} />
        </div>
      </div>

      {/* Compare Years Modal */}
      {showComparisonModal && (
        <BarangayCompareModal
          currentYear={currentYear}
          selectedBarangay={timeSeries.barangay}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
}
