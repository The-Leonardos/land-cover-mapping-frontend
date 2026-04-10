import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDeepLabMetrics } from "../_actions/getDeepLabMetrics";
import { getDeepVarMetrics } from "../_actions/getDeepVarMetrics";

export async function MetricsTables() {
  const deepLabMetrics = await getDeepLabMetrics();
  const deepVarMetrics = await getDeepVarMetrics();

  return (
    <Tabs defaultValue="image-prediction" className="w-full text-zinc-100 flex flex-col">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-0 mb-6 gap-4 relative">
        <h2 className="text-xl font-bold tracking-tight md:pb-3">Model Versions</h2>
        
        <TabsList variant="line" className="bg-transparent h-auto p-0 min-w-0" style={{ marginBottom: "-1px" }}>
          <TabsTrigger value="image-prediction" className="pb-3 pt-2 px-2 text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-zinc-100 font-medium">
            DeepLab V3+
          </TabsTrigger>
          <TabsTrigger value="time-series" className="pb-3 pt-2 px-2 text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-zinc-100 font-medium">
            DeepVar
          </TabsTrigger>
        </TabsList>
      </div>

      {/* DeepLab V3+ Table */}
      <TabsContent value="image-prediction" className="mt-0 outline-none">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-semibold leading-none mb-1">Image Prediction Metrics (DeepLab V3+)</h3>
            <p className="text-sm text-zinc-400">Historical performance metrics for the Image Segmentation model.</p>
          </div>
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">Model Name</th>
                  <th className="px-6 py-3 font-medium">Version/Date</th>
                  <th className="px-6 py-3 font-medium">Forecast Year</th>
                  <th className="px-6 py-3 font-medium">mIoU</th>
                  <th className="px-6 py-3 font-medium">Accuracy</th>
                  <th className="px-6 py-3 font-medium">Precision</th>
                  <th className="px-6 py-3 font-medium">Recall</th>
                  <th className="px-6 py-3 font-medium">F1-Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {deepLabMetrics.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.modelName}</td>
                    <td className="px-6 py-4">{row.date}</td>
                    <td className="px-6 py-4">{row.year}</td>
                    <td className="px-6 py-4">{row.iou}</td>
                    <td className="px-6 py-4">{row.acc}</td>
                    <td className="px-6 py-4">{row.prec}</td>
                    <td className="px-6 py-4">{row.rec}</td>
                    <td className="px-6 py-4">{row.f1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* DeepVar Table */}
      <TabsContent value="time-series" className="mt-0 outline-none">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="font-semibold leading-none mb-1">Time Series Metrics (DeepVar)</h3>
            <p className="text-sm text-zinc-400">Historical performance metrics for the Time Series Forecasting model.</p>
          </div>
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">Model Name</th>
                  <th className="px-6 py-3 font-medium">Version/Date</th>
                  <th className="px-6 py-3 font-medium">Forecast Year</th>
                  <th className="px-6 py-3 font-medium text-right">MAE</th>
                  <th className="px-6 py-3 font-medium text-right">RMSE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {deepVarMetrics.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.modelName}</td>
                    <td className="px-6 py-4">{row.date}</td>
                    <td className="px-6 py-4">{row.year}</td>
                    <td className="px-6 py-4 text-right">{row.mae}</td>
                    <td className="px-6 py-4 text-right">{row.rmse}</td>
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
