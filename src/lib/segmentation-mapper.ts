// Re-export utilities from the new structure for backward compatibility
// TODO: Update all imports to use the new paths directly

export { generateSegmentationOverlay, getSegmentationColor } from './utils/segmentation-mapper'
export type { SegmentationOverlay } from './types'
