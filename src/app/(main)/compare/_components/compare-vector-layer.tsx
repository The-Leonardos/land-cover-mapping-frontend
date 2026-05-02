"use client";

import { useEffect, useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// values here are from the metadata of the tiff file of the satellite raw image
const TIFF_METADATA = {
  bbox: [120.54510763905542, 16.360567112026786, 120.63565781969466, 16.434498459909822],
  width: 1008,
  height: 823,
};

/** Case-insensitive, whitespace-normalized comparison for barangay name matching */
function namesMatch(a: string | null, b: string): boolean {
  if (!a) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Compute centroid of a polygon (array of [lng, lat] rings) in SVG pixel coords */
function computeCentroidSVG(geometry: any): { x: number; y: number } | null {
  const { bbox, width, height } = TIFF_METADATA;
  const [minX, minY, maxX, maxY] = bbox;

  const project = ([lng, lat]: [number, number]) => ({
    x: ((lng - minX) / (maxX - minX)) * width,
    y: ((maxY - lat) / (maxY - minY)) * height,
  });

  let coords: [number, number][] = [];
  if (geometry.type === "Polygon") {
    coords = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    let maxLen = 0;
    for (const polygon of geometry.coordinates) {
      if (polygon[0].length > maxLen) {
        maxLen = polygon[0].length;
        coords = polygon[0];
      }
    }
  }
  if (coords.length === 0) return null;

  const projected = coords.map(project);
  const cx = projected.reduce((s, p) => s + p.x, 0) / projected.length;
  const cy = projected.reduce((s, p) => s + p.y, 0) / projected.length;
  return { x: cx, y: cy };
}

interface CompareVectorLayerProps {
  selectedBarangay: string | null;
  hoveredBarangay: string | null;
  onBarangaySelect: (name: string) => void;
  onBarangayHover: (name: string | null) => void;
  onZoomToBarangay: (target: { x: number; y: number }) => void;
}

export const CompareVectorLayer = ({
  selectedBarangay,
  hoveredBarangay,
  onBarangaySelect,
  onBarangayHover,
  onZoomToBarangay,
}: CompareVectorLayerProps) => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const geoRes = await fetch("/BC_Barangays.geojson");
        const data = await geoRes.json();
        setGeojsonData(data);
      } catch (err) {
        console.error("Error loading barangays geometry:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleBarangayClick = (brgyName: string, geometry: any) => {
    onBarangaySelect(brgyName);
    const centroid = computeCentroidSVG(geometry);
    if (centroid) {
      onZoomToBarangay(centroid);
    }
  };

  // Auto-zoom when selectedBarangay changes (e.g. from search bar)
  // Same pattern as BarangayVectorLayer in the map route
  useEffect(() => {
    if (!selectedBarangay || !geojsonData?.features) return;

    const feature = geojsonData.features.find((f: any) =>
      namesMatch(selectedBarangay, f.properties?.BRGY_NAME || "")
    );
    if (!feature) return;

    const centroid = computeCentroidSVG(feature.geometry);
    if (centroid) {
      onZoomToBarangay(centroid);
    }
  }, [selectedBarangay, geojsonData]);

  const svgPaths = useMemo(() => {
    if (!geojsonData || !geojsonData.features) return null;

    const { bbox, width, height } = TIFF_METADATA;
    const [minX, minY, maxX, maxY] = bbox;

    const project = ([lng, lat]: [number, number]) => {
      const x = ((lng - minX) / (maxX - minX)) * width;
      const y = ((maxY - lat) / (maxY - minY)) * height;
      return `${x},${y}`;
    };

    return geojsonData.features.map((feature: any, idx: number) => {
      const brgyName = feature.properties?.BRGY_NAME || "Unknown";
      let d = "";

      if (feature.geometry.type === "Polygon") {
        feature.geometry.coordinates.forEach((ring: any[]) => {
          d += "M " + ring.map(project).join(" L ") + " Z ";
        });
      } else if (feature.geometry.type === "MultiPolygon") {
        feature.geometry.coordinates.forEach((polygon: any[]) => {
          polygon.forEach((ring: any[]) => {
            d += "M " + ring.map(project).join(" L ") + " Z ";
          });
        });
      }

      const isSelected = namesMatch(selectedBarangay, brgyName);
      const isHovered = hoveredBarangay === brgyName;

      const pathElement = (
        <path
          key={idx}
          d={d}
          onClick={() => handleBarangayClick(brgyName, feature.geometry)}
          onMouseEnter={() => onBarangayHover(brgyName)}
          onMouseLeave={() => onBarangayHover(null)}
          className={`
            transition-all duration-200 cursor-pointer
            ${isSelected
              ? "fill-transparent stroke-black stroke-[1px]"
              : isHovered
                ? "fill-transparent stroke-black stroke-[1px]"
                : "fill-transparent stroke-black stroke-[0.5px]"}
          `}
          style={{
            vectorEffect: 'non-scaling-stroke',
            ...(isSelected ? { filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.6))' } : {})
          }}
        />
      );

      return (
        <Tooltip key={idx} delayDuration={0}>
          <TooltipTrigger asChild>
            {pathElement}
          </TooltipTrigger>
          <TooltipContent side="top" className="px-2 py-1 text-xs">
            {brgyName}
          </TooltipContent>
        </Tooltip>
      );
    });
  }, [geojsonData, hoveredBarangay, selectedBarangay]);

  if (loading) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ opacity: 1 }}>
      <svg
        viewBox={`0 0 ${TIFF_METADATA.width} ${TIFF_METADATA.height}`}
        className="max-w-full max-h-full object-contain pointer-events-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {svgPaths}
      </svg>
    </div>
  );
};

export { TIFF_METADATA, computeCentroidSVG };
