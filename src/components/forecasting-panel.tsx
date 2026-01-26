"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { LandCoverClass } from "@/lib/barangay-data"
import { getBarangayTimeSeries } from "@/lib/deepar-data"

interface ForecastingPanelProps {
    selectedBarangay: string | null
    onBarangaySelect: (barangay: string) => void
    barangays: readonly string[]
    landCoverClasses: LandCoverClass[]
}

const LAND_COVER_OPTIONS = [
    { id: "water", label: "Water", color: "#06b6d4" },
    { id: "trees", label: "Trees", color: "#22c55e" },
    { id: "grass", label: "Grass", color: "#eab308" },
    { id: "flooded", label: "Flooded Vegetation", color: "#8b5cf6" },
    { id: "crops", label: "Crops", color: "#f97316" },
    { id: "shrub", label: "Shrub/Scrub", color: "#84cc16" },
    { id: "built", label: "Built-up", color: "#3b82f6" },
    { id: "bare", label: "Bare Ground", color: "#a16207" },
    { id: "snow", label: "Snow/Ice", color: "#e0e7ff" },
]

export function ForecastingPanel({
                                     selectedBarangay,
                                     onBarangaySelect,
                                     barangays,
                                     landCoverClasses,
                                 }: ForecastingPanelProps) {
    const [startYear, setStartYear] = useState(2016)
    const [endYear, setEndYear] = useState(2026)
    const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set(["trees", "built", "grass", "water"]))
    const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

    const toggleClass = (classId: string) => {
        const newSet = new Set(selectedClasses)
        if (newSet.has(classId)) {
            newSet.delete(classId)
        } else {
            newSet.add(classId)
        }
        setSelectedClasses(newSet)
    }

    const selectAll = () => {
        if (selectedClasses.size === LAND_COVER_OPTIONS.length) {
            setSelectedClasses(new Set())
        } else {
            setSelectedClasses(new Set(LAND_COVER_OPTIONS.map(c => c.id)))
        }
    }

    // Generate chart data
    const generateChartData = () => {
        if (!selectedBarangay) return []

        const timeSeries = getBarangayTimeSeries(selectedBarangay)
        const data: Array<{ year: number; [key: string]: number }> = []

        for (let year = startYear; year <= endYear; year++) {
            const yearQuarters = timeSeries.timestamps.filter(t => t.startsWith(`${year}-`))
            if (yearQuarters.length > 0) {
                const idx = timeSeries.timestamps.indexOf(yearQuarters[0])
                data.push({
                    year,
                    trees: timeSeries.trees[idx] || 0,
                    built: timeSeries.built[idx] || 0,
                    grass: timeSeries.grass[idx] || 0,
                    water: timeSeries.water[idx] || 0,
                })
            }
        }

        return data
    }

    const chartData = generateChartData()

    // Generate table data
    const generateTableData = () => {
        if (!selectedBarangay || chartData.length === 0) return []

        const latest = chartData[chartData.length - 1]
        const previous = chartData[chartData.length - 2] || latest

        return LAND_COVER_OPTIONS.filter(c => selectedClasses.has(c.id)).map(cls => {
            const latestVal = (latest as any)[cls.id] || 0
            const prevVal = (previous as any)[cls.id] || 0
            const trend = latestVal - prevVal
            return {
                ...cls,
                latest: latestVal,
                trend: trend,
                change: trend,
            }
        })
    }

    const tableData = generateTableData()

    return (
        <div className="flex flex-col h-full bg-background p-3 md:p-6 overflow-auto">
            {/* Header Context */}
            <div className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-foreground">DeepAR Time Series Forecast</h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Probabilistic forecasting using Amazon DeepAR for land cover change prediction
                        </p>
                    </div>
                    {selectedBarangay && (
                        <div className="text-left sm:text-right">
                            <p className="text-xs md:text-sm text-muted-foreground">Analyzing</p>
                            <p className="text-base md:text-lg font-semibold text-primary">{selectedBarangay}</p>
                        </div>
                    )}
                </div>

                {/* Info Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 md:px-4 py-2 md:py-3 mt-3 md:mt-4">
                    <p className="text-xs md:text-sm text-foreground">
                        <span className="font-semibold text-primary">2026 Forecast:</span> Predictions generated from historical data (2016-2025) using DeepAR probabilistic time series model trained on Dynamic World V1 land cover observations.
                    </p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 sm:flex sm:items-end gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <label className="text-xs text-muted-foreground font-medium">Barangay</label>
                    <select
                        value={selectedBarangay || ""}
                        onChange={(e) => onBarangaySelect(e.target.value)}
                        className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm font-medium text-foreground w-full sm:min-w-[160px]"
                    >
                        <option value="">Select Barangay</option>
                        {barangays.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">Start Year</label>
                    <select
                        value={startYear}
                        onChange={(e) => setStartYear(Number(e.target.value))}
                        className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm text-foreground"
                    >
                        {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">End Year</label>
                    <select
                        value={endYear}
                        onChange={(e) => setEndYear(Number(e.target.value))}
                        className="px-3 md:px-4 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm text-foreground"
                    >
                        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}{y === 2026 ? " (Forecast)" : ""}</option>
                        ))}
                    </select>
                </div>

                {/* Quick Stats - Hidden on small mobile */}
                {selectedBarangay && chartData.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2 md:gap-4 ml-auto col-span-2">
                        <div className="text-center px-3 md:px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-[10px] md:text-xs text-muted-foreground">Forest Cover</p>
                            <p className="text-base md:text-lg font-bold text-green-500">{chartData[chartData.length - 1]?.trees?.toFixed(1) || 0}%</p>
                        </div>
                        <div className="text-center px-3 md:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-[10px] md:text-xs text-muted-foreground">Built-up</p>
                            <p className="text-base md:text-lg font-bold text-blue-500">{chartData[chartData.length - 1]?.built?.toFixed(1) || 0}%</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Quick Stats */}
            {selectedBarangay && chartData.length > 0 && (
                <div className="flex sm:hidden items-center gap-2 mb-4">
                    <div className="flex-1 text-center px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-[10px] text-muted-foreground">Forest</p>
                        <p className="text-base font-bold text-green-500">{chartData[chartData.length - 1]?.trees?.toFixed(1) || 0}%</p>
                    </div>
                    <div className="flex-1 text-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-[10px] text-muted-foreground">Built-up</p>
                        <p className="text-base font-bold text-blue-500">{chartData[chartData.length - 1]?.built?.toFixed(1) || 0}%</p>
                    </div>
                </div>
            )}

            {/* Classes Selection */}
            <div className="mb-4 md:mb-6">
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                    <span className="text-xs md:text-sm font-medium text-foreground">Classes</span>
                    <label className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedClasses.size === LAND_COVER_OPTIONS.length}
                            onChange={selectAll}
                            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-border accent-primary"
                        />
                        Select All
                    </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2">
                    {LAND_COVER_OPTIONS.map(cls => (
                        <label
                            key={cls.id}
                            className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border cursor-pointer transition-colors ${
                                selectedClasses.has(cls.id)
                                    ? "bg-muted/50 dark:bg-black/30 border-border"
                                    : "bg-muted/20 dark:bg-black/10 border-transparent"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedClasses.has(cls.id)}
                                onChange={() => toggleClass(cls.id)}
                                className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-border accent-primary"
                            />
                            <span
                                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: cls.color }}
                            />
                            <span className="text-xs md:text-sm text-foreground truncate">{cls.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-4">
                <button
                    onClick={() => setViewMode("chart")}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
                        viewMode === "chart"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 dark:bg-black/30 text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Chart View
                </button>
                <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${
                        viewMode === "table"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 dark:bg-black/30 text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Table View
                </button>
            </div>

            {/* Chart or Table */}
            <div className="flex-1 border-2 border-primary/30 rounded-lg bg-muted/20 dark:bg-black/20 p-2 md:p-4 min-h-[300px] md:min-h-[400px]">
                {viewMode === "chart" ? (
                    <div className="h-full flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
                            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Land Cover Trends</span>
                                <span>{startYear} - {endYear}</span>
                            </div>
                            {selectedBarangay && (
                                <div className="text-[10px] md:text-xs text-muted-foreground bg-muted/50 dark:bg-black/30 px-2 md:px-3 py-1 rounded-full">
                                    Data points: {chartData.length} years | Resolution: Annual average
                                </div>
                            )}
                        </div>
                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="year" stroke="currentColor" className="text-muted-foreground" />
                                <YAxis stroke="currentColor" className="text-muted-foreground" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        color: "hsl(var(--foreground))",
                                    }}
                                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                                />
                                <Legend />
                                {selectedClasses.has("trees") && (
                                    <Line type="monotone" dataKey="trees" stroke="#22c55e" strokeWidth={2} name="Trees" dot={false} />
                                )}
                                {selectedClasses.has("built") && (
                                    <Line type="monotone" dataKey="built" stroke="#3b82f6" strokeWidth={2} name="Built-up" dot={false} />
                                )}
                                {selectedClasses.has("grass") && (
                                    <Line type="monotone" dataKey="grass" stroke="#eab308" strokeWidth={2} name="Grass" dot={false} />
                                )}
                                {selectedClasses.has("water") && (
                                    <Line type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={2} name="Water" dot={false} />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold text-foreground">Class</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">Latest</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">Trend</th>
                                <th className="text-center py-3 px-4 font-semibold text-foreground">Range</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map(row => (
                                <tr key={row.id} className="border-b border-border/50">
                                    <td className="py-3 px-4 text-foreground flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                                        {row.label}
                                    </td>
                                    <td className="py-3 px-4 text-center text-foreground">{row.latest.toFixed(1)}%</td>
                                    <td className="py-3 px-4 text-center text-foreground">{row.trend.toFixed(1)}%</td>
                                    <td className="py-3 px-4 text-center">
                      <span className={`flex items-center justify-center gap-1 ${row.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {row.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {Math.abs(row.change).toFixed(1)}%
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
