export interface LandCoverClass {
    id: string
    label: string
    color: string
}

export const LAND_COVER_CLASSES: LandCoverClass[] = [
  { id: "water", label: "Water", color: "#419bdf" },
  { id: "trees", label: "Trees", color: "#397d49" },
  { id: "grass", label: "Grass", color: "#88b053" },
  { id: "crops", label: "Crops", color: "#e49635" },
  { id: "shrub", label: "Shrub & Scrub", color: "#dfc35a" },
  { id: "built", label: "Built-up Area", color: "#c4281b" },
  { id: "bare", label: "Bare Ground", color: "#a59b8f" },
];
