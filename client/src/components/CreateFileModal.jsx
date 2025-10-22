import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { X, FileText, Hash, User, Calendar } from 'lucide-react'
import { gsap } from 'gsap'

function CreateFileModal({ isOpen, onClose, onSubmit, initialData = null, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    folioNumber: '',
    description: '',
    createdBy: ''
  })
  const [loading, setLoading] = useState(false)
  const modalRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      // Animate overlay
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      // Animate modal
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      )
    }

    // Populate form with initial data for editing
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        folioNumber: initialData.folioNumber || '',
        description: initialData.description || '',
        createdBy: initialData.createdBy || ''
      })
    } else if (isOpen && !initialData) {
      // Reset form for new file
      setFormData({
        name: '',
        folioNumber: '',
        description: '',
        createdBy: ''
      })
    }
  }, [isOpen, initialData])

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

    if (!formData.folioNumber.trim()) {
      toast.error('Folio number is required')
      return
    }

    if (!formData.createdBy.trim()) {
      toast.error('Created by is required')
      return
    }

    setLoading(true)

    try {
      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        folioNumber: formData.folioNumber.trim(),
        description: formData.description.trim(),
        createdBy: formData.createdBy.trim(),
      };

      if (isEdit && initialData?.id) {
        submitData.id = initialData.id;
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('File submission error:', error)
      toast.error(`Error ${isEdit ? 'updating' : 'creating'} file. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  // Skeleton loader component for form fields
  const SkeletonField = ({ className = "" }) => (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">
              {isEdit ? 'Edit File' : 'Create New File'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          {/* Folio Number */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="h-4 w-4" />
              <span>Folio Number *</span>
            </label>
            <input
              type="text"
              name="folioNumber"
              value={formData.folioNumber}
              onChange={handleInputChange}
              placeholder="e.g., KeNHA/05/GEN/Vol.7/0673"
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
          <div className="bg-gray-50 rounded-md p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Timestamps</span>
            </div>
            <p className="text-xs text-gray-500">
              ID will be auto-generated. Created and updated timestamps will be set automatically.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update File' : 'Create File')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFileModal
