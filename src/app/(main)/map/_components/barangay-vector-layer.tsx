"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// values here are from the metadata of the tiff file of the satellite raw image
const TIFF_METADATA={
  bbox: [120.54510763905542, 16.360567112026786, 120.63565781969466, 16.434498459909822],
  width: 1008, 
  height: 823
}

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
    coords = geometry.coordinates[0]; // outer ring
  } else if (geometry.type === "MultiPolygon") {
    // use the largest polygon
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

export const BarangayVectorLayer = () => {
  const { selectedBarangay, setSelectedBarangay, setZoomTarget } = useBarangayStore();
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBrgy, setHoveredBrgy] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const geoRes = await fetch("/BC_Barangays.geojson");
        
        const data = await geoRes.json();
        setGeojsonData(data);
      } catch (err) {
        console.error("Error loading barangays geometry or TIFF metadata:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When selectedBarangay changes and geojson is loaded, compute zoom target
  useEffect(() => {
    if (!selectedBarangay || !geojsonData?.features) return;

    const feature = geojsonData.features.find((f: any) =>
      namesMatch(selectedBarangay, f.properties?.BRGY_NAME || "")
    );
    if (!feature) return;

    const centroid = computeCentroidSVG(feature.geometry);
    if (centroid) {
      setZoomTarget(centroid);
    }
  }, [selectedBarangay, geojsonData, setZoomTarget]);

  const svgPaths = useMemo(() => {
    if (!geojsonData || !geojsonData.features ) return null;

    const { bbox, width, height } = TIFF_METADATA;
    // getBoundingBox() returns [minX, minY, maxX, maxY]
    const [minX, minY, maxX, maxY] = bbox;

    // 2. Function to project a geographic coordinate into pixel space
    // Y is inverted because SVG/Canvas is Top-Left origin while Latitude typically goes Bottom-Up.
    const project = ([lng, lat]: [number, number]) => {
      const x = ((lng - minX) / (maxX - minX)) * width;
      const y = ((maxY - lat) / (maxY - minY)) * height;
      return `${x},${y}`;
    };

    // 3. Generate SVG Paths for each feature
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
      const isHovered = hoveredBrgy === brgyName;

      const pathElement = (
        <path
          key={idx}
          d={d}
          onClick={() => setSelectedBarangay(brgyName)}
          onMouseEnter={() => setHoveredBrgy(brgyName)}
          onMouseLeave={() => setHoveredBrgy(null)}
          className={`
            transition-all duration-200 cursor-pointer
            ${isSelected 
              ? "fill-primary/30 stroke-primary stroke-[3px]"
              : isHovered 
                ? "fill-black/20 stroke-black stroke-[3px]" 
                : "fill-transparent stroke-black stroke-[1px]"}
          `}
          style={{ 
            vectorEffect: 'non-scaling-stroke',
            ...(isSelected ? { filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' } : {})
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
  }, [geojsonData, hoveredBrgy, selectedBarangay, setSelectedBarangay]);

  if (loading) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ opacity: 1 }}>
      {/* 
        The svg uses object-contain mimicking the canvas to perfectly overlap.
      */}
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
