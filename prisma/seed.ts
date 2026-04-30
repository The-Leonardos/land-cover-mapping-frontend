import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

async function  clearAllData() {
  console.log('Clearing all data...');

  // Delete in dependency order (children first)
  await prisma.deepLabPerformance.deleteMany({});
  await prisma.deepVarPerformance.deleteMany({});
  await prisma.modelsRun.deleteMany({});
  await prisma.years.deleteMany({});
  await prisma.landCoverTimeSeries.deleteMany({});
}

/**
 * 2016-2025 actual land cover time series data
 * 2026 is the forecast year
 * metrics data are present
 */
async function seedActualData() {
  console.log('Seeding actual data...');

  // ── Seed LandCoverTimeSeries from CSV ──────────────────────────────────────
  const csvPath = path.resolve(process.cwd(), 'public/data/deepvar/time-series-data.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const lines = csvContent.trim().split('\n');
  const headers = lines[0].trim().split(',');

  const timeSeriesData = [];

  // Columns in CSV: BRGY_NAME, bare_ground, built_area, crops, flooded_vegetation, grass,
  // quarter, shrub_and_scrub, snow_and_ice, trees, water, year, baranggay_id
  const getIndex = (name: string) => headers.indexOf(name);

  const idxBrgyName    = getIndex('BRGY_NAME');
  const idxBareGround  = getIndex('bare_ground');
  const idxBuiltArea   = getIndex('built_area');
  const idxCrops       = getIndex('crops');
  const idxGrass       = getIndex('grass');
  const idxQuarter     = getIndex('quarter');
  const idxShrubScrub  = getIndex('shrub_and_scrub');
  const idxTrees       = getIndex('trees');
  const idxWater       = getIndex('water');
  const idxYear        = getIndex('year');
  const idxBarangayId  = getIndex('baranggay_id');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    const year = parseInt(values[idxYear]);

    timeSeriesData.push({
      barangay_id:   String(values[idxBarangayId]),
      barangay_name: String(values[idxBrgyName]),
      year,
      quarter:       parseInt(values[idxQuarter]),
      bare_ground:   parseFloat(values[idxBareGround]),
      built_up_area: parseFloat(values[idxBuiltArea]),
      crops:         parseFloat(values[idxCrops]),
      grass:         parseFloat(values[idxGrass]),
      shrub_and_scrub: parseFloat(values[idxShrubScrub]),
      trees:         parseFloat(values[idxTrees]),
      water:         parseFloat(values[idxWater]),
    });
  }

  console.log(`Seeding ${timeSeriesData.length} records from 2016-2025 into LandCoverTimeSeries table...`);

  await prisma.landCoverTimeSeries.createMany({
    data: timeSeriesData,
    skipDuplicates: true,
  });

  // ── Seed Years ─────────────────────────────────────────────────────────────
  console.log('Seeding Years table from 2016-2026 where 2026 is the forecast year...');

  // length 11 - 2016-2026
  await prisma.years.createMany({
    data: Array.from({ length: 11 }, (_, i) => ({ year: 2016 + i })),
    skipDuplicates: true,
  });

  // ── Seed ModelsRun ─────────────────────────────────────────────────────────
  console.log('Seeding ModelsRun...');

  const bothModelsRun = await prisma.modelsRun.create({
    data: {
      forecast_year:    2026,
      training_status:  'trained',
      inference_status: 'completed',
      training_date:    new Date('2026-01-01'),
    },
  });

  // ── Seed DeepLabPerformance ────────────────────────────────────────────────
  console.log('Seeding DeepLabPerformance...');

  await prisma.deepLabPerformance.create({
    data: {
      forecast_year: bothModelsRun.forecast_year,
      model_name: "DeepLabV3+",
      iou:          67.095,
      accuracy:     93.57,
      precision:    73,
      recall:       70.74,
      f1_score:     71.39,
    },
  });

  // ── Seed DeepVarPerformance ────────────────────────────────────────────────
  console.log('Seeding DeepVarPerformance...');

  await prisma.deepVarPerformance.create({
    data: {
      forecast_year: bothModelsRun.forecast_year,
      model_name: "DeepVAR",
      mae:  0.039391,
      rmse: 0.071678,
      r2:   0.9504,
      crps: -0.030484,
    },
  });

  console.log('Seeding completed successfully.');
}

/**
 * 2016-2024 actual land cover time series data
 * 2025 forecast land cover data
 * No performance metrics data
 */
