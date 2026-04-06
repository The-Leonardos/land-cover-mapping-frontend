"use client";

import { useParams } from "next/navigation";

// The ForecastingPanel is currently commented out in the codebase, but I'll import it 
// just in case they uncomment it later, or I'll just render it.
// import { ForecastingPanel } from "../../_components/forecasting-panel";

export default function ForecastDynamicPage() {
  const params = useParams();
  const barangay = params.barangay as string;
  const year = params.year as string;

  return (
    <div className="flex-1 relative min-w-0 flex flex-col h-full bg-background p-3 md:p-6 overflow-auto">
      {/* <ForecastingPanel barangay={barangay} year={year} /> */}
      <h1 className="text-xl font-bold">Forecast for {decodeURIComponent(barangay)} - {year}</h1>
      <p className="text-muted-foreground mt-2">
        Data specific to {decodeURIComponent(barangay)} goes here...
      </p>
    </div>
  );
}
