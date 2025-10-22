import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import CreateFileModal from '../components/CreateFileModal'
import { Beaker, BookOpen, Award, FileText, Plus } from 'lucide-react'
import { gsap } from 'gsap'
import { toast } from 'react-toastify'
import { apiUrl } from '../lib/api'

function HomePage() {
  const navigate = useNavigate()
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const [showFileModal, setShowFileModal] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

    // Fetch files data
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(apiUrl('/api/files'))

      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }

      const result = await response.json()
      setFiles(result.data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      setError(error.message)
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file) => {
    // Navigate to folios page with the file's folio as filter
    navigate('/folios', { state: { selectedFolio: file.folio.item } })
  }

  const handleCreateFile = async (fileData) => {
    try {
      const response = await fetch(apiUrl('/api/files'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create file');
      }

      const result = await response.json();
      console.log('File created:', result.data);
      toast.success('File created successfully!');
    } catch (error) {
      console.error('File creation error:', error);
      toast.error(error.message || 'Error creating file. Please try again.');
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
            Browse your files below. Our system provides comprehensive tools for organizing,
            tracking, and maintaining your important documents.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                title=""
                description=""
                icon={<FileText className="w-8 h-8" />}
                delay={index * 0.1}
                isLoading={true}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading files: {error}</p>
            <button
              onClick={fetchFiles}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No files found. Create your first file!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {files.map((file, index) => (
              <Card
                key={file.id}
                title={file.name}
                description={file.description || 'No description available'}
                icon={<FileText className="w-8 h-8" />}
                delay={index * 0.1}
                onClick={() => handleFileSelect(file)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-gray-600">Create new files or browse existing ones</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowFileModal(true)}
            className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-6 h-6" />
            <span>Create New File</span>
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