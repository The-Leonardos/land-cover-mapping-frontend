import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PipelineManualInfoDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden gap-0 flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 pb-4 shrink-0 border-b border-zinc-800/50">
          <DialogTitle className="text-2xl font-bold tracking-tight">System Manual & Pipeline Info</DialogTitle>
          <DialogDescription className="text-zinc-400">
            A comprehensive guide on how the dynamic land-cover AI pipeline works and how to operate it.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full text-zinc-100 flex flex-col">
            <TabsList variant="line" className="bg-transparent h-auto p-0 min-w-0 border-b border-zinc-800 mb-6 gap-6 justify-start">
              <TabsTrigger
                value="overview"
                className="pb-3 pt-2 px-1 text-sm text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-zinc-100 font-medium"
              >
                Pipeline Overview
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="pb-3 pt-2 px-1 text-sm text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-t-0 border-l-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-zinc-100 font-medium"
              >
                User Manual
              </TabsTrigger>
            </TabsList>

            {/* Pipeline Overview Tab */}
            <TabsContent value="overview" className="mt-0 outline-none space-y-8">
              <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
                
                <section>
                  <h4 className="font-semibold text-zinc-100 text-base mb-2">The AI Architecture</h4>
                  <p className="mb-5 text-zinc-400">
                    The land-cover platform operates on a dual-model constraint, separating interactive map rendering from numerical statistical forecasting to maximize accuracy.
                  </p>
                  
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <h5 className="font-semibold text-zinc-200 flex items-center gap-2">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-blue-500/30">Segmentation</span>
                        DeepLab V3+
                      </h5>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Our primary image segmentation model. It fetches high-fidelity satellite imagery from 
                        <strong className="text-zinc-200"> Google Datasets (Sentinel-2 and Dynamic World)</strong>. 
                        It directly classifies land areas pixel-by-pixel to render the interactive prediction maps you see on the dashboard.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h5 className="font-semibold text-zinc-200 flex items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-emerald-500/30">Time-Series</span>
                        DeepVAR
                      </h5>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        This model drives the time-series mathematical forecasting. While it leverages the exact same Dynamic World dataset, it analyzes the data computationally by 
                        <strong className="text-zinc-200"> extracting the pixel percentages of land classes bounded individually for every single barangay.</strong> 
                        This creates the localized vector data required to chart future statistical trajectories.
                      </p>
                    </div>
                  </div>
                </section>

                <hr className="border-zinc-800/60" />

                <section>
                  <h4 className="font-semibold text-zinc-100 text-base mb-5">The Lifecycle (Step-by-Step)</h4>
                  <div className="space-y-2">
                    
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0">1</div>
                        <div className="w-px h-full bg-zinc-800 my-1"></div>
                      </div>
                      <div className="pb-4">
                        <h5 className="font-semibold text-zinc-200 mb-1 border-b border-zinc-800/50 pb-1">Model Training (Past Data)</h5>
                        <p className="text-zinc-400 mt-1.5">
                          The system gathers a massive amount of historical satellite data (for example, from <strong className="text-zinc-200 border-b border-zinc-700">2016 to 2025</strong>). Both models (DeepVAR and DeepLab V3+) use this past as training data to learn how land changes over time.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0">2</div>
                        <div className="w-px h-full bg-zinc-800 my-1"></div>
                      </div>
                      <div className="pb-4">
                        <h5 className="font-semibold text-zinc-200 mb-1 border-b border-zinc-800/50 pb-1">Q1 Image Collection (Forecast Year)</h5>
                        <p className="text-zinc-400 mt-1.5">
                          The target Forecast Year (e.g., <strong className="text-zinc-200 border-b border-zinc-700">2026</strong>) arrives. Instead of just guessing what will happen, the pipeline collects high-quality, cloud-free satellite imagery as <strong className="text-zinc-300">Quarter 1 (January to March)</strong> physically passes. Because it is actively waiting to collect these real-world images, the forecast map stays locked.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0">3</div>
                        <div className="w-px h-full bg-transparent my-1"></div>
                      </div>
                      <div className="pb-1">
                        <h5 className="font-semibold text-zinc-200 mb-1 border-b border-zinc-800/50 pb-1">Inference & Cycle Repeat</h5>
                        <p className="text-zinc-400 mt-1.5">
                          Once Quarter 1 of Forecast Year officially ends, the system takes the collected Q1 images and feeds them into the trained DeepLab model as a base input. The model uses this input to predict and render the final map for the rest of the forecast year, unlocking your dashboard! When the next year rolls around, the entire cycle repeats.
                        </p>
                        <p className="text-zinc-400 mt-1.5 mb-2">
                          {`Example: 2015 - 2025 (training years) -> 2026 (forecast year)`}
                        </p>
                        <p className="p-3 bg-zinc-950/80 rounded border border-zinc-800/50 text-sm text-zinc-400 mt-3">
                          <strong className="text-zinc-200">The Cycle Continues:</strong> When it's time to predict the next year (2027), the old forecast year (2026) simply becomes part of our past training data—meaning the new training data spans from <strong className="text-zinc-200">2016 all the way to 2026</strong>. The system will then lock again to wait for <strong className="text-zinc-200">Q1 of 2027</strong> to collect fresh image inputs to predict the 2027 map. This continuous cycle repeats automatically for all the years to come!
                        </p>
                      </div>
                    </div>

                  </div>
                </section>

                <div className="mt-8 p-3.5 border-l-4 border-orange-500/50 bg-orange-500/10 rounded-r-md text-orange-200 text-sm">
                  <strong>Notice:</strong> Retraining and mapping are highly resource-intensive parallel operations analyzing vast geographical datasets. Triggering them will lock the backend pipeline for several hours.
                </div>
              </div>
            </TabsContent>

            {/* User Manual Tab */}
            <TabsContent value="manual" className="mt-0 outline-none space-y-6">
              <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
                
                <div>
                  <h4 className="font-semibold text-zinc-100 text-base mb-2 flex items-center gap-2">
                    <span className="bg-zinc-800 text-zinc-400 w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 font-bold border border-zinc-700">1</span>
                    Retrain Models Control
                  </h4>
                  <div className="pl-7 space-y-2 text-zinc-400">
                    <p><strong className="text-zinc-200">Unlock Condition:</strong> Available on or after <strong className="text-zinc-200">January 1st at 12:00 AM UTC</strong> of the forecast year.</p>
                    <p>
                      <strong className="text-zinc-200">Action Overview:</strong> This marks the end of the previous year's dataset. Clicking this button starts the process of downloading the needed data to train <em>both</em> the DeepVAR and DeepLab V3+ models at the same time. 
                      You should click this early in the year to get the models ready.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-100 text-base mb-2 flex items-center gap-2">
                    <span className="bg-zinc-800 text-zinc-400 w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 font-bold border border-zinc-700">2</span>
                    Run Image Inference Control
                  </h4>
                  <div className="pl-7 space-y-2 text-zinc-400">
                    <p><strong className="text-zinc-200">Unlock Condition:</strong> Available on or after <strong className="text-zinc-200">April 1st at 12:00 AM UTC</strong>.</p>
                    <p><strong className="text-zinc-200">Prerequisite:</strong> Both models (DeepVAR and DeepLab V3+) must already have a "Trained" status.</p>
                    <p>
                      <strong className="text-zinc-200">Action Overview:</strong> By April 1st, the system has successfully collected all the Quarter 1 (Q1) satellite images. Clicking this button takes those newly gathered Q1 images and feeds them into the trained DeepLab model. The model then uses these Q1 images as the base input (the inference image) to predict and generate the final map for the rest of the forecast year. Once finished, the dashboard map will be unlocked for users to view.
                    </p>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                <div>
                  <h4 className="font-semibold text-zinc-100 text-base mb-2">Monitoring & Troubleshooting</h4>
                  <ul className="list-disc list-inside space-y-2 mt-2 marker:text-zinc-500 text-zinc-400 border-l-2 border-zinc-800 pl-4 ml-1">
                    <li>The status card continually polls the backend pipeline intelligently. However, you can safely <strong className="text-zinc-200">refresh the page</strong> anytime to force a strict status synchronization.</li>
                    <li>If a process errors out or fails unexpectedly during extraction, simply try to <strong className="text-zinc-200">re-trigger the action button</strong>.</li>
                    <li>If systemic errors natively persist across multiple runtime attempts, please formally contact the AI development team.</li>
                  </ul>
                </div>

              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}