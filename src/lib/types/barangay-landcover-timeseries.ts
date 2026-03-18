export interface BarangayLandCoverTimeSeries {
  barangay: string
  year: number
  data: LandCoverQuarterData[] // 4 quarters per year
}

export interface LandCoverQuarterData {
  quarter: number
  water: number
  trees: number
  grass: number
  floodedVegetation: number
  crops: number
  shrub: number
  snow: number
  built: number
  bare: number
}