import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // First, create the files
  console.log('📁 Creating files...')

  const fileData = [
    {
      name: 'Research & Innovation',
      description: 'Comprehensive collection of research proposals, innovation projects, and technological advancements in infrastructure development. Includes groundbreaking studies on sustainable construction methods, smart city initiatives, and cutting-edge transportation solutions that drive Kenya\'s infrastructure forward.',
      createdBy: 'Kelvin Mwangi'
    },
    {
      name: 'Knowledge Management',
      description: 'Centralized repository of institutional knowledge, best practices, policies, and procedures for efficient information management and organizational learning. Features comprehensive documentation of operational excellence, quality management systems, and knowledge sharing frameworks that enhance organizational performance.',
      createdBy: 'Kelvin Mwangi'
    },
    {
      name: 'Business Development',
      description: 'Strategic business development initiatives, partnership frameworks, and market expansion strategies. Contains detailed business plans, stakeholder engagement models, and growth strategies that drive sustainable business development and long-term organizational success in the infrastructure sector.',
      createdBy: 'Kelvin Mwangi'
    }
  ]

  const createdFiles = []

  for (const fileInfo of fileData) {
    console.log(`📁 Creating file: ${fileInfo.name}`)

    const file = await prisma.file.create({
      data: {
        name: fileInfo.name,
        description: fileInfo.description,
        createdBy: fileInfo.createdBy
      }
    })

    createdFiles.push(file)
    console.log(`  ✅ Created file: ${file.name} (ID: ${file.id})`)
  }

  // Now create folios for each file
  console.log('📄 Creating folios...')

  const researchFolios = [
    { item: 'KeNHA/03.E/R&I/001', runningNo: '001', description: 'Sustainable Construction Methods Research', draftedBy: 'Dr. Sarah Johnson' },
    { item: 'KeNHA/03.E/R&I/002', runningNo: '002', description: 'Smart City Infrastructure Planning', draftedBy: 'Eng. Michael Chen' },
    { item: 'KeNHA/03.E/R&I/003', runningNo: '003', description: 'Transportation Solutions Study', draftedBy: 'Prof. David Kim' },
    { item: 'KeNHA/03.E/R&I/004', runningNo: '004', description: 'Green Energy Integration Proposal', draftedBy: 'Dr. Emily Rodriguez' },
    { item: 'KeNHA/03.E/R&I/005', runningNo: '005', description: 'Digital Infrastructure Mapping', draftedBy: 'Eng. James Wilson' },
    { item: 'KeNHA/03.E/R&I/006', runningNo: '006', description: 'Climate Resilience Assessment', draftedBy: 'Dr. Lisa Thompson' },
    { item: 'KeNHA/03.E/R&I/007', runningNo: '007', description: 'Urban Development Innovation', draftedBy: 'Prof. Robert Davis' },
    { item: 'KeNHA/03.E/R&I/008', runningNo: '008', description: 'Traffic Management Systems', draftedBy: 'Eng. Maria Garcia' },
    { item: 'KeNHA/03.E/R&I/009', runningNo: '009', description: 'Infrastructure Monitoring Tech', draftedBy: 'Dr. Ahmed Hassan' },
    { item: 'KeNHA/03.E/R&I/010', runningNo: '010', description: 'Future Mobility Solutions', draftedBy: 'Prof. Jennifer Lee' }
  ]

  const knowledgeFolios = [
    { item: 'KeNHA/03.E/KM/001', runningNo: '001', description: 'Operational Excellence Framework', draftedBy: 'Ms. Grace Oduya' },
    { item: 'KeNHA/03.E/KM/002', runningNo: '002', description: 'Quality Management Systems', draftedBy: 'Mr. Peter Ndungu' },
    { item: 'KeNHA/03.E/KM/003', runningNo: '003', description: 'Knowledge Sharing Protocols', draftedBy: 'Dr. Susan Wanjiku' },
    { item: 'KeNHA/03.E/KM/004', runningNo: '004', description: 'Institutional Learning Programs', draftedBy: 'Mr. David Kiprop' }
  ]

  const businessFolios = [
    { item: 'KeNHA/03.E/BD/001', runningNo: '001', description: 'Strategic Partnership Framework', draftedBy: 'Mr. Thomas Ochieng' },
    { item: 'KeNHA/03.E/BD/002', runningNo: '002', description: 'Market Expansion Strategy', draftedBy: 'Ms. Caroline Atieno' },
    { item: 'KeNHA/03.E/BD/003', runningNo: '003', description: 'Stakeholder Engagement Model', draftedBy: 'Dr. Samuel Kiprotich' },
    { item: 'KeNHA/03.E/BD/004', runningNo: '004', description: 'Business Development Roadmap', draftedBy: 'Ms. Faith Wairimu' },
    { item: 'KeNHA/03.E/BD/005', runningNo: '005', description: 'Investment Attraction Plan', draftedBy: 'Mr. George Odhiambo' },
    { item: 'KeNHA/03.E/BD/006', runningNo: '006', description: 'Sustainability Business Model', draftedBy: 'Dr. Hellen Cherono' }
  ]

  // Create folios for Research & Innovation (10 folios)
  const researchFile = createdFiles.find(f => f.name === 'Research & Innovation')
  if (researchFile) {
    console.log('📄 Creating Research & Innovation folios...')
    for (const folioData of researchFolios) {
      const folio = await prisma.folio.create({
        data: {
          item: folioData.item,
          runningNo: folioData.runningNo,
          description: folioData.description,
          draftedBy: folioData.draftedBy,
          letterDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
          fileId: researchFile.id
        }
      })
      console.log(`  ✅ Created folio: ${folio.item}`)
    }
  }

  // Create folios for Knowledge Management (4 folios)
  const knowledgeFile = createdFiles.find(f => f.name === 'Knowledge Management')
  if (knowledgeFile) {
    console.log('📄 Creating Knowledge Management folios...')
    for (const folioData of knowledgeFolios) {
      const folio = await prisma.folio.create({
        data: {
          item: folioData.item,
          runningNo: folioData.runningNo,
          description: folioData.description,
          draftedBy: folioData.draftedBy,
          letterDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
          fileId: knowledgeFile.id
        }
      })
      console.log(`  ✅ Created folio: ${folio.item}`)
    }
  }

  // Create folios for Business Development (6 folios)
  const businessFile = createdFiles.find(f => f.name === 'Business Development')
  if (businessFile) {
    console.log('📄 Creating Business Development folios...')
    for (const folioData of businessFolios) {
      const folio = await prisma.folio.create({
        data: {
          item: folioData.item,
          runningNo: folioData.runningNo,
          description: folioData.description,
          draftedBy: folioData.draftedBy,
          letterDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
          fileId: businessFile.id
        }
      })
      console.log(`  ✅ Created folio: ${folio.item}`)
    }
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Files created: ${createdFiles.length}`)
  console.log(`   - Research folios: ${researchFolios.length}`)
  console.log(`   - Knowledge folios: ${knowledgeFolios.length}`)
  console.log(`   - Business folios: ${businessFolios.length}`)
  console.log(`   - Total folios: ${researchFolios.length + knowledgeFolios.length + businessFolios.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })