interface ForecastQuickStatsProps {
  selectedBarangay: string | null
  chartData: Array<{ year: number | string; [key: string]: number | string }>
}

export function ForecastQuickStatsDesktop({
  selectedBarangay,
  chartData,
}: ForecastQuickStatsProps) {
  if (!selectedBarangay || chartData.length === 0) return null

  return (
    <div className="hidden sm:flex items-center gap-2 md:gap-4 ml-auto col-span-2">
      <div className="text-center px-3 md:px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Forest Cover
        </p>
        <p className="text-base md:text-lg font-bold text-green-500">
          {Number(chartData[chartData.length - 1]?.trees)?.toFixed(1) || 0}%
        </p>
      </div>
      <div className="text-center px-3 md:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Built-up
        </p>
        <p className="text-base md:text-lg font-bold text-blue-500">
          {Number(chartData[chartData.length - 1]?.built)?.toFixed(1) || 0}%
        </p>
      </div>
    </div>
  )
}

export function ForecastQuickStatsMobile({
  selectedBarangay,
  chartData,
}: ForecastQuickStatsProps) {
  if (!selectedBarangay || chartData.length === 0) return null

  return (
    <div className="flex sm:hidden items-center gap-2 mb-4">
      <div className="flex-1 text-center px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-[10px] text-muted-foreground">Forest</p>
        <p className="text-base font-bold text-green-500">
          {Number(chartData[chartData.length - 1]?.trees)?.toFixed(1) || 0}%
        </p>
      </div>
      <div className="flex-1 text-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-[10px] text-muted-foreground">Built-up</p>
        <p className="text-base font-bold text-blue-500">
          {Number(chartData[chartData.length - 1]?.built)?.toFixed(1) || 0}%
        </p>
      </div>
    </div>
  )
}
