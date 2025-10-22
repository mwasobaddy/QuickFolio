import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding for files...')

  // Seed data for files (folios should already exist)
  const fileData = [
    {
      name: 'Research & Innovation',
      folioNumber: 'KeNHA/03.E/R&I/VOL.1',
      description: 'Comprehensive collection of research proposals, innovation projects, and technological advancements in infrastructure development. Includes groundbreaking studies on sustainable construction methods, smart city initiatives, and cutting-edge transportation solutions that drive Kenya\'s infrastructure forward.',
      createdBy: 'Kelvin Mwangi'
    },
    {
      name: 'Knowledge Management',
      folioNumber: 'KeNHA/03.E/KM/VOL.1',
      description: 'Centralized repository of institutional knowledge, best practices, policies, and procedures for efficient information management and organizational learning. Features comprehensive documentation of operational excellence, quality management systems, and knowledge sharing frameworks that enhance organizational performance.',
      createdBy: 'Kelvin Mwangi'
    },
    {
      name: 'Business Development',
      folioNumber: 'KeNHA/03.E/BD/VOL.1',
      description: 'Strategic business development initiatives, partnership frameworks, and market expansion strategies. Contains detailed business plans, stakeholder engagement models, and growth strategies that drive sustainable business development and long-term organizational success in the infrastructure sector.',
      createdBy: 'Kelvin Mwangi'
    }
  ]

  for (const fileInfo of fileData) {
    console.log(`📁 Processing: ${fileInfo.name}`)

    // Find the existing folio
    const folio = await prisma.folio.findFirst({
      where: { item: fileInfo.folioNumber }
    })

    if (!folio) {
      console.log(`  ❌ Folio not found: ${fileInfo.folioNumber}`)
      console.log(`  ⏭️  Skipping file creation for: ${fileInfo.name}`)
      continue
    }

    // Check if file already exists
    const existingFile = await prisma.file.findFirst({
      where: {
        name: fileInfo.name,
        folioId: folio.id
      }
    })

    if (existingFile) {
      console.log(`  ⏭️  File already exists: ${fileInfo.name}`)
      continue
    }

    // Create the file
    const file = await prisma.file.create({
      data: {
        name: fileInfo.name,
        description: fileInfo.description,
        createdBy: fileInfo.createdBy,
        folioId: folio.id
      }
    })

    console.log(`  ✅ Created file: ${file.name} (ID: ${file.id})`)
  }

  console.log('🎉 File seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })