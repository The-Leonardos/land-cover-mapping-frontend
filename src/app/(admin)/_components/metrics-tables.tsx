"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDeepLabMetrics } from "../_actions/getDeepLabMetrics";
import { getDeepVarMetrics } from "../_actions/getDeepVarMetrics";
import MetricsInfoDialog from "./metrics-info-dialog";
import { MetricsTablesSkeleton } from "../_skeletons/metrics-tables-skeleton";
import { usePipelineStore } from "../_stores/pipelineStore";
import type { DeepLabMetrics, DeepVarMetrics } from "@/lib/types/metrics";
import { InfoIcon } from "lucide-react";


export function MetricsTables() {
  const [deepLabMetrics, setDeepLabMetrics] = useState<DeepLabMetrics[] | null>(null);
  const [deepVarMetrics, setDeepVarMetrics] = useState<DeepVarMetrics[] | null>(null);

  const modelStatus = usePipelineStore((state) => state.modelStatus);

  // Fetch metrics on mount and whenever modelStatus transitions to "trained"
  useEffect(() => {
    async function fetchMetrics() {
      const [deepLab, deepVar] = await Promise.all([
        getDeepLabMetrics(),
        getDeepVarMetrics(),
      ]);
      setDeepLabMetrics(deepLab);
      setDeepVarMetrics(deepVar);
    }

    fetchMetrics();
  }, [modelStatus]); // re-fetches on every status change (not_started → training → trained)

  if (!deepLabMetrics || !deepVarMetrics) return <MetricsTablesSkeleton />;

  return (
    <Tabs defaultValue="image-prediction" className="w-full text-foreground flex flex-col">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-0 mb-6 gap-4 relative">
        <h2 className="text-xl font-bold tracking-tight md:pb-4">Model Versions</h2>
        
        <TabsList variant="line" className="bg-transparent h-auto p-0 min-w-0" style={{ marginBottom: "-1px" }}>
          <TabsTrigger value="image-prediction" className="pb-4 pt-2 px-4 text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-primary font-semibold transition-all">
            DeepLab V3+
          </TabsTrigger>
          <TabsTrigger value="time-series" className="pb-4 pt-2 px-4 text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-primary font-semibold transition-all">
            DeepVAR
          </TabsTrigger>
        </TabsList>
      </div>

      {/* DeepLab V3+ Table */}
      <TabsContent value="image-prediction" className="mt-0 outline-none">
        <div className="rounded-xl border border-border bg-card shadow-xl shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold leading-none mb-1 text-foreground">Image Prediction Metrics (DeepLab V3+)</h3>
              <p className="text-sm text-muted-foreground">Historical performance metrics for the Image Segmentation model.</p>
            </div>
            <MetricsInfoDialog
              defaultTab="image-prediction"
              trigger={
                <button 
                  className="p-1.5 -mr-1.5 -mt-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 shrink-0" 
                  aria-label="DeepLab V3+ Metrics Information"
                >
                  <InfoIcon size={20}></InfoIcon>
                </button>
              } 
            />
          </div>
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold text-center">Model Name</th>
                  <th className="px-6 py-4 font-semibold text-center">Training Data</th>
                  <th className="px-6 py-4 font-semibold text-center">Training Date</th>
                  <th className="px-6 py-4 font-semibold text-center">Forecast Year</th>
                  <th className="px-6 py-4 font-semibold text-center">IoU</th>
                  <th className="px-6 py-4 font-semibold text-center">Accuracy</th>
                  <th className="px-6 py-4 font-semibold text-center">Precision</th>
                  <th className="px-6 py-4 font-semibold text-center">Recall</th>
                  <th className="px-6 py-4 font-semibold text-center">F1-Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {deepLabMetrics.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-center text-foreground">{row.modelName}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.trainingData}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.trainingDate}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.year}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.iou} {row.iou === '—' ? '' : "%"}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.accuracy} {row.accuracy === '—' ? '' : "%"}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.precision} {row.precision === '—' ? '' : "%"}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.recall} {row.recall === '—' ? '' : "%"}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.f1} {row.f1 === '—' ? '' : "%"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* DeepVar Table */}
      <TabsContent value="time-series" className="mt-0 outline-none">
        <div className="rounded-xl border border-border bg-card shadow-xl shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold leading-none mb-1 text-foreground">Time Series Metrics (DeepVAR)</h3>
              <p className="text-sm text-muted-foreground">Historical performance metrics for the Time Series Forecasting model.</p>
            </div>
            <MetricsInfoDialog
              defaultTab="time-series"
              trigger={
                <button
                  className="p-1.5 -mr-1.5 -mt-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 shrink-0"
                  aria-label="DeepVAR Metrics Information"
                >
                  <InfoIcon />
                </button>
              }
            />
          </div>
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold text-center">Model Name</th>
                  <th className="px-6 py-4 font-semibold text-center">Training Data</th>
                  <th className="px-6 py-4 font-semibold text-center">Training Date</th>
                  <th className="px-6 py-4 font-semibold text-center">Forecast Year</th>
                  <th className="px-6 py-4 font-semibold text-center">MAE</th>
                  <th className="px-6 py-4 font-semibold text-center">RMSE</th>
                  <th className="px-6 py-4 font-semibold text-center">R²</th>
                  <th className="px-6 py-4 font-semibold text-center">CRPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {deepVarMetrics.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-center text-foreground">{row.modelName}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.trainingData}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.trainingDate}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.year}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.mae}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.rmse}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.r2}</td>
                    <td className="px-6 py-4 text-center text-foreground font-medium">{row.crps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

    </Tabs>
  );
}
