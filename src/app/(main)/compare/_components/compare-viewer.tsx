"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ReactCompareSlider, ReactCompareSliderHandle } from "react-compare-slider";
import { useBarangayStore } from "../../map/_stores/barangayStore";
import { CompareSliderItem } from "./compare-slider-item";
import { Plus, Minus, Loader2 } from "lucide-react";
import { TIFF_METADATA } from "./compare-vector-layer";

interface CompareViewerProps {
  year1: number;
  year2: number;
}

export function CompareViewer({ year1, year2 }: CompareViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Refs for zoom state (avoids stale closures in callbacks)
  const translateRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);

  // Keep refs in sync
  useEffect(() => { translateRef.current = translate; }, [translate]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  // Barangay state — lifted so both slider items share it
  const selectedBarangay = useBarangayStore((state) => state.selectedBarangay);
  const setSelectedBarangay = useBarangayStore((state) => state.setSelectedBarangay);
  const [hoveredBarangay, setHoveredBarangay] = useState<string | null>(null);

  const year1Url = `/data/deeplabv3/dynamic-world/DW_RGB_${year1}_Q1.tif`;
  const year2Url = `/data/deeplabv3/dynamic-world/DW_RGB_${year2}_Q1.tif`;

  const SVG_WIDTH = TIFF_METADATA.width;
  const SVG_HEIGHT = TIFF_METADATA.height;

  // Loading on year change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [year1, year2]);

  // Zoom controls
  const handleZoomIn = () => setScale((s) => Math.min(s * 1.5, 10));
  const handleZoomOut = () => {
    setScale((s) => {
      const newScale = Math.max(s / 1.5, 1);
      if (newScale === 1) setTranslate({ x: 0, y: 0 });
      return newScale;
    });
  };
  const handleRecenter = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setSelectedBarangay(null);
  };

  // Zoom toward cursor — same math as interactive-map.tsx doZoom
  const doZoom = useCallback((newScale: number, mx: number, my: number) => {
    const currentScale = scaleRef.current;
    if (newScale === currentScale) return;
    const ratio = newScale / currentScale;

    const currentTranslate = translateRef.current;
    const newX = mx - (mx - currentTranslate.x) * ratio;
    const newY = my - (my - currentTranslate.y) * ratio;

    if (newScale === 1) {
      setTranslate({ x: 0, y: 0 });
    } else {
      setTranslate({ x: newX, y: newY });
    }
    setScale(newScale);
  }, []);

  // Scroll-wheel zoom toward mouse cursor
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return;

    // Compute mouse position relative to the center of the slider container
    const rect = containerRef.current.getBoundingClientRect();
    const sliderWidth = Math.min(rect.width, 672); // max-w-2xl = 672px
    const sliderLeft = (rect.width - sliderWidth) / 2;
    const mx = e.clientX - rect.left - sliderLeft - sliderWidth / 2;
    const my = e.clientY - rect.top - rect.height / 2;

    const zoomFactor = 1.3;
    const s = scaleRef.current;
    const targetScale = e.deltaY < 0
      ? Math.min(s * zoomFactor, 10)
      : Math.max(s / zoomFactor, 1);

    doZoom(targetScale, mx, my);
  }, [doZoom]);

  // Zoom to barangay — computes translate to center the barangay in the viewport
  const handleZoomToBarangay = useCallback((target: { x: number; y: number }) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // The image is rendered inside a max-w-2xl (672px) centered container
    // that fits the container height. We need the actual rendered dimensions.
    const maxContentWidth = Math.min(containerWidth, 672); // max-w-2xl = 42rem = 672px
    const contentHeight = containerHeight;

    // The TIFF aspect ratio determines how the canvas fits inside the content area
    const tiffAspect = SVG_WIDTH / SVG_HEIGHT; // ~1.225
    let renderedWidth: number;
    let renderedHeight: number;

    if (maxContentWidth / contentHeight > tiffAspect) {
      // Height-constrained
      renderedHeight = contentHeight;
      renderedWidth = contentHeight * tiffAspect;
    } else {
      // Width-constrained
      renderedWidth = maxContentWidth;
      renderedHeight = maxContentWidth / tiffAspect;
    }

    // Target position in pixel coords relative to the rendered image center
    const targetXRatio = target.x / SVG_WIDTH;  // 0 to 1
    const targetYRatio = target.y / SVG_HEIGHT;  // 0 to 1

    // Offset from center of the rendered image
    const offsetX = (targetXRatio - 0.5) * renderedWidth;
    const offsetY = (targetYRatio - 0.5) * renderedHeight;

    const targetScale = Math.max(3, scale);

    // Translate to center the barangay: negate the offset and multiply by scale
    const tx = -offsetX * targetScale;
    const ty = -offsetY * targetScale;

    setScale(targetScale);
    setTranslate({ x: tx, y: ty });
  }, [SVG_WIDTH, SVG_HEIGHT, scale]);

  // Shared props for both slider items
  const itemProps = {
    scale,
    translate,
    selectedBarangay,
    hoveredBarangay,
    onBarangaySelect: setSelectedBarangay,
    onBarangayHover: setHoveredBarangay,
    onZoomToBarangay: handleZoomToBarangay,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-w-0 min-h-0 bg-black/5 overflow-hidden"
      onWheel={handleWheel}
    >
      {/* Zoom Controls */}
      <div className="absolute left-2 md:left-4 top-2 md:top-4 z-30 flex flex-col gap-1.5 md:gap-2">
        <button onClick={handleZoomIn} className="p-2 md:p-2.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all shadow-md group" title="Zoom In">
          <Plus className="h-4 w-4 md:h-5 md:w-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
        <button onClick={handleZoomOut} className="p-2 md:p-2.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all shadow-md group" title="Zoom Out">
          <Minus className="h-4 w-4 md:h-5 md:w-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
        <button onClick={handleRecenter} className="p-2 md:p-2.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all shadow-md group" title="Recenter">
          <span className="h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-primary font-bold text-lg md:text-xl leading-none">𖦏</span>
        </button>
      </div>

      {/* Year Labels */}
      <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <span className="px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border text-sm font-bold text-foreground shadow-md tabular-nums">{year1}</span>
        <span className="text-xs text-muted-foreground font-semibold">VS</span>
        <span className="px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border text-sm font-bold text-foreground shadow-md tabular-nums">{year2}</span>
      </div>

      {/* Selected Barangay Info */}
      {selectedBarangay && (
        <div className="absolute right-2 md:right-4 top-2 md:top-4 z-30">
          <div className="px-3 py-2 rounded-lg bg-card/90 backdrop-blur-sm border border-primary/30 shadow-md">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Viewing</p>
            <p className="text-sm font-bold text-foreground">{selectedBarangay}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/40 pointer-events-auto">
          <div className="bg-card border border-border p-4 rounded-lg shadow-md flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-primary" />
            <p className="text-sm text-foreground">Loading Comparison</p>
          </div>
        </div>
      )}

      {/* Compare Slider — constrained to max-w-2xl centered container */}
      <div className="w-full max-w-2xl mx-auto h-full">
        <ReactCompareSlider
          itemOne={<CompareSliderItem url={year1Url} {...itemProps} />}
          itemTwo={<CompareSliderItem url={year2Url} {...itemProps} />}
          style={{ width: "100%", height: "100%" }}
          handle={
            <ReactCompareSliderHandle
              buttonStyle={{
                width: 40,
                height: 40,
              }}
            />
          }
        />
      </div>
    </div>
  );
}
