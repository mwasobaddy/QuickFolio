import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { X, Calendar, User, FileText, Hash } from 'lucide-react'
import { gsap } from 'gsap'

function CreateFolioModal({ isOpen, onClose, onSubmit, initialData = null, isEdit = false }) {
  const [formData, setFormData] = useState({
    item: '',
    runningNo: '',
    description: '',
    draftedBy: '',
    letterDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
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
        item: initialData.item || '',
        runningNo: initialData.runningNo || '',
        description: initialData.description || '',
        draftedBy: initialData.draftedBy || '',
        letterDate: initialData.letterDate ? new Date(initialData.letterDate).toISOString().split('T')[0] : ''
      })
    } else if (isOpen && !initialData) {
      // Reset form for new folio
      setFormData({
        item: '',
        runningNo: '',
        description: '',
        draftedBy: '',
        letterDate: ''
      })
    }
  }, [isOpen, initialData])

  // Skeleton loader component for form fields
  const SkeletonField = ({ className = "" }) => (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  )

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

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Convert letter date to ISO string
      const submitData = {
        ...formData,
        letterDate: new Date(formData.letterDate).toISOString()
      }

      await onSubmit(submitData)

      // Reset form
      setFormData({
        item: '',
        runningNo: '',
        description: '',
        draftedBy: '',
        letterDate: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('An unexpected error occurred. Please try again.')
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

  if (!isOpen) return null

  return (
    <div ref={overlayRef} className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Folio' : 'Create New Folio'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            // Skeleton loading state
            <>
              <SkeletonField />
              <SkeletonField />
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <SkeletonField />
              <SkeletonField />
              <div className="flex justify-end space-x-3 pt-4">
                <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-blue-200 rounded w-24 animate-pulse"></div>
              </div>
            </>
          ) : (
            // Normal form state
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folio Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="item"
                    value={formData.item}
                    onChange={handleChange}
                    placeholder="e.g., KeNHA/05/GEN/Vol.7/0673"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                      errors.item ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.item && <p className="mt-1 text-sm text-red-600">{errors.item}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Running Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="runningNo"
                    value={formData.runningNo}
                    onChange={handleChange}
                    placeholder="e.g., 0673"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                      errors.runningNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.runningNo && <p className="mt-1 text-sm text-red-600">{errors.runningNo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Optional description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drafted By <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="draftedBy"
                    value={formData.draftedBy}
                    onChange={handleChange}
                    placeholder="Name of the person who drafted"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                      errors.draftedBy ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.draftedBy && <p className="mt-1 text-sm text-red-600">{errors.draftedBy}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Letter Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="letterDate"
                    value={formData.letterDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 ${
                      errors.letterDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.letterDate && <p className="mt-1 text-sm text-red-600">{errors.letterDate}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Folio' : 'Create Folio')}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreateFolioModal