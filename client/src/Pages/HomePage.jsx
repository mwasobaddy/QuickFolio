import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FileTable from '../components/FileTable'
import CreateFileModal from '../components/CreateFileModal'
import { toast } from 'react-toastify'
import { apiUrl } from '../lib/api'

function HomePage() {
  const navigate = useNavigate()
  const [showFileModal, setShowFileModal] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
    // Navigate to folios page with the file id to show folios belonging to this file
    navigate('/folios', { state: { selectedFileId: file.id } })
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
      // Refresh the files list
      fetchFiles();
    } catch (error) {
      console.error('File creation error:', error);
      toast.error(error.message || 'Error creating file. Please try again.');
    }
  }

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(apiUrl(`/api/files?id=${fileId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }

      toast.success('File deleted successfully!');
      // Refresh the files list
      fetchFiles();
    } catch (error) {
      console.error('File deletion error:', error);
      toast.error(error.message || 'Error deleting file. Please try again.');
    }
  }

  const handleEditFile = (file) => {
    // For now, just show a toast. You can implement edit modal later
    toast.info(`Edit functionality for "${file.name}" coming soon!`);
  }

  const handleViewFile = (file) => {
    // Navigate to folios page with the file's folio as filter
    handleFileSelect(file);
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Files</h1>
            <p className="text-gray-600">Manage your files and documents</p>
        </div>

        {/* Files Table Section */}
        <div>
            {error ? (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading files: {error}</p>
                <button
                onClick={fetchFiles}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                Try Again
                </button>
            </div>
            ) : (
            <FileTable
                files={files}
                loading={loading}
                onDelete={handleDeleteFile}
                onCreateClick={() => setShowFileModal(true)}
                onEditClick={handleEditFile}
                onViewClick={handleViewFile}
            />
            )}
        </div>

        {/* File Upload Modal */}
        <CreateFileModal
            isOpen={showFileModal}
            onClose={() => setShowFileModal(false)}
            onSubmit={handleCreateFile}
        />
      </div>
    </>
  )
}

export default HomePage