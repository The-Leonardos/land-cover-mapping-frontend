"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Layers3 } from "lucide-react";
import { SatelliteImageRenderer } from "./satellite-image-renderer";
import { DynamicWorldImageRenderer } from "./dynamic-world-image-renderer";
import { LayerPanel } from "./layer-panel";
import { BarangayVectorLayer } from "./barangay-vector-layer";

export const InteractiveMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["satellite", "segmentation", "boundaries"]));
  const [segmentationOpacity, setSegmentationOpacity] = useState<number>(1);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [initialScale, setInitialScale] = useState<number>(1);
  const [mapSize, setMapSize] = useState<number>(1000);
  

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;

      // Set a smaller base map size for smaller screens to make it more compact
      if(window.innerWidth < 640){
        setMapSize(600);
      }else if(window.innerWidth < 768){
        setMapSize(800);
      }else{
        setMapSize(1000); // default map size
      }

      // Auto-fit the map inside the container, keeping a little margin
      const calculatedScale = Math.min(clientWidth / mapSize, clientHeight / mapSize) * 0.95;
      const validScale = Math.max(calculatedScale, 0.1);
      setScale(validScale);
      setInitialScale(validScale);
    }
  }, []);

  // Panning state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleLayerToggle = (layerId: string) => {
    const newLayers = new Set(activeLayers);
    if (newLayers.has(layerId)) {
      newLayers.delete(layerId);
    } else {
      newLayers.add(layerId);
    }
    setActiveLayers(newLayers);
  };

  const handleRecenter = () => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  };

  const doZoom = (newScale: number, mx: number = 0, my: number = 0) => {
    if (newScale === scale) return;
    const ratio = newScale / scale;
    
    // Zoom towards cursor (mx, my) or center if (0, 0)
    let newX = mx - (mx - position.x) * ratio;
    let newY = my - (my - position.y) * ratio;
    
    const maxPanX = (mapSize * newScale) / 1.5;
    const maxPanY = (mapSize * newScale) / 1.5;
    
    newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
    newY = Math.max(-maxPanY, Math.min(maxPanY, newY));
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  const handleZoomIn = () => doZoom(Math.min(scale * 1.5, 10));
  const handleZoomOut = () => doZoom(Math.max(scale / 1.5, 0.1));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    let newX = e.clientX - startPos.x;
    let newY = e.clientY - startPos.y;
    
    // Bounding limits to stop infinite drag.
    // Based on center (0,0) drag offset for the map size.
    const maxPanX = (mapSize * scale) / 1.5;
    const maxPanY = (mapSize * scale) / 1.5;
    
    newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
    newY = Math.max(-maxPanY, Math.min(maxPanY, newY));

    setPosition({ x: newX, y: newY });
  };  

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartPos({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    let newX = e.touches[0].clientX - startPos.x;
    let newY = e.touches[0].clientY - startPos.y;
    
    const maxPanX = (mapSize * scale) / 1.5;
    const maxPanY = (mapSize * scale) / 1.5;
    
    newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
    newY = Math.max(-maxPanY, Math.min(maxPanY, newY));

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    
    // Calculate cursor position relative to the center of the container
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    
    const zoomFactor = 1.30; // Finer zoom factor for mouse wheel
    let targetScale = scale;
    if (e.deltaY < 0) {
      targetScale = Math.min(scale * zoomFactor, 25);
    } else {
      targetScale = Math.max(scale / zoomFactor, 0.5);
    }
    
    doZoom(targetScale, mx, my);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black/5 overflow-hidden">
      {/* Controls Container */}
      <div className="absolute left-2 md:left-4 top-2 md:top-4 z-20 flex flex-col gap-1.5 md:gap-2">
        <button onClick={handleZoomIn} className="p-2 md:p-2.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all shadow-md group">
          <Plus className="h-4 w-4 md:h-5 md:w-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
        <button onClick={handleZoomOut} className="p-2 md:p-2.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all shadow-md group">
          <Minus className="h-4 w-4 md:h-5 md:w-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={`p-2 md:p-2.5 backdrop-blur-sm border rounded-lg transition-all shadow-md ${
            showLayerPanel
              ? "bg-primary/20 border-primary text-primary"
              : "bg-card/95 border-border hover:bg-muted hover:border-primary/50"
          }`}
        >
          <Layers3 className={`h-4 w-4 md:h-5 md:w-5 ${showLayerPanel ? "text-primary" : "text-foreground"}`} />
        </button>
        <button
          onClick={handleRecenter}
          className="p-2 md:p-2.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg hover:bg-muted hover:border-primary/50 transition-all shadow-md group"
          title="Recenter Map"
        >
          <span className="h-4 w-4 md:h-5 md:w-5 flex items-center justify-center text-primary font-bold text-lg md:text-xl leading-none">
            𖦏
          </span>
        </button>
      </div>

      {/* Layer Panel */}
      {showLayerPanel && (
        <div className="absolute left-12 md:left-16 top-2 md:top-4 z-30">
          <LayerPanel
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            segmentationOpacity={segmentationOpacity}
            onOpacityChange={setSegmentationOpacity}
          />
        </div>
      )}

      {/* Map Area */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div 
          className="w-full h-full flex items-center justify-center origin-center transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          <div className="relative" style={{ width: mapSize, height: mapSize }}>
            {activeLayers.has("satellite") && (
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <SatelliteImageRenderer url="/2023_Q1.tif" />
              </div>
            )}
            {activeLayers.has("segmentation") && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-200" style={{ opacity: segmentationOpacity }}>
                <DynamicWorldImageRenderer url="/DW_RGB_2023_Q1.tif" />
              </div>
            )}
            {activeLayers.has("boundaries") && (
              <div className="absolute inset-0 z-20">
                <BarangayVectorLayer />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
