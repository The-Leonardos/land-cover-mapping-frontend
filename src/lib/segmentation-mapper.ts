// DeepLabV3+ CNN segmentation visualization
// Maps land cover class predictions to visual representations
import { LAND_COVER_CLASSES } from "./barangay-data"

export interface SegmentationOverlay {
    barangay: string
    year: number
    pixelSize: number // in meters
    classDistribution: Record<string, number> // percentage per class
    confidenceScores: Record<string, number> // model confidence per class
}

export const generateSegmentationOverlay = (barangay: string, year: number): SegmentationOverlay => {
    // In production: preprocessed Sentinel-2 imagery → DeepLabV3+ model → pixel-wise predictions
    // Returns simulated segmentation data

    const distribution: Record<string, number> = {}
    const confidenceScores: Record<string, number> = {}

    let remaining = 100
    LAND_COVER_CLASSES.forEach((lc, idx) => {
        const value = Math.random() * remaining
        distribution[lc.id] = Number.parseFloat(value.toFixed(2))
        confidenceScores[lc.id] = 0.7 + Math.random() * 0.25
        remaining -= value
    })

    // Normalize to 100%
    const total = Object.values(distribution).reduce((a, b) => a + b, 0)
    Object.keys(distribution).forEach((key) => {
        distribution[key] = Number.parseFloat(((distribution[key] / total) * 100).toFixed(2))
    })

    return {
        barangay,
        year,
        pixelSize: 10, // Sentinel-2 resolution in meters
        classDistribution: distribution,
        confidenceScores,
    }
}

export const getSegmentationColor = (classId: string, confidence: number): string => {
    const classColor = LAND_COVER_CLASSES.find((c) => c.id === classId)?.color || "#000000"
    // Apply confidence to opacity for visual feedback
    return classColor
}
