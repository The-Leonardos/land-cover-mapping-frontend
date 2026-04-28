import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Cleaning up existing data...');

  // Delete in dependency order (children first)
  await prisma.deepLabPerformance.deleteMany({});
  await prisma.deepVarPerformance.deleteMany({});
  await prisma.modelsRun.deleteMany({});
  await prisma.models.deleteMany({});
  await prisma.years.deleteMany({});
  await prisma.landCoverTimeSeries.deleteMany({});

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

    // Only include years 2016–2026
    if (year < 2016 || year > 2026) continue;

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

  console.log(`Seeding ${timeSeriesData.length} records into LandCoverTimeSeries (2016–2026)...`);

  await prisma.landCoverTimeSeries.createMany({
    data: timeSeriesData,
    skipDuplicates: true,
  });

  // ── Seed Years ─────────────────────────────────────────────────────────────
  console.log('Seeding Years (2016–2026)...');

  await prisma.years.createMany({
    data: Array.from({ length: 11 }, (_, i) => ({ year: 2016 + i })),
    skipDuplicates: true,
  });

  // ── Seed Models ────────────────────────────────────────────────────────────
  console.log('Seeding Models...');

  const deeplab = await prisma.models.create({
    data: { model_name: 'DeepLabV3+' },
  });

  const deepvar = await prisma.models.create({
    data: { model_name: 'DeepVAR' },
  });

  // ── Seed ModelsRun ─────────────────────────────────────────────────────────
  console.log('Seeding ModelsRun...');

  const deeplabRun = await prisma.modelsRun.create({
    data: {
      forecast_year:    2026,
      training_status:  'trained',
      inference_status: 'completed',
      training_date:    new Date('2026-01-01'),
    },
  });

  const deepvarRun = await prisma.modelsRun.create({
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
      model_run_id: deeplabRun.id,
      model_id:     deeplab.model_id,
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
      model_run_id: deepvarRun.id,
      model_id:     deepvar.model_id,
      mae:  0.039391,
      rmse: 0.071678,
      r2:   0.9504,
      crps: -0.030484,
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
