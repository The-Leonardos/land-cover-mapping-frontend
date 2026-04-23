import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface ForecastHeaderProps {
  selectedBarangay: string | null
  hasForecastData: boolean
  yearRange: [number, number] | null
}

export function ForecastHeader({
  selectedBarangay,
  hasForecastData,
  yearRange,
}: ForecastHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight">
            {selectedBarangay ?? "Select a Barangay"}
          </h2>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">
          Land Cover Time Series
          {hasForecastData ? " & Forecast" : " Analysis"}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {yearRange && (
          <Badge variant="secondary" className="text-xs md:text-sm tabular-nums bg-primary">
            {yearRange[0]} to {yearRange[1]}
          </Badge>
        )}
        {hasForecastData && (
          <Badge variant="outline" className="text-xs md:text-sm">
            Forecast Available
          </Badge>
        )}
      </div>
    </div>
  )
}
