"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBarangayStore } from "@/lib/store/barangayStore";
import { getBaranggayTimeSeriesData } from "@/actions/getBaranggayTimeSeriesData";
import type { BarangayLandCoverTimeSeries } from "../lib/types/barangay-landcover-timeseries"

export type BarangayDetailPanelProps = {
  onClose: () => void;
}

export function BarangayDetailPanel({ onClose }: BarangayDetailPanelProps) {
  const { selectedBarangay, currentYear } = useBarangayStore();
  const [timeSeries, setTimeSeries] = useState<BarangayLandCoverTimeSeries>();
  const [loading, setLoading] = useState<boolean>(false);

  // re-fetch time series data when currentYear or selectedBarangay changes 
  useEffect(() => {
    const fetchTimeSeries = async () => {
      setLoading(true);
      const timeSeries = await getBaranggayTimeSeriesData(selectedBarangay, currentYear);
      setTimeSeries(timeSeries);
      setLoading(false);
    };

    fetchTimeSeries();
  }, [currentYear, selectedBarangay]);

  if(loading || !timeSeries) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-card">
        {/* Header */}
        <div className="p-3 md:p-4 flex items-start justify-between border-b border-border">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              {selectedBarangay}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Detailed Historical Analysis ({currentYear})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Content */}
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-card">
      {/* Header */}
      <div className="p-3 md:p-4 flex items-start justify-between border-b border-border">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            {timeSeries.barangay}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Detailed Historical Analysis ({timeSeries.year})
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      {/* Content */}
      <h1>IMPLEMENT THE CONTENT HERE, MAKE IT BRIEF BUT NOT TOO COMPACTED OF FEATURES. CHECK NYO YUNG GOODS LANG NA INFO NA IPAPAKITA</h1>
    </div>
  );
}