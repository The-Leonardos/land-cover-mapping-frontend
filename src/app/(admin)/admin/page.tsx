import { logoutAction } from "../_actions/logout";
import { ModelStatusCard } from "../_components/model-status-card";
import { PipelineTriggers } from "../_components/pipeline-triggers";
import { MetricsTables } from "../_components/metrics-tables";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden">
      {/* Subtle topographic background pattern (same as login) */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 600px 200px at 20% 30%, var(--secondary) 0%, transparent 70%)",
            "radial-gradient(ellipse 500px 180px at 70% 60%, var(--primary) 0%, transparent 70%)",
            "radial-gradient(ellipse 400px 120px at 50% 80%, var(--accent) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
          <div className="flex items-start gap-5">
             <div>
              <div className="flex items-center gap-2 mb-1">
                <Link 
                  href="/map" 
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                  Back to monitoring map
                </Link>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Manage forecasting lifecycle and monitor pipeline metrics. 
                System controls are strictly UTC-based for consistency across time-series data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form action={logoutAction} className="w-full md:w-auto">
              <Button 
                variant="outline"
                type="submit" 
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </header>
 
        {/* Top Widgets Grid */}
        <section className="grid lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <ModelStatusCard />
          </div>
          <div className="lg:col-span-2">
            <PipelineTriggers />
          </div>
        </section>

        {/* Models Data Tables */}
        <section className="w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Performance Metrics</h2>
            <p className="text-sm text-muted-foreground">Historical accuracy and validation scores for DeepLabV3+ and DeepVAR models.</p>
          </div>
          <MetricsTables />
        </section>

      </div>
    </div>
  );
}
