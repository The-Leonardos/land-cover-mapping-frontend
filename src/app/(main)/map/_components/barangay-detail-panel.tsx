"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { getBaranggayTimeSeriesData } from "@/app/(main)/map/_actions/getBaranggayTimeSeriesData";
import { LAND_COVER_CLASSES } from "@/lib/utils/land-cover-classes";
import type { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";

const LAND_COVER_ENTRIES = [
  { key: "water", label: "Water" },
  { key: "trees", label: "Trees" },
  { key: "grass", label: "Grass" },
  { key: "floodedVegetation", label: "Flooded Vegetation" },
  { key: "crops", label: "Crops" },
  { key: "shrub", label: "Shrub & Scrub" },
  { key: "built", label: "Built-up Area" },
  { key: "bare", label: "Bare Ground" },
  { key: "snow", label: "Snow & Ice" },
];

export type BarangayDetailPanelProps = {
  onClose: () => void;
};

export function BarangayDetailPanel({ onClose }: BarangayDetailPanelProps) {
  const { selectedBarangay, currentYear } = useBarangayStore();
  const [timeSeries, setTimeSeries] = useState<BarangayLandCoverTimeSeries>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [comparisonYear1, setComparisonYear1] = useState<number>(currentYear - 1);
  const [comparisonYear2, setComparisonYear2] = useState<number>(currentYear);
  const [comparisonData1, setComparisonData1] =
    useState<BarangayLandCoverTimeSeries>();
  const [comparisonData2, setComparisonData2] =
    useState<BarangayLandCoverTimeSeries>();
  const [comparisonLoading, setComparisonLoading] = useState<boolean>(false);

  useEffect(() => {
    setComparisonYear1(currentYear - 1);
    setComparisonYear2(currentYear);
  }, [currentYear]);

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

  // fetch comparison data for the compare year modal
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!showComparison || !selectedBarangay) return;

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
  }, [showComparison, selectedBarangay, comparisonYear1, comparisonYear2]);

  if (loading || !timeSeries) {
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
          <button
            onClick={() => setShowComparison(true)}
            className="mt-2 px-3 py-1.5 rounded text-xs md:text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Compare Years
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`flex-1 px-2 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${
                selectedQuarter === q
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Q{q}
            </button>
          ))}
        </div>

        {/* Stacked Bar */}
        {(() => {
          const quarterData = timeSeries.data.find(
            (d: any) => d.quarter === selectedQuarter,
          );
          if (!quarterData) return null;

          const total = LAND_COVER_ENTRIES.reduce(
            (sum, entry) =>
              sum + (quarterData[entry.key as keyof typeof quarterData] || 0),
            0,
          );

          return (
            <div className="space-y-2">
              <div className="flex h-6 rounded overflow-hidden bg-muted border border-border">
                {LAND_COVER_ENTRIES.map((entry) => {
                  const value =
                    quarterData[entry.key as keyof typeof quarterData] || 0;
                  const percentage = (value / total) * 100;
                  const color =
                    LAND_COVER_CLASSES.find((c) => c.label === entry.label)
                      ?.color || "#ccc";

                  if (percentage === 0) return null;

                  return (
                    <div
                      key={entry.key}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      className="h-full"
                      title={`${entry.label}: ${value.toFixed(1)}%`}
                    />
                  );
                })}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                {LAND_COVER_ENTRIES.filter(
                  (entry) =>
                    (quarterData[entry.key as keyof typeof quarterData] || 0) >
                    5,
                )
                  .slice(0, 3)
                  .map((entry) => {
                    const value =
                      quarterData[entry.key as keyof typeof quarterData] || 0;
                    return (
                      <div key={entry.key} className="flex justify-between">
                        <span>{entry.label}:</span>
                        <span className="font-medium">{value.toFixed(1)}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })()}

        <div className="space-y-2 border-t border-border pt-3">
          <h3 className="text-xs md:text-sm font-semibold text-foreground">
            All Categories
          </h3>
          <div className="space-y-1.5">
            {(() => {
              const quarterData = timeSeries.data.find(
                (d: any) => d.quarter === selectedQuarter,
              );
              if (!quarterData) return null;

              return LAND_COVER_ENTRIES.map((entry) => {
                const value =
                  quarterData[entry.key as keyof typeof quarterData] || 0;
                const color =
                  LAND_COVER_CLASSES.find((c) => c.label === entry.label)
                    ?.color || "#ccc";

                return (
                  <div
                    key={entry.key}
                    className="flex items-center gap-2 text-xs md:text-sm"
                  >
                    <div
                      className="w-3 h-3 rounded shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="flex-1 text-muted-foreground">
                      {entry.label}
                    </span>
                    <span className="font-medium text-foreground">
                      {value.toFixed(1)}%
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Compare Years Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Compare Years
              </h2>
              <button
                onClick={() => setShowComparison(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              {/* Year Selection */}
              <div className="flex items-center gap-2">
                <select
                  value={comparisonYear1}
                  onChange={(e) => setComparisonYear1(Number(e.target.value))}
                  className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground text-sm"
                >
                  {[
                    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
                  ].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <span className="text-muted-foreground font-medium">vs</span>
                <select
                  value={comparisonYear2}
                  onChange={(e) => setComparisonYear2(Number(e.target.value))}
                  className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground text-sm"
                >
                  {[
                    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
                  ].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comparison Table */}
              {comparisonLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading comparison data...
                </div>
              ) : comparisonData1 && comparisonData2 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold text-foreground">
                          Class
                        </th>
                        <th className="text-center py-2 px-2 font-semibold text-foreground">
                          {comparisonYear1}
                        </th>
                        <th className="text-center py-2 px-2 font-semibold text-foreground">
                          {comparisonYear2}
                        </th>
                        <th className="text-center py-2 px-2 font-semibold text-foreground">
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Get first quarter data for comparison
                        const data1Q1 = comparisonData1.data.find(
                          (d: any) => d.quarter === 1,
                        );
                        const data2Q1 = comparisonData2.data.find(
                          (d: any) => d.quarter === 1,
                        );

                        if (!data1Q1 || !data2Q1) return null;

                        return LAND_COVER_ENTRIES.map((entry) => {
                          const value1 =
                            data1Q1[entry.key as keyof typeof data1Q1] || 0;
                          const value2 =
                            data2Q1[entry.key as keyof typeof data2Q1] || 0;
                          const change = value2 - value1;
                          const isIncrease = change > 0;

                          return (
                            <tr
                              key={entry.key}
                              className="border-b border-border hover:bg-muted/50 transition-colors"
                            >
                              <td className="py-2 px-2 text-foreground">
                                {entry.label}
                              </td>
                              <td className="py-2 px-2 text-center text-muted-foreground">
                                {value1.toFixed(1)}%
                              </td>
                              <td className="py-2 px-2 text-center text-muted-foreground">
                                {value2.toFixed(1)}%
                              </td>
                              <td className="py-2 px-2 text-center font-medium">
                                <span
                                  className={
                                    isIncrease
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {isIncrease ? "↑" : "↓"}{" "}
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
                <div className="text-center py-8 text-muted-foreground">
                  No comparison data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
