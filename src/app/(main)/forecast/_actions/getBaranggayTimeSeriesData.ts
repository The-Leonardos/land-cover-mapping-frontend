"use server";

import { BarangayLandCoverTimeSeries } from "@/lib/types/barangay-landcover-timeseries";
import { prisma } from "@/lib/prisma/prisma";

export async function getAllBarangays() {
  return prisma.barangay.findMany({
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getBarangayAllYearsData(barangayId: number) {
  return prisma.landCoverTimeseries.findMany({
    where: {
      barangayId,
    },
    orderBy: {
      year: "asc",
    },
  });
}
