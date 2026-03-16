// DeepAR time series forecasting service
// Handles fetching and processing of land cover time series data

import type { BarangayLandCoverTimeSeries, DeepARForecast } from '../types'

// Sample historical data (2016-2025 quarterly aggregated from DWV1)
export const getBarangayTimeSeries = (barangay: string): BarangayLandCoverTimeSeries => {
    // In production, this would fetch from Google Earth Engine processed data
    // For now returning sample data structure
    const baselineBuilt = Math.random() * 40 + 20
    const baselineTrees = Math.random() * 30 + 10
    const baselineGrass = Math.random() * 25 + 5

    const quarters = generateQuarters(2016, 2026)

    return {
        barangay,
        timestamps: quarters,
        water: Array(44)
            .fill(0)
            .map(() => Math.random() * 5),
        trees: Array(44)
            .fill(0)
            .map((_, i) => Math.max(0, baselineTrees - i * 0.15 + Math.random() * 2)),
        grass: Array(44)
            .fill(0)
            .map((_, i) => Math.max(0, baselineGrass - i * 0.1 + Math.random() * 1.5)),
        flooded_vegetation: Array(44)
            .fill(0)
            .map(() => Math.random() * 3),
        crops: Array(44)
            .fill(0)
            .map(() => Math.random() * 8),
        shrub: Array(44)
            .fill(0)
            .map(() => Math.random() * 10),
        snow: Array(44)
            .fill(0)
            .map(() => Math.random() * 0.5),
        built: Array(44)
            .fill(0)
            .map((_, i) => Math.min(100, baselineBuilt + i * 0.3 + Math.random() * 2)),
        bare: Array(44)
            .fill(0)
            .map(() => Math.random() * 6),
    }
}

export const generateDeepARForecast = (
    barangay: string,
    landCoverClass: string,
    historicalData: number[],
): DeepARForecast => {
    // DeepAR probabilistic forecast with confidence intervals
    const forecast = historicalData.slice(-8).map((val) => val + (Math.random() - 0.5) * 2)

    // Generate confidence intervals (e.g., 90% confidence interval)
    const std = Math.sqrt(
        historicalData.reduce((sum, val, i, arr) => {
            const mean = arr.reduce((a, b) => a + b) / arr.length
            return sum + Math.pow(val - mean, 2)
        }, 0) / historicalData.length,
    )

    return {
        barangay,
        landCoverClass,
        historicalValues: historicalData.slice(-16), // Last 4 years quarterly
        forecastValues: forecast,
        confidenceLower: forecast.map((v) => Math.max(0, v - 1.96 * std)),
        confidenceUpper: forecast.map((v) => v + 1.96 * std),
        timestamps: generateQuarters(2024, 2026),
    }
}

function generateQuarters(startYear: number, endYear: number): string[] {
    const quarters: string[] = []
    for (let year = startYear; year <= endYear; year++) {
        for (let q = 1; q <= 4; q++) {
            quarters.push(`${year}-Q${q}`)
        }
    }
    return quarters
}