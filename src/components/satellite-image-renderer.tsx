"use client";

import React, { useEffect, useRef, useState } from "react";
import { fromUrl } from "geotiff";

interface SatelliteImageRendererProps {
  url: string;
}

export const SatelliteImageRenderer: React.FC<SatelliteImageRendererProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderTiff() {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting Satellite GeoTIFF render for:", url);

        // fromUrl is often better for tiled GeoTIFFs
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();

        const width = image.getWidth();
        const height = image.getHeight();
        console.log("Image dimensions:", width, "x", height);

        // Read specific bands (B4, B3, B2)
        // Metadata: 0=B4(Red), 1=B3(Green), 2=B2(Blue)
        const samples = [0, 1, 2];
        const rasters = await image.readRasters({
          samples: samples,
          // Reading without interleave returns an array of arrays [red, green, blue]
          // which is more reliable across different BigTIFF structures.
          interleave: false,
        });

        if (isCancelled) return;

        // rasters is an array of TypedArrays (e.g., Float32Array[])
        const [redBand, greenBand, blueBand] = rasters as any;
        console.log("First pixel (R,G,B):", redBand[0], greenBand[0], blueBand[0]);

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imageData = ctx.createImageData(width, height);
        const rgba = imageData.data;

        const saturationPoint = 0.3; // Reflectance values above 0.3 will be white
        const gain = 255 / saturationPoint;

        for (let i = 0; i < width * height; i++) {
          const r = redBand[i];
          const g = greenBand[i];
          const b = blueBand[i];

          // Apply gain and map to 0-255 bits for canvas
          rgba[i * 4] = Math.max(0, Math.min(255, r * gain));
          rgba[i * 4 + 1] = Math.max(0, Math.min(255, g * gain));
          rgba[i * 4 + 2] = Math.max(0, Math.min(255, b * gain));
          rgba[i * 4 + 3] = 255; // Full opacity
        }

        ctx.putImageData(imageData, 0, 0);
        console.log("Render complete");
        setLoading(false);
      } catch (err) {
        console.error("Error rendering TIFF:", err);
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Failed to load/render TIFF");
          setLoading(false);
        }
      }
    }

    renderTiff();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-background/50 backdrop-blur-sm z-10 rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Processing Satellite Image...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-xl shadow-xl pointer-events-auto bg-card">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mb-3">
             <span className="text-2xl">⚠️</span>
          </div>
          <p className="font-bold text-lg mb-1">Failed to Render TIFF</p>
          <p className="text-sm opacity-90 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'pixelated' }}
        className="max-w-full max-h-full object-contain pointer-events-auto"
      />
    </div>
  );
};
