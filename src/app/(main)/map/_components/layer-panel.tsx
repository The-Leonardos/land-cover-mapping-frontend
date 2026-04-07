"use client";

import { useBarangayStore } from "../_stores/barangayStore";

interface LayerPanelProps {
  activeLayers: Set<string>;
  onLayerToggle: (layerId: string) => void;
  segmentationOpacity: number;
  onOpacityChange: (opacity: number) => void;
}

const layers = [
  {
    id: "satellite",
    label: "Satellite Imagery",
    description: "Sentinel-2 Observation",
  },
  {
    id: "segmentation",
    label: "Land Cover Map",
    description: "Automated LULC classification",
  },
  {
    id: "boundaries",
    label: "Barangay Boundaries",
    description: "Official administrative limits",
  },
];

export function LayerPanel({
  activeLayers,
  onLayerToggle,
  segmentationOpacity,
  onOpacityChange,
}: LayerPanelProps) {
  const { YEARS, currentYear } = useBarangayStore();
  const forecastYear = YEARS[YEARS.length - 1];
  const isForecastYear = currentYear === forecastYear;
  const historicalYears = YEARS.slice(0, YEARS.length - 1);
  const startYear = historicalYears[0];
  const endYear = historicalYears[historicalYears.length - 1];

  return (
    <div className="w-64 md:w-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-border">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Map Layers
        </h3>
        <p className="text-xs md:text-xs text-muted-foreground mt-1">
          Viewing historical data ({startYear} - {endYear}) | prediction data ({forecastYear})
        </p>
      </div>

      {/* Layers */}
      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {layers
          .filter((layer) => !(layer.id === "satellite" && isForecastYear))
          .map((layer) => (
            <div key={layer.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2 md:gap-3">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary/20 border border-primary/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs md:text-sm font-bold">
                    {layer.id === "satellite"
                      ? "S"
                      : layer.id === "segmentation"
                        ? "L"
                        : "B"}
                  </span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-foreground">
                    {layer.label}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                    {layer.id === "segmentation"
                      ? isForecastYear
                        ? "DeepLabV3+ AI Prediction"
                        : "Dynamic World Observation"
                      : layer.id === "satellite" && isForecastYear
                        ? "Reference historical view"
                        : layer.description}
                  </p> 
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => onLayerToggle(layer.id)}
                className={`w-9 h-5 md:w-10 md:h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                  activeLayers.has(layer.id) ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-background shadow transition-transform ${
                    activeLayers.has(layer.id)
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Opacity Slider for Segmentation */}
            {layer.id === "segmentation" && !isForecastYear &&
              activeLayers.has("segmentation") && (
                <div className="ml-9 md:ml-11 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-xs text-muted-foreground">
                      Opacity
                    </span>
                    <span className="text-xs md:text-xs font-medium text-primary">
                      {Math.round(segmentationOpacity * 100)}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 md:h-2.5 bg-muted rounded-full flex items-center inset-y-1">
                    <div 
                      className="absolute left-0 h-full bg-primary rounded-l-full pointer-events-none" 
                      style={{ width: `${Math.round(segmentationOpacity * 100)}%` }} 
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(segmentationOpacity * 100)}
                      onChange={(e) =>
                        onOpacityChange(Number.parseInt(e.target.value) / 100)
                      }
                      className="absolute w-full h-full opacity-0 cursor-pointer z-10 m-0"
                    />
                    <div 
                      className="absolute w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full shadow pointer-events-none transform -translate-x-1/2 transition-transform duration-75"
                      style={{ left: `${Math.round(segmentationOpacity * 100)}%` }}
                    />
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
