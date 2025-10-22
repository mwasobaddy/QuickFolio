import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FolioTable from '../components/FolioTable'
import Breadcrumb from '../components/Breadcrumb'
import { apiUrl } from '../lib/api'
import { toast } from 'react-toastify'
import { ArrowLeft } from 'lucide-react'
import { FileText, FolderOpen } from 'lucide-react'

function FoliosPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [folios, setFolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFileId, setSelectedFileId] = useState(null)

  const [selectedFileName, setSelectedFileName] = useState('')

  // Check for selected file from navigation state
  useEffect(() => {
    if (location.state?.selectedFileId) {
      setSelectedFileId(location.state.selectedFileId)
      // Find the file name from the folios data
      const file = folios.find(folio => folio.fileId === location.state.selectedFileId)?.file
      if (file) {
        setSelectedFileName(file.name)
      }
    }
  }, [location.state, folios])

  const fetchFolios = async () => {
    try {
      const response = await fetch(apiUrl('/api/folios'))
      const data = await response.json()
      setFolios(data.data || [])
    } catch (error) {
      console.error('Error fetching folios:', error)
      toast.error('Error loading folios. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditFolio = (folio) => {
    // Navigate to edit folio page
    navigate('/create-folio', { state: { initialData: folio } });
  }

  const handleDeleteFolio = async (id) => {
    try {
      const response = await fetch(apiUrl(`/api/folios?id=${id}`), {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchFolios() // Refresh the list
        toast.success('Folio deleted successfully!')
      } else {
        toast.error('Error deleting folio')
      }
    } catch (error) {
      console.error('Error deleting folio:', error)
      toast.error('Error deleting folio. Please try again.')
    }
  }

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'research-innovation':
        return 'Research & Innovation'
      case 'knowledge-management':
        return 'Knowledge Management'
      case 'nacosti':
        return 'NACOSTI'
      default:
        return 'All Folios'
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pb-16 py-8">
        <Breadcrumb
          items={
            selectedFileId && selectedFileName
              ? [
                  {
                    label: 'Files',
                    icon: FolderOpen,
                    onClick: () => navigate('/')
                  },
                  {
                    label: selectedFileName,
                    icon: FileText,
                    onClick: () => navigate('/folios', { state: { selectedFileId } })
                  },
                  {
                    label: 'Folios',
                    icon: FileText
                  }
                ]
              : [
                  {
                    label: 'Folios',
                    icon: FileText,
                    onClick: () => navigate('/')
                  }
                ]
          }
        />

        <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
            <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
            </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
            {selectedFileId ? 'Folios in File' : 'All Folios'}
            </h1>
            <p className="text-gray-600">
            {selectedFileId
                ? 'Managing folios within the selected file'
                : 'Manage your folios and letters'
            }
            </p>
        </div>

        <FolioTable
            folios={selectedFileId ? folios.filter(folio => folio.fileId === selectedFileId) : folios}
            loading={false}
            onDelete={handleDeleteFolio}
            onCreateClick={() => navigate('/create-folio')}
            onEditClick={handleEditFolio}
        />
        </div>
    </>
  )
}

export default FoliosPage