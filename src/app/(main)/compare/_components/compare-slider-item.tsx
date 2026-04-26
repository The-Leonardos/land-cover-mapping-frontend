import { DynamicWorldImageRenderer } from "../../map/_components/dynamic-world-image-renderer";
import { CompareVectorLayer } from "./compare-vector-layer";

/**
 * A single item rendered inside the ReactCompareSlider.
 * Contains the LULC canvas + vector overlay, both scaled together.
 * Uses translate + scale for precise centering on barangay click.
 */
export function CompareSliderItem({
  url,
  scale,
  translate,
  selectedBarangay,
  hoveredBarangay,
  onBarangaySelect,
  onBarangayHover,
  onZoomToBarangay,
}: {
  url: string;
  scale: number;
  translate: { x: number; y: number };
  selectedBarangay: string | null;
  hoveredBarangay: string | null;
  onBarangaySelect: (name: string) => void;
  onBarangayHover: (name: string | null) => void;
  onZoomToBarangay: (target: { x: number; y: number }) => void;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* LULC Canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <DynamicWorldImageRenderer url={url} />
        </div>
        {/* Vector overlay — inside each item so it doesn't block the slider handle */}
        <div className="absolute inset-0">
          <CompareVectorLayer
            selectedBarangay={selectedBarangay}
            hoveredBarangay={hoveredBarangay}
            onBarangaySelect={onBarangaySelect}
            onBarangayHover={onBarangayHover}
            onZoomToBarangay={onZoomToBarangay}
          />
        </div>
      </div>
    </div>
  );
}