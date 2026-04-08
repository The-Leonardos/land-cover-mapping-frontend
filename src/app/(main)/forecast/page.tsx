"use client";

import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForecastRootPage() {
  const router = useRouter();
  const { selectedBarangay } = useBarangayStore();

  useEffect(() => {
    if (selectedBarangay) {
      router.replace(`/forecast/${selectedBarangay}`);
    } else {
      // In a real app we might show a specific empty state, but for now they want toast to handle redirect.
      // We render the layout with empty state
    }
  }, [selectedBarangay, router]);

  return (
    <div className="flex-1 p-8 flex items-center justify-center text-muted-foreground">
      Please select a barangay from the map to view its forecast.
    </div>
  );
}
