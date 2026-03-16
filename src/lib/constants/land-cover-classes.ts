// Land cover classification constants
// Based on Google's Dynamic World V1 (DWV1) dataset

import type { LandCoverClass } from '../types'

export const LAND_COVER_CLASSES: LandCoverClass[] = [
    { id: "water", label: "Water", color: "#419BDF" },
    { id: "trees", label: "Trees", color: "#397D49" },
    { id: "grass", label: "Grass", color: "#88B053" },
    { id: "flooded", label: "Flooded Vegetation", color: "#7A87C6" },
    { id: "crops", label: "Crops", color: "#E49635" },
    { id: "shrub", label: "Shrub & Scrub", color: "#DFC35A" },
    { id: "built", label: "Built-up Area", color: "#C4281B" },
    { id: "bare", label: "Bare Ground", color: "#A59B8F" },
    { id: "snow", label: "Snow & Ice", color: "#B39FE1" },
]