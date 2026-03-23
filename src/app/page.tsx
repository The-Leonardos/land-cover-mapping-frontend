"use client";

import { useState } from "react";
import {
  BarChart3,
  Search,
  Globe,
  Satellite,
  ChevronUp,
} from "lucide-react";
import { TimelineControl } from "@/components/timeline-control";
import { ForecastingPanel } from "@/components/forecasting-panel";
import { BarangayDetailPanel } from "@/components/barangay-detail-panel";
import { InteractiveMap } from "@/components/interactive-map";
import { useBarangayStore } from "@/lib/store/barangayStore";

export default function Home() {
  const { selectedBarangay, setSelectedBarangay } = useBarangayStore();
  const [activeTab, setActiveTab] = useState<"map" | "forecast">("map");
  const [showMobilePanel, setShowMobilePanel] = useState<boolean>(false);



  const handleBarangayDetailsPanelOnClose = () => {
    setSelectedBarangay('');
    setShowMobilePanel(false);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="z-20 border-b border-border bg-card px-3 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm">
              <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm md:text-base font-bold text-foreground tracking-tight">
                Baguio City Land Cover
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Monitoring Agent
              </p>
            </div>
          </div>

          {/* Center Tabs - Desktop */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-muted/50 dark:bg-black/30 rounded-xl p-1.5 border border-border gap-1">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "map"
                  ? "bg-card text-foreground shadow-md border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Satellite className="h-4 w-4" />
              <span className="hidden lg:inline">SEGMENTATION MAP</span>
              <span className="lg:hidden">MAP</span>
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "forecast"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden lg:inline">DEEPAR FORECAST</span>
              <span className="lg:hidden">FORECAST</span>
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex md:hidden bg-muted/50 dark:bg-black/30 rounded-lg p-1 border border-border gap-1">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === "map"
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground"
              }`}
            >
              <Satellite className="h-3.5 w-3.5" />
              MAP
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === "forecast"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              FORECAST
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            <div className="relative hidden lg:block mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search barangay..."
                className="pl-10 pr-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">


        {/* Main Content Area */}
        <div className="flex-1 relative">
          {activeTab === "map" ? (
            <div className="w-full h-full relative">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => setSelectedBarangay("Sample Baranggay")}
                  className="p-2 md:p-2.5 bg-primary/95 text-primary-foreground text-xs md:text-sm font-semibold backdrop-blur-sm border border-primary rounded-lg shadow-lg hover:bg-primary/80 transition-all"
                >
                  Test Target "Sample Baranggay"
                </button>
              </div>
              <InteractiveMap />
            </div>
          ) : (
            <ForecastingPanel />
          )}
        </div>

        {/* Right Detail Panel - Desktop Only */}
        {selectedBarangay && activeTab === "map" && (
          <div className="hidden lg:flex w-96 border-l border-border bg-card flex-col overflow-hidden">
            <BarangayDetailPanel onClose={handleBarangayDetailsPanelOnClose} />
          </div>
        )}

        {/* Mobile Bottom Sheet Panel */}
        {selectedBarangay && activeTab === "map" && (
          <div
            className={`lg:hidden fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 ease-out ${showMobilePanel ? "translate-y-0" : "translate-y-[calc(100%-4rem)]"}`}
          >
            {/* Pull Tab */}
            <button
              onClick={() => setShowMobilePanel(!showMobilePanel)}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-card border border-b-0 border-border rounded-t-xl px-6 py-2 flex items-center gap-2"
            >
              <ChevronUp
                className={`h-4 w-4 text-muted-foreground transition-transform ${showMobilePanel ? "rotate-180" : ""}`}
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

      {/* Bottom Timeline Control - Only on Map Tab */}
      {activeTab === "map" && (
        <div className="border-t border-border bg-card p-2 md:p-4">
          <TimelineControl/>
        </div>
      )}
    </div>
  );
}
