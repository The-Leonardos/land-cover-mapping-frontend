"use client"

import { useState } from "react"

import { X, TrendingUp, TrendingDown } from "lucide-react"
import type { LandCoverClass } from "@/lib/barangay-data"
import type { BarangayLandCoverTimeSeries } from "@/lib/deepar-data"

interface BarangayDetailPanelProps {
    barangay: string
    year: number
    compareYear: number | null
    comparisonMode: boolean
    onComparisonModeChange: (enabled: boolean) => void
    onCompareYearChange: (year: number | null) => void
    onYearChange: (year: number) => void
    timeSeries: BarangayLandCoverTimeSeries
    landCoverClasses: LandCoverClass[]
    onClose: () => void
}

export function BarangayDetailPanel({
                                        barangay,
                                        year,
                                        compareYear,
                                        comparisonMode,
                                        onComparisonModeChange,
                                        onCompareYearChange,
                                        onYearChange,
                                        timeSeries,
                                        landCoverClasses,
                                        onClose,
                                    }: BarangayDetailPanelProps) {
    // Get current year's data
    const yearQuarters = timeSeries.timestamps.filter((t) => t.startsWith(`${year}-`))
    const startIdx = timeSeries.timestamps.indexOf(yearQuarters[0] || "")

    const getYearData = (targetYear: number) => {
        const quarters = timeSeries.timestamps.filter((t) => t.startsWith(`${targetYear}-`))
        const idx = timeSeries.timestamps.indexOf(quarters[0] || "")
        return {
            built: timeSeries.built[idx] || 0,
            trees: timeSeries.trees[idx] || 0,
            grass: timeSeries.grass[idx] || 0,
            water: timeSeries.water[idx] || 0,
        }
    }

    const currentData = getYearData(year)
    const compareData = compareYear ? getYearData(compareYear) : null

    // Top 4 classes with colors
    const top4Classes = [
        { key: "built", label: "Built-up", value: currentData.built, color: "#3b82f6" },
        { key: "trees", label: "Forest", value: currentData.trees, color: "#22c55e" },
        { key: "grass", label: "Grass", value: currentData.grass, color: "#eab308" },
        { key: "water", label: "Water", value: currentData.water, color: "#06b6d4" },
    ]

    // Quarterly breakdown data
    const quarterlyData = yearQuarters.map((timestamp) => {
        const idx = timeSeries.timestamps.indexOf(timestamp)
        const q = timestamp.split("-")[1]
        return {
            quarter: q,
            trees: timeSeries.trees[idx],
            built: timeSeries.built[idx],
            grass: timeSeries.grass[idx],
            water: timeSeries.water[idx],
        }
    })

    // Comparison data with all classes
    const comparisonClasses = [
        { id: "built", label: "Built-up", color: "#3b82f6", current: currentData.built, compare: compareData?.built || 0 },
        { id: "trees", label: "Forest", color: "#22c55e", current: currentData.trees, compare: compareData?.trees || 0 },
        { id: "grass", label: "Grass", color: "#eab308", current: currentData.grass, compare: compareData?.grass || 0 },
        { id: "water", label: "Water", color: "#06b6d4", current: currentData.water, compare: compareData?.water || 0 },
    ]

    // Find biggest forest change for summary
    const forestChange = currentData.trees - (compareData?.trees || 0)

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-card">
            {/* Header */}
            <div className="p-3 md:p-4 flex items-start justify-between border-b border-border">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground">{barangay}</h2>
                    <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Detailed Historical Analysis ({year})
                    </p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
                    <X className="h-4 w-4 md:h-5 md:w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {comparisonMode ? (
                    /* Comparison View */
                    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                        <button
                            onClick={() => onComparisonModeChange(false)}
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-primary text-primary-foreground rounded-lg text-xs md:text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Exit Compare
                        </button>

                        <div className="space-y-2">
                            <p className="text-xs md:text-sm text-muted-foreground">Select two years to compare:</p>
                            <div className="flex items-center gap-2">
                                <select
                                    value={year}
                                    onChange={(e) => onYearChange(Number(e.target.value))}
                                    className="flex-1 px-2 md:px-3 py-1.5 md:py-2 bg-card border border-border rounded-lg text-xs md:text-sm text-foreground"
                                >
                                    {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <span className="text-xs md:text-sm text-muted-foreground px-1 md:px-2">vs</span>
                                <select
                                    value={compareYear || 2016}
                                    onChange={(e) => onCompareYearChange(Number(e.target.value))}
                                    className="flex-1 px-2 md:px-3 py-1.5 md:py-2 bg-card border border-border rounded-lg text-xs md:text-sm text-foreground"
                                >
                                    {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].filter(y => y !== year).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Comparing <span className="text-primary font-semibold">{year}</span> vs <span className="text-primary font-semibold">{compareYear}</span>
                            </p>
                        </div>

                        {/* Comparison Table */}
                        <div className="space-y-1">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 gap-1 md:gap-2 py-2 border-b border-border text-[10px] md:text-sm font-semibold">
                                <div className="text-muted-foreground">CLASS</div>
                                <div className="text-center text-foreground">{year}</div>
                                <div className="text-center text-muted-foreground">{compareYear}</div>
                                <div className="text-center text-foreground">CHG</div>
                            </div>

                            {/* Table Rows */}
                            {comparisonClasses.map(cls => {
                                const change = cls.current - cls.compare
                                const isPositive = change >= 0
                                return (
                                    <div key={cls.id} className="grid grid-cols-4 gap-1 md:gap-2 py-2 md:py-3 border-b border-border/30 items-center">
                                        <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm">
                                            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                                            <span className="text-foreground truncate">{cls.label}</span>
                                        </div>
                                        <div className="text-center text-foreground font-semibold text-[10px] md:text-sm">{cls.current.toFixed(1)}%</div>
                                        <div className="text-center text-muted-foreground text-[10px] md:text-sm">{cls.compare.toFixed(1)}%</div>
                                        <div className={`text-center flex items-center justify-center gap-0.5 md:gap-1 text-[10px] md:text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                                            {isPositive ? <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" /> : <TrendingDown className="h-2.5 w-2.5 md:h-3 md:w-3" />}
                                            {isPositive ? "+" : ""}{change.toFixed(1)}%
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Visual Comparison */}
                        <div className="space-y-2 md:space-y-3 pt-3 md:pt-4">
                            <h4 className="text-xs md:text-sm font-semibold text-muted-foreground uppercase">Visual Comparison</h4>
                            {comparisonClasses.slice(0, 2).map(cls => (
                                <div key={cls.id} className="space-y-1">
                                    <div className="flex justify-between text-[10px] md:text-sm">
                                        <span className="text-foreground">{cls.label}</span>
                                        <span className="text-muted-foreground">
                      {year}: {cls.current.toFixed(1)}% | {compareYear}: {cls.compare.toFixed(1)}%
                    </span>
                                    </div>
                                    <div className="relative h-2 md:h-3 bg-muted/30 dark:bg-black/30 rounded-full overflow-hidden">
                                        {/* Compare Year Bar (lighter, background) */}
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full opacity-40"
                                            style={{ width: `${cls.compare}%`, backgroundColor: cls.color }}
                                        />
                                        {/* Current Year Bar (solid, foreground) */}
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full"
                                            style={{ width: `${cls.current}%`, backgroundColor: cls.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-muted/30 dark:bg-black/30 p-2 md:p-3 rounded-lg border border-border/50 text-[10px] md:text-sm">
                            <p className="text-muted-foreground">
                                Between <span className="text-primary font-semibold">{compareYear}</span> and <span className="text-primary font-semibold">{year}</span>:{" "}
                                <span className={forestChange >= 0 ? "text-green-500" : "text-red-500"}>
                  Forest {forestChange >= 0 ? "increased" : "decreased"} by {Math.abs(forestChange).toFixed(1)}%
                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Default View - Historical Data with Full Quarterly Breakdown */
                    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                        {/* Section Header */}
                        <div className="bg-primary/20 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-primary/30">
                            <h3 className="text-xs md:text-sm font-semibold uppercase">Historical Data</h3>
                        </div>

                        <p className="text-[10px] md:text-xs text-muted-foreground">
                            Historical data for the Year ({year}) of the Barangay ({barangay})
                        </p>

                        {/* 4 Stats Grid with colored accents */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {top4Classes.map(({ key, label, value, color }) => (
                                <div
                                    key={key}
                                    className="bg-muted/30 dark:bg-black/30 rounded-lg p-2.5 md:p-4 border border-border/50 hover:border-border transition-all"
                                    style={{ borderLeftColor: color, borderLeftWidth: "4px" }}
                                >
                                    <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2">
                                        <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                        {label}
                                    </p>
                                    <p className="text-xl md:text-3xl font-bold text-foreground">{value.toFixed(1)}%</p>
                                </div>
                            ))}
                        </div>

                        {/* Quarterly Breakdown Section Header */}
                        <div className="bg-primary/20 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-primary/30 mt-3 md:mt-4">
                            <h3 className="text-xs md:text-sm font-semibold uppercase">Quarterly Breakdown - {year}</h3>
                        </div>

                        {/* Q1-Q4 Full Grid */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {quarterlyData.length > 0 ? quarterlyData.map((q, i) => (
                                <div key={i} className="bg-muted/30 dark:bg-black/40 rounded-lg p-2 md:p-3 border border-border/40 space-y-1.5 md:space-y-2">
                                    <p className="text-[10px] md:text-xs font-bold text-primary">{year}-Q{q.quarter}</p>
                                    <div className="space-y-0.5 md:space-y-1 text-[10px] md:text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Forest</span>
                                            <span className="text-green-500 font-medium">{q.trees.toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Built-up</span>
                                            <span className="text-blue-500 font-medium">{q.built.toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Grass</span>
                                            <span className="text-yellow-500 font-medium">{q.grass.toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Water</span>
                                            <span className="text-cyan-500 font-medium">{q.water.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <>
                                    {[1, 2, 3, 4].map(q => (
                                        <div key={q} className="bg-muted/30 dark:bg-black/40 rounded-lg p-2 md:p-3 border border-border/40">
                                            <p className="text-[10px] md:text-xs font-bold text-primary">{year}-Q{q}</p>
                                            <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 md:mt-2">Data loading...</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Land Cover Trends */}
                        <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                            <h4 className="text-xs md:text-sm font-semibold text-foreground">Land Cover Trends 2016-{year}</h4>
                            <div className="space-y-1.5 md:space-y-2">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] md:text-sm">
                                        <span className="text-muted-foreground">Forest</span>
                                        <span className="text-green-500 font-medium">{currentData.trees.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 md:h-2 bg-muted/50 dark:bg-black/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${currentData.trees}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] md:text-sm">
                                        <span className="text-muted-foreground">Built-up</span>
                                        <span className="text-blue-500 font-medium">{currentData.built.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 md:h-2 bg-muted/50 dark:bg-black/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${currentData.built}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compare Years Button */}
                        <button
                            onClick={() => {
                                onComparisonModeChange(true)
                                onCompareYearChange(year === 2021 ? 2016 : 2021)
                            }}
                            className="w-full py-2 md:py-3 bg-foreground text-background rounded-lg text-xs md:text-sm font-semibold hover:bg-foreground/90 transition-colors"
                        >
                            Compare Years
                        </button>

                        {/* Footer Note */}
                        <p className="text-[10px] md:text-xs text-muted-foreground pt-1 md:pt-2">
                            Click any barangay cell on the map to update this analysis. Data based on Sentinel-2 observations and DeepLabV3+ predictions
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
