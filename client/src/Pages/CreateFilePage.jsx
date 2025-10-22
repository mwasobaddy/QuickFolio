import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, FileText, User, Calendar, Save } from 'lucide-react'
import { apiUrl } from '../lib/api'

function CreateFilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    createdBy: ''
  })
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    // Check if we're editing an existing file
    const initialData = location.state?.initialData
    if (initialData) {
      setIsEdit(true)
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        createdBy: initialData.createdBy || ''
      })
    }
  }, [location.state])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('File name is required')
      return
    }

    if (!formData.createdBy.trim()) {
      toast.error('Created by is required')
      return
    }

    setLoading(true)

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        createdBy: formData.createdBy.trim(),
      };

      if (isEdit && location.state?.initialData?.id) {
        submitData.id = location.state.initialData.id;
      }

      const response = await fetch(apiUrl('/api/files'), {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} file`);
      }

      const result = await response.json();
      toast.success(`File ${isEdit ? 'updated' : 'created'} successfully!`);

      // Navigate back to files page
      navigate('/');
    } catch (error) {
      console.error('File submission error:', error)
      toast.error(error.message || `Error ${isEdit ? 'updating' : 'creating'} file. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Files</span>
          </button>

          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Edit File' : 'Create New File'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Update the file information below' : 'Fill in the details to create a new file'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>File Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter file name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter file description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 resize-none"
                disabled={loading}
              />
            </div>

            {/* Created By */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                <span>Created By *</span>
              </label>
              <input
                type="text"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                disabled={loading}
              />
            </div>

            {/* Timestamps Info */}
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Timestamps</span>
              </div>
              <p className="text-xs text-gray-500">
                ID will be auto-generated. Created and updated timestamps will be set automatically.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update File' : 'Create File')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateFilePage