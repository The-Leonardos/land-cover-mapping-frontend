"use client";

import { useEffect, useState, useMemo } from "react";
import { useBarangayStore } from "@/lib/store/barangayStore";

// values here are from the metadata of the tiff file of the satellite raw image
const TIFF_METADATA={
  bbox: [120.54510763905542, 16.360567112026786, 120.63565781969466, 16.434498459909822],
  width: 1008, 
  height: 823
}

export const BarangayVectorLayer = () => {
  const { selectedBarangay, setSelectedBarangay } = useBarangayStore();
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

      const isSelected = selectedBarangay === brgyName;
      const isHovered = hoveredBrgy === brgyName;

      return (
        <path
          key={idx}
          d={d}
          onClick={() => setSelectedBarangay(brgyName)}
          onMouseEnter={() => setHoveredBrgy(brgyName)}
          onMouseLeave={() => setHoveredBrgy(null)}
          className={`
            transition-all duration-200 cursor-pointer
            ${isHovered || isSelected 
              ? "fill-black/20 stroke-black stroke-[3px]" 
              : "fill-transparent stroke-black stroke-[1px]"}
          `}
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
      );
    });
  }, [geojsonData, hoveredBrgy, selectedBarangay]);

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
