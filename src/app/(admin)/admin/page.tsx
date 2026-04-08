import { logoutAction } from "@/actions/auth";
import { ModelStatusCard } from "./_components/model-status-card";
import { PipelineTriggers } from "./_components/pipeline-triggers";
import { MetricsTables } from "./_components/metrics-tables";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-10 text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage forecasting lifecycle and monitor pipeline metrics. Time controls are strictly UTC-based.</p>
          </div>
          <form action={logoutAction}>
            <button 
              type="submit" 
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md text-sm transition-colors text-zinc-300 w-full md:w-auto font-medium"
            >
              Sign Out
            </button>
          </form>
        </header>

        {/* Top Widgets Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full items-stretch">
          <ModelStatusCard />
          <PipelineTriggers />
        </div>

        {/* Models Data Tables */}
        <div>
          <h2 className="text-xl font-bold mb-4 tracking-tight border-b border-zinc-800 pb-2">Model Versions</h2>
          <MetricsTables />
        </div>

      </div>
    </div>
  );
}