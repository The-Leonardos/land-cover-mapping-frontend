"use client";

import { useEffect } from "react";
import { TimelineControl } from "@/app/(main)/map/_components/timeline-control";
import { BarangayDetailPanel } from "@/app/(main)/map/_components/barangay-detail-panel";
import { InteractiveMap } from "@/app/(main)/map/_components/interactive-map";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";

export default function MapPage() {
  const { selectedBarangay, setSelectedBarangay, fetchYears } = useBarangayStore();

  // fetch years on mount
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  const handleBarangayDetailsPanelOnClose = () => setSelectedBarangay(null);

  return (
    <>
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
        {/* Main Content Area */}
        <div className="flex-1 relative min-w-0">
          <InteractiveMap />
        </div>

        {/* Detail Panel — desktop sidebar / mobile bottom sheet */}
        {selectedBarangay && (
          <>
            {/* Desktop: fixed-width sidebar */}
            <div className="hidden lg:flex w-96 border-l border-border bg-card flex-col overflow-hidden">
              <BarangayDetailPanel onClose={handleBarangayDetailsPanelOnClose} />
            </div>

            {/* Mobile: bottom sheet backdrop */}
            <div 
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={handleBarangayDetailsPanelOnClose}
            />

            {/* Mobile: bottom sheet */}
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto">
              <BarangayDetailPanel onClose={handleBarangayDetailsPanelOnClose} />
            </div>
          </>
        )}
      </div>

      {/* Bottom Timeline Control */}
      <div className="border-t border-border bg-card p-2 md:p-4 shrink-0 z-20">
        <TimelineControl />
      </div>
    </>
  );
}
