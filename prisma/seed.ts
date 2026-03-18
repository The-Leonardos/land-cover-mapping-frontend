import * as fs from 'fs'
import * as path from 'path'
import { prisma } from '../src/lib/prisma/prisma'

async function main() {
  console.log('Start seeding...')

  // Step 1: Remove current data
  console.log('Clearing existing data...')
  await prisma.landCoverTimeseries.deleteMany({})
  await prisma.barangay.deleteMany({})
  console.log('Existing data cleared.')

  // Step 2: Read CSV data
  const csvPath = path.resolve(process.cwd(), 'prisma/Time-Series-Dataset-Unnormalized.csv')
  const rawData = fs.readFileSync(csvPath, 'utf-8')
  const lines = rawData.trim().split('\n')
  const header = lines[0].split(',')
  const dataLines = lines.slice(1)

  console.log(`Processing ${dataLines.length} rows from CSV...`)

  // Create a map for unique barangays
  const barangaysMap = new Map<number, string>()
  const timeseriesData: any[] = []

  for (const line of dataLines) {
    const values = line.split(',')
    if (values.length < 13) continue

    const name = values[0].trim()
    const bareGround = parseFloat(values[1])
    const builtArea = parseFloat(values[2])
    const crops = parseFloat(values[3])
    const floodedVegetation = parseFloat(values[4])
    const grass = parseFloat(values[5])
    const quarter = parseInt(values[6])
    const shrubAndScrub = parseFloat(values[7])
    const snowAndIce = parseFloat(values[8])
    const trees = parseFloat(values[9])
    const water = parseFloat(values[10])
    const year = parseInt(values[11])
    const barangayId = parseInt(values[12])

    if (!barangaysMap.has(barangayId)) {
      barangaysMap.set(barangayId, name)
    }

    timeseriesData.push({
      barangayId,
      year,
      quarter,
      water,
      trees,
      grass,
      floodedVegetation,
      crops,
      shrub: shrubAndScrub,
      snow: snowAndIce,
      built: builtArea,
      bare: bareGround,
    })
  }

  // Step 3: Seed Barangays
  console.log(`Seeding ${barangaysMap.size} unique barangays...`)
  const barangayRecords = Array.from(barangaysMap.entries()).map(([id, name]) => ({
    id,
    name,
  }))

  await prisma.barangay.createMany({
    data: barangayRecords,
  })
  console.log('Barangays seeded.')

  // Step 4: Seed LandCoverTimeseries in chunks
  console.log(`Seeding ${timeseriesData.length} timeseries records...`)
  const chunkSize = 1000
  for (let i = 0; i < timeseriesData.length; i += chunkSize) {
    const chunk = timeseriesData.slice(i, i + chunkSize)
    await prisma.landCoverTimeseries.createMany({
      data: chunk,
      skipDuplicates: true,
    })
    console.log(`Seeded chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(timeseriesData.length / chunkSize)}`)
  }

  console.log('Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

