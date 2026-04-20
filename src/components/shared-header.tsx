"use client";

import { Globe, Satellite, BarChart3 } from "lucide-react";
import { BarangaySearch } from "@/components/barangay-search";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { toast } from "sonner";

export function SharedHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedBarangay } = useBarangayStore();

  const isMapActive = pathname.startsWith("/map");
  const isForecastActive = pathname.startsWith("/forecast");

  const handleForecastClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!selectedBarangay) {
      toast.error("Please select a barangay from the map first.", {
        position: "top-right"
      });
      return;
    }
    // If we have selectedBarangay, we proceed to default link which goes to /forecast/[barangay]
    router.push(`/forecast/${selectedBarangay}`);
  };

  return (
    <header className="z-20 border-b border-border bg-card px-3 md:px-6 py-2.5 md:py-3 shrink-0">
      <div className="flex items-center justify-between relative">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm">
            <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm md:text-base font-bold text-foreground tracking-tight">
              Baguio City Land Cover
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Monitoring Agent
            </p>
          </div>
        </div>

        {/* Center Tabs - Desktop */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-muted/50 dark:bg-black/30 rounded-xl p-1.5 border border-border gap-1">
          <Link
            href="/map"
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isMapActive
                ? "bg-card text-foreground shadow-md border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Satellite className="h-4 w-4" />
            <span className="hidden lg:inline">SEGMENTATION MAP</span>
            <span className="lg:hidden">MAP</span>
          </Link>
          <Link
            href={selectedBarangay ? `/forecast/${selectedBarangay}` : "/forecast"}
            onClick={handleForecastClick}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isForecastActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden lg:inline">DEEPAR FORECAST</span>
            <span className="lg:hidden">FORECAST</span>
          </Link>
        </div>

        {/* Mobile Tabs */}
        <div className="flex md:hidden bg-muted/50 dark:bg-black/30 rounded-lg p-1 border border-border gap-1">
          <a
            href="/map"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
              isMapActive
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground"
            }`}
          >
            <Satellite className="h-3.5 w-3.5" />
            MAP
          </a>
          <Link
            href={selectedBarangay ? `/forecast/${selectedBarangay}` : "/forecast"}
            onClick={handleForecastClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
              isForecastActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            FORECAST
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <div className="relative hidden lg:block mr-2">
            <BarangaySearch />
          </div>
        </div>
      </div>
    </header>
  );
}
