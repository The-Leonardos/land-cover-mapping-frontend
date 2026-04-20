"use client";

import React, { useEffect, useRef, useState } from "react";
import { fromUrl } from "geotiff";

interface DynamicWorldImageRendererProps {
  url: string;
}

export const DynamicWorldImageRenderer: React.FC<DynamicWorldImageRendererProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderTiff() {
      try {
        // fromUrl is often better for tiled GeoTIFFs
        const tiff = await fromUrl(url);
        const image = await tiff.getImage();

        const width = image.getWidth();
        const height = image.getHeight();
        // console.log("Image dimensions:", width, "x", height);

        // Dynamic world images might use different bands, but we will preserve 
        // the RGB rendering logic from the original tiff renderer.
        const samples = [0, 1, 2];
        const rasters = await image.readRasters({
          samples: samples,
          interleave: false,
        });

        if (isCancelled) return;

        const [redBand, greenBand, blueBand] = rasters as any;
        // console.log("First pixel (R,G,B):", redBand[0], greenBand[0], blueBand[0]);

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
        // console.log("Render complete");
      } catch (err) {
        console.error("Error rendering TIFF:", err);
      }
    }

    renderTiff();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'pixelated' }}
        className="max-w-full max-h-full object-contain pointer-events-auto"
      />
    </div>
  );
};
