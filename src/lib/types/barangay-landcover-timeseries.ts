export interface BarangayLandCoverTimeSeries {
  barangay_name: string
  year: number
  data: LandCoverQuarterData[] // 4 quarters per year
}

export interface LandCoverQuarterData {
  quarter: number
  water: number
  trees: number
  grass: number
  crops: number
  bare_ground: number
  built_up_area: number
  shrub_and_scrub: number
}