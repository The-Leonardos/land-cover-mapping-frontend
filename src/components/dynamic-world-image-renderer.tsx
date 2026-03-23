"use client";

import React, { useEffect, useRef, useState } from "react";
import { fromUrl } from "geotiff";

interface DynamicWorldImageRendererProps {
  url: string;
}

export const DynamicWorldImageRenderer: React.FC<DynamicWorldImageRendererProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderTiff() {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting Dynamic World GeoTIFF render for:", url);

        // fromUrl is often better for tiled GeoTIFFs
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();

        const width = image.getWidth();
        const height = image.getHeight();
        console.log("Image dimensions:", width, "x", height);

        // Dynamic world images might use different bands, but we will preserve 
        // the RGB rendering logic from the original tiff renderer.
        const samples = [0, 1, 2];
        const rasters = await image.readRasters({
          samples: samples,
          interleave: false,
        });

        if (isCancelled) return;

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

        // Dynamic world raw RGB images might need different gain settings
        // Assuming 255-based colors if they are byte or similar reflectance scaling
        const isByte = redBand instanceof Uint8Array || redBand instanceof Uint8ClampedArray;
        // Adjust saturated points dynamically based on type
        const gain = isByte ? 1 : (255 / 0.3);

        for (let i = 0; i < width * height; i++) {
          const r = redBand[i];
          const g = greenBand[i];
          const b = blueBand[i];

          rgba[i * 4] = Math.max(0, Math.min(255, r * gain));
          rgba[i * 4 + 1] = Math.max(0, Math.min(255, g * gain));
          rgba[i * 4 + 2] = Math.max(0, Math.min(255, b * gain));
          rgba[i * 4 + 3] = 255;
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
    <div className="relative flex items-center justify-center w-full h-full p-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Processing Dynamic World Image...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-xl flex flex-col items-center gap-3 max-w-md text-center bg-card shadow-xl">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
             <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="font-bold text-lg">Failed to Render TIFF</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}
      <div className="bg-muted/10 p-2 rounded-2xl border border-white/5 shadow-inner backdrop-blur-md">
        <canvas
          ref={canvasRef}
          style={{ imageRendering: 'pixelated' }}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-xl border border-white/10"
        />
      </div>
    </div>
  );
};
