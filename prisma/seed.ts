import * as fs from 'fs'
import { prisma } from '../src/lib/prisma/prisma'

async function main() {
  console.log('Start seeding...')

  const rawData = fs.readFileSync('land_cover_data.json', 'utf-8')
  const data = JSON.parse(rawData)

  // Step 1: Extract unique barangay names
  const barangayNames = Array.from(new Set(data.map((item: any) => item.barangay))) as string[]
  
  console.log(`Found ${barangayNames.length} unique barangays.`)

  // Step 2: Seed Barangays and create a map for IDs
  const barangayMap = new Map<string, number>()
  
  for (const name of barangayNames) {
    const barangay = await prisma.barangay.upsert({
      where: { id: -1 }, // Use a non-existent ID for upsert logic if name isn't unique in schema yet, but better to check by name if we had a unique constraint.
      // Since 'name' is NOT unique in the schema, we'll just find or create.
      update: {},
      create: { name },
    })
    
    // Since name isn't unique in schema, but we want to avoid duplicates in this run:
    const existing = await prisma.barangay.findFirst({ where: { name } })
    if (existing) {
      barangayMap.set(name, existing.id)
    } else {
      const created = await prisma.barangay.create({ data: { name } })
      barangayMap.set(name, created.id)
    }
  }

  console.log('Barangays seeded.')

  // Step 3: Seed LandCoverTimeseries
  console.log(`Seeding ${data.length} timeseries records...`)
  
  // We can use createMany for efficiency if the database supports it (Postgres does)
  // However, we need to map the barangay names to IDs.
  
  const timeseriesData = data.map((item: any) => ({
    barangayId: barangayMap.get(item.barangay),
    year: item.year,
    quarter: item.quarter,
    water: item.water,
    trees: item.trees,
    grass: item.grass,
    floodedVegetation: item.flooded_vegetation,
    crops: item.crops,
    shrub: item.shrub,
    snow: item.snow,
    built: item.built,
    bare: item.bare,
  }))

  // Chunk the data to avoid statement limits
  const chunkSize = 1000
  for (let i = 0; i < timeseriesData.length; i += chunkSize) {
    const chunk = timeseriesData.slice(i, i + chunkSize)
    await prisma.landCoverTimeseries.createMany({
      data: chunk,
      skipDuplicates: true,
    })
    console.log(`Seeded chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(timeseriesData.length / chunkSize)}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
