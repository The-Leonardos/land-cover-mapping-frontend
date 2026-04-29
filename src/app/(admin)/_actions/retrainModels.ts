"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function retrainModels(year: number) {
    console.log(`Starting model retraining for year ${year}`);

    // Upsert the ModelsRun for this year, marking training as in-progress
    await prisma.modelsRun.update({
        where: {
            forecast_year: year,
        },
        data: {
            training_status: "training",
            training_date: new Date(),
        },
    });

    // Revalidate the admin page to refresh pipeline status
    revalidatePath("/admin");

    return { 
        success: true, 
        message: `Model retraining pipeline triggered for ${year}.` 
    };
}