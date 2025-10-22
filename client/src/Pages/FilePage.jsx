import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FileTable from '../components/FileTable'
import { toast } from 'react-toastify'
import { apiUrl } from '../lib/api'

function FilePage() {
  const navigate = useNavigate()
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
    // Navigate to edit file page
    navigate('/create-file', { state: { initialData: file } });
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
                onCreateClick={() => navigate('/create-file')}
                onEditClick={handleEditFile}
                onViewClick={handleViewFile}
            />
            )}
        </div>
      </div>
    </>
  )
}

export default FilePage