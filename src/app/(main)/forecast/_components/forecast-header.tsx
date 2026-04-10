interface ForecastHeaderProps {
  selectedBarangay: string | null
}

export function ForecastHeader({ selectedBarangay }: ForecastHeaderProps) {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            Land Cover Time Series Analysis
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Historical land cover change tracking from 2016 to 2026
          </p>
        </div>
        {selectedBarangay && (
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm text-muted-foreground">
              Analyzing
            </p>
            <p className="text-base md:text-lg font-semibold text-primary">
              {selectedBarangay}
            </p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 md:px-4 py-2 md:py-3 mt-3 md:mt-4">
        <p className="text-xs md:text-sm text-foreground">
          <span className="font-semibold text-primary">Data Source:</span> Land
          cover observations from 2016-2025. Data aggregated on a yearly basis
          from quarterly observations.
        </p>
      </div>
    </div>
  )
}
