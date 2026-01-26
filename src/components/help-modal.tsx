"use client"

import { X, Layers, TrendingUp, Map, Database, Info, BookOpen, Target, Users } from "lucide-react"

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-3xl max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 border border-primary rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Help & Documentation</h2>
                            <p className="text-xs text-muted-foreground">Baguio City Land Cover Monitoring Agent</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
                    {/* About Section */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">About This System</h3>
                        </div>
                        <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This web-based agent visualizes <strong className="text-foreground">DeepLabV3+-generated land cover maps</strong> and
                                summarizes both historical changes and <strong className="text-foreground">DeepAR-forecasted future land cover values</strong> for
                                each of the 129 barangays in Baguio City, Benguet. The system combines time-series forecasting
                                with CNN-based image prediction to provide a comprehensive view of land cover dynamics.
                            </p>
                        </div>
                    </section>

                    {/* Objectives */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Research Objectives</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-3 border border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-primary font-semibold">1.</span> Collect and prepare barangay-level land cover dataset for DeepAR and satellite imagery for DeepLabV3+
                                </p>
                            </div>
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-3 border border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-primary font-semibold">2.</span> Analyze patterns and trends of land cover change in each barangay of Baguio City
                                </p>
                            </div>
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-3 border border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-primary font-semibold">3.</span> Develop and evaluate a DeepAR time series forecasting model for predicting future land cover changes
                                </p>
                            </div>
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-3 border border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-primary font-semibold">4.</span> Develop and evaluate a DeepLabV3+ image prediction model for generating land cover maps
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Key Features</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Map className="h-4 w-4 text-blue-500" />
                                    <h4 className="text-sm font-semibold text-foreground">Segmentation Map</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Interactive map showing DeepLabV3+ predicted land cover segmentation with satellite imagery overlay.
                                    Supports multiple layers including satellite imagery, predicted land cover map, and barangay boundaries.
                                </p>
                            </div>
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <h4 className="text-sm font-semibold text-foreground">DeepAR Forecast</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Time series forecasting using DeepAR model that predicts future land cover percentages for each
                                    barangay. View trends, compare years, and analyze patterns across all 9 land cover classes.
                                </p>
                            </div>
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="h-4 w-4 text-yellow-500" />
                                    <h4 className="text-sm font-semibold text-foreground">Historical Data</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Access historical land cover data from 2016-2025 sourced from Google's Dynamic World V1 image
                                    collection with quarterly temporal resolution for detailed trend analysis.
                                </p>
                            </div>
                            <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="h-4 w-4 text-cyan-500" />
                                    <h4 className="text-sm font-semibold text-foreground">Year Comparison</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Compare land cover changes between any two years with visual comparison bars and detailed
                                    change statistics showing growth or decline in each land cover class.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Land Cover Classes */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Land Cover Classes</h3>
                        </div>
                        <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                            <p className="text-sm text-muted-foreground mb-3">
                                The system classifies land cover into 9 distinct categories based on Google's Dynamic World V1:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { name: "Water", color: "#419BDF" },
                                    { name: "Trees/Forest", color: "#397D49" },
                                    { name: "Grass", color: "#88B053" },
                                    { name: "Flooded Vegetation", color: "#7A87C6" },
                                    { name: "Crops", color: "#E49635" },
                                    { name: "Shrub & Scrub", color: "#DFC35A" },
                                    { name: "Built-up", color: "#C4281B" },
                                    { name: "Bare Ground", color: "#A59B8F" },
                                    { name: "Snow & Ice", color: "#B39FE1" },
                                ].map((cls) => (
                                    <div key={cls.name} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                                        <span className="text-muted-foreground">{cls.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Stakeholders */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Target Stakeholders</h3>
                        </div>
                        <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This system serves several key stakeholders including the <strong className="text-foreground">Baguio City Planning and Development Office</strong>,
                                <strong className="text-foreground"> DENR-CAR</strong>, barangay councils, land-use regulation bodies, environmental organizations, NGOs,
                                and academic institutions. The system supports <strong className="text-foreground">SDG 11</strong> (Sustainable Cities and Communities) and
                                <strong className="text-foreground"> SDG 15</strong> (Life on Land) by facilitating planned urban development and identifying areas at risk of ecosystem degradation.
                            </p>
                        </div>
                    </section>

                    {/* Data Sources */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Data Sources</h3>
                        </div>
                        <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50 space-y-2">
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Satellite Imagery:</strong> Google's Dynamic World V1 (DWV1) from Google Earth Engine,
                                generated from Sentinel-2 Level-1C satellite imagery with daily updates.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Political Boundaries:</strong> DENR-Cordillera Administrative Region cadastral maps
                                covering all 129 barangays of Baguio City.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Temporal Coverage:</strong> Historical data from 2016-2025 with quarterly aggregation;
                                2026 data represents DeepAR forecasted values.
                            </p>
                        </div>
                    </section>

                    {/* Credits */}
                    <section className="space-y-3">
                        <h3 className="text-base font-semibold text-foreground">Research Team</h3>
                        <div className="bg-muted/30 dark:bg-black/30 rounded-lg p-4 border border-border/50">
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong className="text-foreground">Saint Louis University</strong> - Computer Science and Computer Applications Department
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Balogo, R.J.V. | Briones, N.A.Q. | Coloma, S.M. | Guzman, S.E.M. | Leung, L.T. | Nonato, M.G.M. | Ragudos, H.T. | Ramos, J.K.R.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Adviser: Dr. Beverly Estephany Ferrer | December 2025
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
