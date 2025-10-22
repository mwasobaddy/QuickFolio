import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, FileText, Hash, User, Calendar, Save } from 'lucide-react'
import { apiUrl } from '../lib/api'

function CreateFolioPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    item: '',
    runningNo: '',
    description: '',
    draftedBy: '',
    letterDate: '',
    fileId: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [files, setFiles] = useState([])

  useEffect(() => {
    // Check if we're editing an existing folio
    const initialData = location.state?.initialData
    if (initialData) {
      setIsEdit(true)
      setFormData({
        item: initialData.item || '',
        runningNo: initialData.runningNo || '',
        description: initialData.description || '',
        draftedBy: initialData.draftedBy || '',
        letterDate: initialData.letterDate ? new Date(initialData.letterDate).toISOString().split('T')[0] : '',
        fileId: initialData.fileId || ''
      })
    }
  }, [location.state])

  useEffect(() => {
    // Fetch files for the dropdown
    const fetchFiles = async () => {
      try {
        const response = await fetch(apiUrl('/api/files'))
        if (response.ok) {
          const data = await response.json()
          setFiles(data)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
    fetchFiles()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Basic validation
      const newErrors = {}
      if (!formData.item.trim()) newErrors.item = 'Folio number is required'
      if (!formData.runningNo.trim()) newErrors.runningNo = 'Running number is required'
      if (!formData.draftedBy.trim()) newErrors.draftedBy = 'Drafted by is required'
      if (!formData.letterDate) newErrors.letterDate = 'Letter date is required'
      if (!formData.fileId) newErrors.fileId = 'File selection is required'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        letterDate: new Date(formData.letterDate).toISOString()
      }

      if (isEdit && location.state?.initialData?.id) {
        submitData.id = location.state.initialData.id;
      }

      const response = await fetch(apiUrl(isEdit && submitData.id ? `/api/folios?id=${submitData.id}` : '/api/folios'), {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} folio`);
      }

      const result = await response.json();
      toast.success(`Folio ${isEdit ? 'updated' : 'created'} successfully!`);

      // Navigate back to folios page
      navigate('/folios');
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(error.message || `Error ${isEdit ? 'updating' : 'creating'} folio. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/folios')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Folios</span>
          </button>

          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Edit Folio' : 'Create New Folio'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Update the folio information below' : 'Fill in the details to create a new folio'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Folio Number */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>Folio Number *</span>
              </label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                placeholder="e.g., KeNHA/05/GEN/Vol.7/0673"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                  errors.item ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.item && <p className="mt-1 text-sm text-red-600">{errors.item}</p>}
            </div>

            {/* Running Number */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Hash className="h-4 w-4" />
                <span>Running Number *</span>
              </label>
              <input
                type="text"
                name="runningNo"
                value={formData.runningNo}
                onChange={handleChange}
                placeholder="e.g., 0673"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                  errors.runningNo ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.runningNo && <p className="mt-1 text-sm text-red-600">{errors.runningNo}</p>}
            </div>

            {/* File Selection */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>File *</span>
              </label>
              <select
                name="fileId"
                value={formData.fileId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fileId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select a file</option>
                {files.map(file => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
              {errors.fileId && <p className="mt-1 text-sm text-red-600">{errors.fileId}</p>}
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
                onChange={handleChange}
                rows={3}
                placeholder="Optional description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 resize-none"
                disabled={loading}
              />
            </div>

            {/* Drafted By */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                <span>Drafted By *</span>
              </label>
              <input
                type="text"
                name="draftedBy"
                value={formData.draftedBy}
                onChange={handleChange}
                placeholder="Name of the person who drafted"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                  errors.draftedBy ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.draftedBy && <p className="mt-1 text-sm text-red-600">{errors.draftedBy}</p>}
            </div>

            {/* Letter Date */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Letter Date *</span>
              </label>
              <input
                type="date"
                name="letterDate"
                value={formData.letterDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                  errors.letterDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.letterDate && <p className="mt-1 text-sm text-red-600">{errors.letterDate}</p>}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/folios')}
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
                <span>{loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Folio' : 'Create Folio')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateFolioPage