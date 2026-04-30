import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Shared sub-components ────────────────────────────────────────────────────

function MetricRow({
  name,
  definition,
  high,
  highGood,
  low,
  lowGood,
  range,
  context,
}: {
  name: string;
  definition: string;
  high: string;
  highGood: boolean;
  low: string;
  lowGood: boolean;
  range: string;
  context: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h5 className="font-semibold text-zinc-100 text-sm">{name}</h5>
        <span className="text-xs font-mono text-zinc-500 border border-zinc-800 rounded px-2 py-0.5">
          range: {range}
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{definition}</p>

      <div className="grid grid-cols-2 gap-2">
        <div
          className={`rounded-md p-2.5 text-xs space-y-0.5 border ${
            highGood
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-red-500/10 border-red-500/25 text-red-300"
          }`}
        >
          <p className="font-semibold text-xs uppercase tracking-wider opacity-70">
            High value → {highGood ? "Good ✓" : "Bad ✗"}
          </p>
          <p className="leading-relaxed">{high}</p>
        </div>
        <div
          className={`rounded-md p-2.5 text-xs space-y-0.5 border ${
            lowGood
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : "bg-red-500/10 border-red-500/25 text-red-300"
          }`}
        >
          <p className="font-semibold text-xs uppercase tracking-wider opacity-70">
            Low value → {lowGood ? "Good ✓" : "Bad ✗"}
          </p>
          <p className="leading-relaxed">{low}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-0.5">
        <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-blue-400"
          >
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </span>
        <p className="text-sm text-zinc-500 leading-relaxed italic">{context}</p>
      </div>
    </div>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

export default function MetricsInfoDialog({
  trigger,
  defaultTab = "image-prediction",
}: {
  trigger: React.ReactNode;
  defaultTab?: "image-prediction" | "time-series";
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden gap-0 flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 pb-4 shrink-0 border-b border-zinc-800/50">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Model Metrics Guide
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Understand what each performance metric means and how to interpret
            its values for the land-cover AI models.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto">
          <Tabs
            defaultValue={defaultTab}
            className="w-full text-zinc-100 flex flex-col"
          >
            <TabsList
              variant="line"
              className="bg-transparent h-auto p-0 min-w-0 border-b border-zinc-800 mb-6 gap-6 justify-start"
            >
              <TabsTrigger
                value="image-prediction"
                className="pb-3 pt-2 px-1 text-sm text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-zinc-100 font-medium"
              >
                <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-blue-500/30 mr-2">
                  Segmentation
                </span>
                DeepLab V3+
              </TabsTrigger>
              <TabsTrigger
                value="time-series"
                className="pb-3 pt-2 px-1 text-sm text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-zinc-100 font-medium"
              >
                <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-emerald-500/30 mr-2">
                  Time-Series
                </span>
                DeepVar
              </TabsTrigger>
            </TabsList>

            {/* ── DeepLab V3+ Metrics ── */}
            <TabsContent value="image-prediction" className="mt-0 outline-none space-y-3">
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                DeepLab V3+ is an image segmentation model. All metrics below are
                percentage-based (0–100 %) and evaluate how accurately it classifies
                each pixel of the satellite imagery into a land-cover class.
              </p>

              <MetricRow
                name="IoU — Intersection over Union"
                definition="Measures the spatial overlap between the predicted segmentation mask and the ground-truth mask, divided by the area of their union. Often reported as the mean across all land-cover classes (mIoU)."
                high="Large overlap — predicted boundaries closely match real terrain boundaries."
                highGood={true}
                low="Poor boundary alignment — the model is spatially imprecise."
                lowGood={false}
                range="0 – 100 % (>70 % is good)"
                context="Determines how accurately boundaries between land types (e.g., forest vs. built-up) are detected on the prediction map."
              />

              <MetricRow
                name="Accuracy — Pixel Accuracy"
                definition="The percentage of pixels that were correctly classified out of all pixels in the image."
                high="Most pixels across the study area are correctly labeled."
                highGood={true}
                low="Widespread misclassification of pixels across the map."
                lowGood={false}
                range="0 – 100 % (>85 % is typical)"
                context="A high-level view of overall map correctness — but can be misleading if rare land classes are ignored."
              />

              <MetricRow
                name="Precision"
                definition="Of all pixels the model predicted as belonging to a class, the fraction that truly belong to it. Measures 'exactness' — how few false alarms the model raises."
                high="Few false positives — the model only labels an area as a class when it is very confident."
                highGood={true}
                low="Many false positives — the model hallucinates classes where they don't exist."
                lowGood={false}
                range="0 – 100 %"
                context="High precision means pixels labeled 'water' or 'built-up' are very likely to actually be those classes."
              />

              <MetricRow
                name="Recall"
                definition="Of all pixels that truly belong to a class, the fraction the model successfully found. Measures 'completeness' — how few real instances the model misses."
                high="Few false negatives — the model captures almost all genuine instances of each class."
                highGood={true}
                low="Many false negatives — the model misses large areas of the target class."
                lowGood={false}
                range="0 – 100 %"
                context="High recall means almost all existing tree-cover or bare-ground areas were detected, not overlooked."
              />

              <MetricRow
                name="F1-Score"
                definition="The harmonic mean of Precision and Recall, providing a single balanced metric that penalises models that sacrifice one for the other."
                high="A healthy balance between exactness and completeness across all classes."
                highGood={true}
                low="A significant failure in either precision or recall — the model is lopsided."
                lowGood={false}
                range="0 – 100 %"
                context="Especially important for rare land-cover classes (e.g., mangroves) where the dataset is imbalanced."
              />
            </TabsContent>

            {/* ── DeepVar Metrics ── */}
            <TabsContent value="time-series" className="mt-0 outline-none space-y-3">
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                DeepVar is a probabilistic time-series forecasting model. Its metrics
                evaluate how closely its numerical predictions of land-cover class
                percentages match observed data, and how well it quantifies uncertainty.
              </p>

              <MetricRow
                name="MAE — Mean Absolute Error"
                definition="The average of the absolute differences between all predicted values and their corresponding actual values. Treats all errors equally regardless of direction."
                high="Large average error — predictions are consistently far from the actual observations."
                highGood={false}
                low="Predictions are consistently close to actual observations."
                lowGood={true}
                range="0 → ∞ (lower is better; 0 = perfect)"
                context="Shows the typical magnitude of error in land-cover percentage forecasts, e.g., off by ±3 % on built-up area predictions."
              />

              <MetricRow
                name="RMSE — Root Mean Squared Error"
                definition="The square root of the average of squared errors. Because errors are squared before averaging, large individual errors are penalised more heavily than in MAE."
                high="Occasional extreme mispredictions exist — the model has large outlier errors."
                highGood={false}
                low="Low overall error with few extreme misses; predictions are tightly clustered around truth."
                lowGood={true}
                range="0 → ∞ (lower is better; 0 = perfect)"
                context="Highlights if the model makes rare but critical large errors in forecasting land-cover trends for certain barangays."
              />

              <MetricRow
                name="R² — Coefficient of Determination"
                definition="Measures the proportion of variance in the observed data that the model's predictions explain, relative to a naive baseline of always predicting the mean."
                high="The model captures the underlying trend and variability of land changes well."
                highGood={true}
                low="The model performs no better than (or worse than) simply predicting the historical average."
                lowGood={false}
                range="-∞ to 1.0 (>0.7 is good)"
                context="Indicates how well the model explains the variability and seasonal cycles of land-cover transitions over time."
              />

              <MetricRow
                name="CRPS — Continuous Ranked Probability Score"
                definition="Evaluates the full predicted probability distribution against the observed value. Unlike point-error metrics, it rewards both accuracy and well-calibrated uncertainty estimates."
                high="Poor uncertainty estimation — the model's confidence intervals are too wide or misaligned with reality."
                highGood={false}
                low="The model's predicted distribution is well-calibrated and centres around the true value."
                lowGood={true}
                range="0 → ∞ (lower is better; 0 = perfect)"
                context="Measures 'probabilistic reliability' — critical for land-cover forecasts where decisions depend on understanding the range of possible futures."
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
