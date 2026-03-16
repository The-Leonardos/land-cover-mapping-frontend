// Types related to map visualization and segmentation

export interface SegmentationOverlay {
    barangay: string
    year: number
    pixelSize: number // in meters
    classDistribution: Record<string, number> // percentage per class
    confidenceScores: Record<string, number> // model confidence per class
}