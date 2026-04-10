"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface TableRow {
  id: string
  label: string
  color: string
  start: number
  latest: number
  trend: number
  change: number
}

interface ForecastTableProps {
  tableData: TableRow[]
}

export function ForecastTable({ tableData }: ForecastTableProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Class
            </th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">
              Start
            </th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">
              Latest
            </th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">
              Trend
            </th>
            <th className="text-center py-3 px-4 font-semibold text-foreground">
              Range
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id} className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                {row.label}
              </td>
              <td className="py-3 px-4 text-center text-foreground">
                {row.start.toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-center text-foreground">
                {row.latest.toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-center text-foreground">
                {row.trend.toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-center">
                <span
                  className={`flex items-center justify-center gap-1 ${
                    row.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {row.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(row.change).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
