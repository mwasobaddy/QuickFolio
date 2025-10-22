import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, FileText, User, Calendar, Save } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import { apiUrl } from '../lib/api'
import { gsap } from 'gsap'
import { FolderOpen, Plus } from 'lucide-react'

function CreateFilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mainContentRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    createdBy: ''
  })
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [errors, setErrors] = useState({})
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
    // No data fetching needed, so set loading to false immediately
    setPageLoading(false)
  }, [location.state])

  // GSAP animation for content fade-in
  useEffect(() => {
    if (!pageLoading && mainContentRef.current) {
      gsap.fromTo(mainContentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    }
  }, [pageLoading])

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

  // Skeleton loader component for form
  const FormSkeleton = () => (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-16 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div>
              <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Form fields skeleton */}
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className={`w-full ${i === 1 ? 'h-20' : 'h-10'} bg-gray-200 rounded animate-pulse`}></div>
              </div>
            ))}

            {/* Timestamps Info Skeleton */}
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Actions skeleton */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Basic validation
      const newErrors = {}
      if (!formData.name.trim()) newErrors.name = 'File name is required'
      if (!formData.createdBy.trim()) newErrors.createdBy = 'Created by is required'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

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
      navigate('/files');
    } catch (error) {
      console.error('File submission error:', error)
      toast.error(error.message || `Error ${isEdit ? 'updating' : 'creating'} file. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return pageLoading ? (
    <FormSkeleton />
  ) : (
    <div ref={mainContentRef} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-16 py-8">
        <Breadcrumb
          items={[
            {
              label: 'Files',
              icon: FolderOpen,
              onClick: () => navigate('/')
            },
            {
              label: isEdit ? 'Edit File' : 'Create File',
              icon: Plus
            }
          ]}
        />

        {/* Header */}
        <div className="mb-8">
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
                onChange={handleChange}
                placeholder="Enter file name"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 ${
                  errors.createdBy ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.createdBy && <p className="mt-1 text-sm text-red-600">{errors.createdBy}</p>}
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