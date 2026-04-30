import { prisma } from "../src/lib/prisma"

async function markTrainingModelsTrained(year: number) {
  // Mark the run as trained
  await prisma.modelsRun.update({
    where: { forecast_year: year },
    data: { training_status: "trained" },
  });

  // Upsert DeepLab performance metrics
  await prisma.deepLabPerformance.update({
    where: { forecast_year_model_name: { forecast_year: year, model_name: "DeepLabV3+" } },
    data: {
      iou:       69.312,
      accuracy:  94.61,
      precision: 76.24,
      recall:    71.98,
      f1_score:  73.62,
    }
  });

  // Upsert DeepVar performance metrics
  await prisma.deepVarPerformance.update({
    where: { forecast_year_model_name: { forecast_year: year, model_name: "DeepVAR" } },
    data: {
      mae:  0.038847,
      rmse: 0.070923,
      r2:   0.9611,
      crps: -0.029917,
    }
  });
}

async function main(year: number) {

  if (!year) {
    throw new Error("Please provide a year argument");
  }

  await markTrainingModelsTrained(year);
  console.log(`Marked models for ${year} as trained and updated performance metrics.`);
}

// process.argv[2] is the first argument passed to the script
main(Number(process.argv[2]))
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });