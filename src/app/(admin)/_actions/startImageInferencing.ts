"use server";

import { revalidatePath } from "next/cache";

export default async function startImageInferencing(year: number) {
    // todo: call the backend api to start image inferencing
    console.log(`Starting image inferencing for year ${year}`);

    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    // mark the image inferencing as completed

    // Revalidate the admin page to refresh pipeline status
    revalidatePath("/admin");

    return { 
      success: true, 
      message: `Inference pipeline triggered for ${year}.` 
    };
}