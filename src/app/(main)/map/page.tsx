"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { TimelineControl } from "@/app/(main)/map/_components/timeline-control";
import { BarangayDetailPanel } from "@/app/(main)/map/_components/barangay-detail-panel";
import { InteractiveMap } from "@/app/(main)/map/_components/interactive-map";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";

export default function MapPage() {
  const { selectedBarangay, setSelectedBarangay, fetchYears } = useBarangayStore();
  const [showMobilePanel, setShowMobilePanel] = useState<boolean>(false);

  // fetch years on mount
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const handleBarangayDetailsPanelOnClose = () => {
    setSelectedBarangay(null);
    setShowMobilePanel(false);
  };

  return (
    <>
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
        {/* Main Content Area */}
        <div className="flex-1 relative min-w-0">
          <InteractiveMap />
        </div>

        {/* Right Detail Panel - Desktop Only */}
        {selectedBarangay && (
          <div className="hidden 2xl:flex w-96 border-l border-border bg-card flex-col overflow-hidden">
            <BarangayDetailPanel onClose={handleBarangayDetailsPanelOnClose} />
          </div>
        )}

        {/* Mobile Bottom Sheet Panel */}
        {selectedBarangay && (
          <div
            className={`lg:hidden fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 ease-out ${
              showMobilePanel ? "translate-y-0" : "translate-y-[calc(100%-4rem)]"
            }`}
          >
            {/* Pull Tab */}
            <button
              onClick={() => setShowMobilePanel(!showMobilePanel)}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-card border border-b-0 border-border rounded-t-xl px-6 py-2 flex items-center gap-2"
            >
              <ChevronUp
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  showMobilePanel ? "rotate-180" : ""
                }`}
              />
              <span className="text-sm font-medium text-foreground">
                {selectedBarangay}
              </span>
            </button>

            <div className="bg-card border-t border-border max-h-[70vh] overflow-hidden flex flex-col">
              <BarangayDetailPanel onClose={handleBarangayDetailsPanelOnClose} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Control */}
      <div className="border-t border-border bg-card p-2 md:p-4 shrink-0 z-20">
        <TimelineControl />
      </div>
    </>
  );
}
