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
      iou:       67.095,
      accuracy:  93.57,
      precision: 73,
      recall:    70.74,
      f1_score:  71.39,
    }
  });

  // Upsert DeepVar performance metrics
  await prisma.deepVarPerformance.update({
    where: { forecast_year_model_name: { forecast_year: year, model_name: "DeepVAR" } },
    data: {
      mae:  0.039391,
      rmse: 0.071678,
      r2:   0.9504,
      crps: -0.030484,
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