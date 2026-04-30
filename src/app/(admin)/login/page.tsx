"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../_actions/login";
import { Button } from "@/components/ui/button";
import { Globe, Lock, ArrowRight, MapPin, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Authentication failed");
      }
    });
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Subtle topographic background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 600px 200px at 20% 30%, var(--secondary) 0%, transparent 70%)",
            "radial-gradient(ellipse 500px 180px at 70% 60%, var(--primary) 0%, transparent 70%)",
            "radial-gradient(ellipse 400px 120px at 50% 80%, var(--accent) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      <div
        className="flex w-full max-w-[56rem] rounded-2xl border border-border bg-card/50 overflow-hidden shadow-2xl shadow-black/50"
      >
        {/* Left column — branding / context */}
        <div
          className="hidden md:flex w-1/2 flex-col justify-center p-10 bg-linear-to-br from-secondary/20 to-background border-r border-border/40"
        >
          <div className="flex flex-col gap-5">
            {/* Logo mark */}
            <div className="w-14 h-14 flex items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <Globe className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-foreground">
              Baguio City
              <br />
              Land Cover
              <br />
              Monitoring Agent
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-[22rem]">
              DeepLabV3+ segmentation &amp; DeepAR forecasting
              pipeline for environmental monitoring across 129 barangays.
            </p>

            {/* Visual separator */}
            <div className="w-12 h-px bg-primary/20" />

            {/* Stat chips */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/10 border border-border rounded-full px-2.5 py-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>129 barangays</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/10 border border-border rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>7 LULC classes</span>
              </div>
            </div>

            {/* Go to map link */}
            <Link
              href="/map"
              className="group inline-flex items-center gap-2 text-sm font-medium text-secondary mt-2 transition-all duration-200 w-fit hover:text-primary hover:gap-3"
            >
              <span>Open the monitoring map</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Right column — login form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-10 md:py-12 bg-card">
          <div className="w-full max-w-[22rem]">
            <div className="mb-8">
              <div className="w-11 h-11 flex items-center justify-center rounded-[0.625rem] border border-border bg-background mb-4">
                <Lock className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pipeline controls &amp; model metrics
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="w-full py-2.5 pl-3 pr-11 bg-background border border-border rounded-lg text-foreground text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer p-1 rounded-sm bg-transparent border-none transition-colors duration-150 flex items-center justify-center hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-sm font-medium text-destructive">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="login-spinner" />
                    Authenticating…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Secondary route to map (mobile-first, since left panel hides on small screens) */}
            <div className="mt-6 pt-5 border-t border-border text-center md:hidden">
              <Link href="/map" className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
                ← Back to monitoring map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
