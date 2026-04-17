import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';


async function main() {
  console.log('Cleaning up existing data...');
  await prisma.landCoverTimeSeries.deleteMany({});
  await prisma.landCoverImages.deleteMany({});
  await prisma.modelsPerformance.deleteMany({});
  await prisma.modelsStatus.deleteMany({});

  // -- Seed LandCoverTimeSeries from CSV --
  const csvPath = path.resolve(process.cwd(), 'data/dataset/deepvar/time-series-data.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].trim().split(',');
  
  const timeSeriesData = [];
  
  // Columns in CSV: BRGY_NAME, bare_ground, built_area, crops, flooded_vegetation, grass, 
  // quarter, shrub_and_scrub, snow_and_ice, trees, water, year, baranggay_id
  const getIndex = (name: string) => headers.indexOf(name);
  
  const idxBrgyName = getIndex('BRGY_NAME');
  const idxBareGround = getIndex('bare_ground');
  const idxBuiltArea = getIndex('built_area');
  const idxCrops = getIndex('crops');
  const idxGrass = getIndex('grass');
  const idxQuarter = getIndex('quarter');
  const idxShrubScrub = getIndex('shrub_and_scrub');
  const idxTrees = getIndex('trees');
  const idxWater = getIndex('water');
  const idxYear = getIndex('year');
  const idxBarangayId = getIndex('baranggay_id');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    
    timeSeriesData.push({
      barangay_id: String(values[idxBarangayId]),
      barangay_name: String(values[idxBrgyName]),
      year: parseInt(values[idxYear]),
      quarter: parseInt(values[idxQuarter]),
      bare_ground: parseFloat(values[idxBareGround]),
      built_up_area: parseFloat(values[idxBuiltArea]),
      crops: parseFloat(values[idxCrops]),
      grass: parseFloat(values[idxGrass]),
      shrub_and_scrub: parseFloat(values[idxShrubScrub]),
      trees: parseFloat(values[idxTrees]),
      water: parseFloat(values[idxWater]),
    });
  }

  console.log(`Seeding ${timeSeriesData.length} records into LandCoverTimeSeries...`);
  
  await prisma.landCoverTimeSeries.createMany({
    data: timeSeriesData,
    skipDuplicates: true,
  });

  // -- Seed LandCoverImages --
  const imagesData = [];
  for (let year = 2016; year <= 2025; year++) {
    imagesData.push({
      year,
      raw_satellite_imageURL: `http://localhost:4566/thesis-bucket/sentinel/SENTINEL_${year}_Q1.tif`,
      dynamic_world_image_URL: `http://localhost:4566/thesis-bucket/dynamic-world/DW_RGB_${year}_Q1.tif`
    });
  }

  console.log(`Seeding ${imagesData.length} records into LandCoverImages...`);
  
  await prisma.landCoverImages.createMany({
    data: imagesData,
    skipDuplicates: true,
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