async function seedDynamicModelDemo() {
  console.log('Seeding dynamic model demo...');

  // ── Seed LandCoverTimeSeries from CSV ──────────────────────────────────────
  const csvPath = path.resolve(process.cwd(), 'public/data/deepvar/time-series-data.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const lines = csvContent.trim().split('\n');
  const headers = lines[0].trim().split(',');

  const timeSeriesData = [];

  // Columns in CSV: BRGY_NAME, bare_ground, built_area, crops, flooded_vegetation, grass,
  // quarter, shrub_and_scrub, snow_and_ice, trees, water, year, baranggay_id
  const getIndex = (name: string) => headers.indexOf(name);

  const idxBrgyName    = getIndex('BRGY_NAME');
  const idxBareGround  = getIndex('bare_ground');
  const idxBuiltArea   = getIndex('built_area');
  const idxCrops       = getIndex('crops');
  const idxGrass       = getIndex('grass');
  const idxQuarter     = getIndex('quarter');
  const idxShrubScrub  = getIndex('shrub_and_scrub');
  const idxTrees       = getIndex('trees');
  const idxWater       = getIndex('water');
  const idxYear        = getIndex('year');
  const idxBarangayId  = getIndex('baranggay_id');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    const year = parseInt(values[idxYear]);

    timeSeriesData.push({
      barangay_id:   String(values[idxBarangayId]),
      barangay_name: String(values[idxBrgyName]),
      year,
      quarter:       parseInt(values[idxQuarter]),
      bare_ground:   parseFloat(values[idxBareGround]),
      built_up_area: parseFloat(values[idxBuiltArea]),
      crops:         parseFloat(values[idxCrops]),
      grass:         parseFloat(values[idxGrass]),
      shrub_and_scrub: parseFloat(values[idxShrubScrub]),
      trees:         parseFloat(values[idxTrees]),
      water:         parseFloat(values[idxWater]),
    });
  }

  console.log(`Seeding ${timeSeriesData.length} records from 2016-2025 into LandCoverTimeSeries table...`);

  await prisma.landCoverTimeSeries.createMany({
    data: timeSeriesData,
    skipDuplicates: true,
  });

  // ── Seed Years ─────────────────────────────────────────────────────────────
  console.log('Seeding Years table from 2016-2026 where 2026 is the forecast year...');

  // length 11 - 2016-2027
  await prisma.years.createMany({
    data: Array.from({ length: 12 }, (_, i) => ({ year: 2016 + i })),
    skipDuplicates: true,
  });

  // ── Seed ModelsRun ─────────────────────────────────────────────────────────
  console.log('Seeding ModelsRun where 2026 is the previous year and has metrics...');

  
  const modelsRun2026 = await prisma.modelsRun.create({
    data: {
      forecast_year:    2026,
      training_status:  'trained',
      inference_status: 'completed',
      training_date:    new Date('2026-01-01'),
    },
  });

  // ── Seed DeepLabPerformance ────────────────────────────────────────────────
  console.log('Seeding DeepLabPerformance for 2026...');

  await prisma.deepLabPerformance.create({
    data: {
      forecast_year: modelsRun2026.forecast_year,
      model_name: "DeepLabV3+",
      iou:          67.095,
      accuracy:     93.57,
      precision:    73,
      recall:       70.74,
      f1_score:     71.39,
    },
  });

  // ── Seed DeepVarPerformance ────────────────────────────────────────────────
  console.log('Seeding DeepVarPerformance for 2025...');

  await prisma.deepVarPerformance.create({
    data: {
      forecast_year: modelsRun2026.forecast_year,
      model_name: "DeepVAR",
      mae:          0.039391,
      rmse:         0.071678,
      r2:           0.9504,
      crps:         -0.030484,
    },
  });

  // ── Seed ModelsRun (Dynamic Modelling) ────────────────────────────────────
  console.log('Seeding ModelsRun for 2027 where it does not have metrics yet');

  
  const modelsRun2027 = await prisma.modelsRun.create({
    data: {
      forecast_year:    2027,
      training_status:  'not_started',
      inference_status: 'not_started',
      training_date:    null,
    },
  });

  // ── Seed DeepLabPerformance ────────────────────────────────────────────────
  console.log('Seeding DeepLabPerformance for 2027...');

  await prisma.deepLabPerformance.create({
    data: {
      forecast_year: modelsRun2027.forecast_year,
      model_name: "DeepLabV3+",
      iou:          null,
      accuracy:     null,
      precision:    null,
      recall:       null,
      f1_score:     null,
    },
  });

  // ── Seed DeepVarPerformance ────────────────────────────────────────────────
  console.log('Seeding DeepVarPerformance for 2027...');

  await prisma.deepVarPerformance.create({
    data: {
      forecast_year: modelsRun2027.forecast_year,
      model_name: "DeepVAR",
      mae:          null,
      rmse:         null,
      r2:           null,
      crps:         null,
    },
  });

  console.log('Seeding completed successfully.');
}

async function main(args: string[]) {
  // check whether args[0] is actual_data or dynamic_model_demo
  if(args[0] === 'actual_data') {
    await clearAllData();
    await seedActualData();
  } else if(args[0] === 'dynamic_model_demo') {
    await clearAllData();
    await seedDynamicModelDemo();
  } else if(args[0] === 'clear_all_data') {
    await clearAllData();
  } else {
    throw new Error('Invalid argument. Please provide an argument either "actual_data" or "dynamic_model_demo".');
  }
}

main(process.argv.slice(2))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
