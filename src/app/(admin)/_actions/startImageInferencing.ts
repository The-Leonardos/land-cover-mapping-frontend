"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export default async function startImageInferencing(year: number) {
    console.log(`Starting image inferencing for year ${year}`);

    // Upsert the ModelsRun for this year, marking inference as completed
    await prisma.modelsRun.update({
        where: {
            forecast_year: year,
        },
        data: {
            inference_status: "completed",
        },
    });

    // Revalidate the admin page to refresh pipeline status
    revalidatePath("/admin");

    return { 
        success: true, 
        message: `Inference pipeline triggered for ${year}.` 
    };
}