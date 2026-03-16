export interface BarangayLandCoverTimeSeries {
    barangay: string
    timestamps: string[] // YYYY-Q format: "2016-Q1", "2016-Q2", etc.
    water: number[]
    trees: number[]
    grass: number[]
    flooded_vegetation: number[]
    crops: number[]
    shrub: number[]
    snow: number[]
    built: number[]
    bare: number[]
}

export interface DeepARForecast {
    barangay: string
    landCoverClass: string
    historicalValues: number[]
    forecastValues: number[]
    confidenceLower: number[]
    confidenceUpper: number[]
    timestamps: string[]
}