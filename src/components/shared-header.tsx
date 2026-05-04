"use client";

import { Satellite, BarChart3, SplitSquareHorizontal } from "lucide-react";
import Image from "next/image";
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
  const isCompareActive = pathname.startsWith("/compare");

  const handleForecastClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const encodedBarangay = encodeURIComponent(selectedBarangay || "");

    if (!selectedBarangay) {
      toast.error("Please select a barangay from the map first.", {
        position: "top-right"
      });
      return;
    }
    // If we have selectedBarangay, we proceed to default link which goes to   /forecast/[barangay]
    router.push(`/forecast/${encodedBarangay}`);
  };

  return (
    <header className="z-20 border-b border-border bg-card px-2 md:px-6 py-2 md:py-3 shrink-0">
      <div className="flex items-center justify-between gap-1 sm:gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl overflow-hidden shadow-sm shrink-0">
            <Image src="/data/icon.png" alt="Baguio City Land Cover" width={44} height={44} className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm md:text-base font-bold text-foreground tracking-tight whitespace-nowrap">
              Baguio City Land Cover
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Monitoring Agent
            </p>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="flex justify-center shrink-0 max-w-full overflow-x-auto no-scrollbar">
          <div className="flex bg-muted/50 dark:bg-black/30 rounded-xl py-1.5 md:py-2 gap-1">
            <Link
              href="/map"
              className={`flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                isMapActive
                  ? "bg-primary text-foreground shadow-md border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Satellite className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">SEGMENTATION MAP</span>
            </Link>
            <Link
              href="/compare"
              className={`flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                isCompareActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <SplitSquareHorizontal className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">COMPARE</span>
            </Link>
            <Link
              href={selectedBarangay ? `/forecast/${selectedBarangay}` : "/forecast"}
              onClick={handleForecastClick}
              className={`flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                isForecastActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">DEEPVAR FORECAST</span>
            </Link>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end">
          <BarangaySearch />
        </div>
      </div>
    </header>
  );
}
