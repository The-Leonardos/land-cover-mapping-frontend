// Re-export services from the new structure for backward compatibility
// TODO: Update all imports to use the new paths directly

export { getBarangayTimeSeries, generateDeepARForecast } from './services/deepar-service'
export type { BarangayLandCoverTimeSeries, DeepARForecast } from './types'
