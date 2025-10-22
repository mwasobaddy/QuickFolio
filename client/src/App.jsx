import { useState, useEffect, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import FolioTable from './components/FolioTable'
import CreateFolioModal from './components/CreateFolioModal'
import { apiUrl } from './lib/api'
import './App.css'
import { gsap } from 'gsap'

function App() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [folios, setFolios] = useState([])
  const [loading, setLoading] = useState(true)
  const mainContentRef = useRef(null)

  // Fetch folios on component mount
  useEffect(() => {
    fetchFolios()
  }, [])

  useEffect(() => {
    if (!loading && mainContentRef.current) {
      gsap.fromTo(mainContentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    }
  }, [loading])

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

  const handleCreateFolio = async (folioData) => {
    try {
      const response = await fetch(apiUrl('/api/folios'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folioData),
      })

      if (response.ok) {
        setShowCreateModal(false)
        fetchFolios() // Refresh the list
        toast.success('Folio created successfully!')
      } else {
        const error = await response.json()
        toast.error(`Error creating folio: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating folio:', error)
      toast.error('Error creating folio. Please try again.')
    }
  }

  const handleDeleteFolio = async (id) => {
    if (!confirm('Are you sure you want to delete this folio?')) return

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

  // Skeleton loader component for main content
  const MainContentSkeleton = () => (
    <div className="flex-1 p-6 w-full overflow-x-auto">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      <Sidebar
        onCreateClick={() => setShowCreateModal(true)}
      />

      {loading ? (
        <MainContentSkeleton />
      ) : (
        <div ref={mainContentRef} className="flex-1 p-6 w-full overflow-x-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">QuickFolio</h1>
            <p className="text-gray-600">Manage your folios and letters</p>
          </div>

          <FolioTable
            folios={folios}
            loading={false}
            onDelete={handleDeleteFolio}
            onCreateClick={() => setShowCreateModal(true)}
          />
        </div>
      )}

      {showCreateModal && (
        <CreateFolioModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateFolio}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App
