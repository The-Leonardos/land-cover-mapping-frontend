"use client";

const deepLabMetrics = [
  { modelName: "DeepLab V3+ Base", date: "2025-12-31", year: "2026", iou: "0.85", acc: "0.92", prec: "0.88", rec: "0.90", f1: "0.89" },
];

const deepVarMetrics = [
  { modelName: "DeepVar Base", date: "2025-12-31", year: "2026", mae: "4.21", rmse: "5.67" },
];

export function MetricsTables() {
  return (
    <div className="flex flex-col gap-8 w-full text-zinc-100">
      
      {/* DeepLab V3+ Table */}
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

      {/* DeepVar Table */}
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

    </div>
  );
}
