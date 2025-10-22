import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import CreateFileModal from '../components/CreateFileModal'
import { Beaker, BookOpen, Award, FileText, Plus, Upload } from 'lucide-react'
import { gsap } from 'gsap'
import { toast } from 'react-toastify'

function HomePage() {
  const navigate = useNavigate()
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const [showFileModal, setShowFileModal] = useState(false)

  useEffect(() => {
    // Animate title and subtitle
    const tl = gsap.timeline()

    tl.fromTo(titleRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
  }, [])

  const handleCategorySelect = (category) => {
    // Navigate to folios page with category filter
    navigate('/folios', { state: { selectedCategory: category } })
  }

  const handleCreateFile = async (fileData) => {
    try {
      // Here you would typically send the file data to your API
      // For now, we'll just show a success message
      console.log('File data:', fileData)
      toast.success('File uploaded successfully!')

      // In a real implementation, you would:
      // const response = await fetch('/api/files', {
      //   method: 'POST',
      //   body: fileData
      // })

    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Error uploading file. Please try again.')
    }
  }

  const categories = [
    {
      id: 'research-innovation',
      title: 'Research & Innovation',
      description: 'Manage research proposals, innovation projects, and scientific documentation for groundbreaking discoveries and technological advancements.',
      icon: <Beaker className="w-8 h-8" />,
      delay: 0.2
    },
    {
      id: 'knowledge-management',
      title: 'Knowledge Management',
      description: 'Organize institutional knowledge, best practices, policies, and procedures for efficient information management and sharing.',
      icon: <BookOpen className="w-8 h-8" />,
      delay: 0.4
    },
    {
      id: 'nacosti',
      title: 'NACOSTI',
      description: 'Handle National Commission for Science, Technology and Innovation documents, compliance reports, and regulatory filings.',
      icon: <Award className="w-8 h-8" />,
      delay: 0.6
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div ref={titleRef} className="mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuickFolio
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamlined Document Management System
          </p>
        </div>

        <div ref={subtitleRef} className="mb-12">
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Choose a category below to manage your documents efficiently. Our system provides
            comprehensive tools for organizing, tracking, and maintaining your important files.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon}
              delay={category.delay}
              onClick={() => handleCategorySelect(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-gray-600">Upload files directly or browse by category</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowFileModal(true)}
            className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Upload className="w-6 h-6" />
            <span>Upload New File</span>
          </button>
        </div>
      </div>
    </div>

    {/* File Upload Modal */}
    <CreateFileModal
      isOpen={showFileModal}
      onClose={() => setShowFileModal(false)}
      onSubmit={handleCreateFile}
    />
    </>
  )
}

export default HomePage