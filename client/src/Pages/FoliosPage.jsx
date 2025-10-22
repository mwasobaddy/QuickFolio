import { useState, useEffect } from 'react'
import FolioTable from '../components/FolioTable'
import CreateFolioModal from '../components/CreateFolioModal'
import { apiUrl } from '../lib/api'
import { toast } from 'react-toastify'

function FoliosPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFolio, setEditingFolio] = useState(null)
  const [folios, setFolios] = useState([])
  const [loading, setLoading] = useState(true)

  // Listen for create modal events from sidebar
  useEffect(() => {
    const handleOpenCreateModal = () => {
      setShowCreateModal(true)
    }

    window.addEventListener('openCreateModal', handleOpenCreateModal)
    return () => window.removeEventListener('openCreateModal', handleOpenCreateModal)
  }, [])

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

  const handleSubmitFolio = async (folioData) => {
    try {
      const isEdit = !!editingFolio
      const url = isEdit ? apiUrl(`/api/folios?id=${editingFolio.id}`) : apiUrl('/api/folios')
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folioData),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setEditingFolio(null)
        fetchFolios() // Refresh the list
        toast.success(`Folio ${isEdit ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        toast.error(`Error ${isEdit ? 'updating' : 'creating'} folio: ${error.error}`)
      }
    } catch (error) {
      console.error(`Error ${editingFolio ? 'updating' : 'creating'} folio:`, error)
      toast.error(`Error ${editingFolio ? 'updating' : 'creating'} folio. Please try again.`)
    }
  }

  const handleEditFolio = (folio) => {
    setEditingFolio(folio)
    setShowCreateModal(true)
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">QuickFolio</h1>
        <p className="text-gray-600">Manage your folios and letters</p>
      </div>

      <FolioTable
        folios={folios}
        loading={false}
        onDelete={handleDeleteFolio}
        onCreateClick={() => setShowCreateModal(true)}
        onEditClick={handleEditFolio}
      />

      {showCreateModal && (
        <CreateFolioModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setEditingFolio(null)
          }}
          onSubmit={handleSubmitFolio}
          initialData={editingFolio}
          isEdit={!!editingFolio}
        />
      )}
    </>
  )
}

export default FoliosPage