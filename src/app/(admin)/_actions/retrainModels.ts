"use server";

import { revalidatePath } from "next/cache";

export async function retrainModels(year: number) {
    // todo: call the backend api to retrain the models    
    console.log(`Starting model retraining for year ${year}`);
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // mark the model as training

    // Revalidate the admin page to refresh pipeline status
    revalidatePath("/admin");

    return { 
      success: true, 
      message: `Model retraining pipeline triggered for ${year}.` 
    };
}