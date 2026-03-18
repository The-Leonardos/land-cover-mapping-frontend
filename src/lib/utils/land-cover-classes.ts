// Land cover classification constants
// Based on Google's Dynamic World V1 (DWV1) dataset

import type { LandCoverClass } from '../types/land-cover-class'

export const LAND_COVER_CLASSES: LandCoverClass[] = [
    { id: "0", label: "Water", color: "#419BDF" },
    { id: "1", label: "Trees", color: "#397D49" },
    { id: "2", label: "Grass", color: "#88B053" },
    { id: "3", label: "Flooded Vegetation", color: "#7A87C6" },
    { id: "4", label: "Crops", color: "#E49635" },
    { id: "5", label: "Shrub & Scrub", color: "#DFC35A" },
    { id: "6", label: "Built-up Area", color: "#C4281B" },
    { id: "7", label: "Bare Ground", color: "#A59B8F" },
    { id: "8", label: "Snow & Ice", color: "#B39FE1" },
]