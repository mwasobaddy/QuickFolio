import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Seed data for files with their corresponding folios
  const fileData = [
    {
      name: 'Research & Innovation',
      folioNumber: 'KeNHA/03.E/R&I/VOL.1',
      description: 'Comprehensive collection of research proposals, innovation projects, and technological advancements in infrastructure development. Includes groundbreaking studies on sustainable construction methods, smart city initiatives, and cutting-edge transportation solutions that drive Kenya\'s infrastructure forward.',
      createdBy: 'Kelvin Mwangi',
      folioDetails: {
        runningNo: '001',
        description: 'Research and Innovation portfolio for infrastructure development projects',
        draftedBy: 'Kelvin Mwangi',
        letterDate: new Date('2024-01-15')
      }
    },
    {
      name: 'Knowledge Management',
      folioNumber: 'KeNHA/03.E/KM/VOL.1',
      description: 'Centralized repository of institutional knowledge, best practices, policies, and procedures for efficient information management and organizational learning. Features comprehensive documentation of operational excellence, quality management systems, and knowledge sharing frameworks that enhance organizational performance.',
      createdBy: 'Kelvin Mwangi',
      folioDetails: {
        runningNo: '002',
        description: 'Knowledge Management system for organizational learning and best practices',
        draftedBy: 'Kelvin Mwangi',
        letterDate: new Date('2024-02-01')
      }
    },
    {
      name: 'Business Development',
      folioNumber: 'KeNHA/03.E/BD/VOL.1',
      description: 'Strategic business development initiatives, partnership frameworks, and market expansion strategies. Contains detailed business plans, stakeholder engagement models, and growth strategies that drive sustainable business development and long-term organizational success in the infrastructure sector.',
      createdBy: 'Kelvin Mwangi',
      folioDetails: {
        runningNo: '003',
        description: 'Business Development strategies and partnership frameworks',
        draftedBy: 'Kelvin Mwangi',
        letterDate: new Date('2024-02-15')
      }
    }
  ]

  for (const fileInfo of fileData) {
    console.log(`📁 Processing: ${fileInfo.name}`)

    // Create or find the folio
    let folio = await prisma.folio.findFirst({
      where: { item: fileInfo.folioNumber }
    })

    if (!folio) {
      console.log(`  📋 Creating folio: ${fileInfo.folioNumber}`)
      folio = await prisma.folio.create({
        data: {
          item: fileInfo.folioNumber,
          runningNo: fileInfo.folioDetails.runningNo,
          description: fileInfo.folioDetails.description,
          draftedBy: fileInfo.folioDetails.draftedBy,
          letterDate: fileInfo.folioDetails.letterDate
        }
      })
    } else {
      console.log(`  📋 Folio already exists: ${fileInfo.folioNumber}`)
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

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })