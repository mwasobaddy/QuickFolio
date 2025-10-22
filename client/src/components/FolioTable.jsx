import { Trash2, Plus, Edit } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState, useMemo } from 'react'
import Table from './Table'
import AdvancedSearchFilter from './AdvancedSearchFilter'
import DeleteModal from './DeleteModal'

function FolioTable({ folios, loading, onDelete, onCreateClick, onEditClick }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, type: 'single' })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateForCSV = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    // Format as MM/DD/YYYY which Excel recognizes as dates
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${month}/${day}/${year}`
  }

  // Filter and search logic
  const filteredFolios = useMemo(() => {
    if (!folios) return []

    let filtered = [...folios]

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(folio =>
        folio.item?.toLowerCase().includes(term) ||
        folio.runningNo?.toLowerCase().includes(term) ||
        folio.description?.toLowerCase().includes(term) ||
        folio.draftedBy?.toLowerCase().includes(term)
      )
    }

    // Apply advanced filters
    if (filters.folioNumber) {
      filtered = filtered.filter(folio =>
        folio.item?.toLowerCase().includes(filters.folioNumber.toLowerCase())
      )
    }

    if (filters.runningNo) {
      filtered = filtered.filter(folio =>
        folio.runningNo?.toLowerCase().includes(filters.runningNo.toLowerCase())
      )
    }

    if (filters.description) {
      filtered = filtered.filter(folio =>
        folio.description?.toLowerCase().includes(filters.description.toLowerCase())
      )
    }

    if (filters.draftedBy) {
      filtered = filtered.filter(folio =>
        folio.draftedBy?.toLowerCase().includes(filters.draftedBy.toLowerCase())
      )
    }

    // Date filters
    if (filters.letterDateFrom) {
      const fromDate = new Date(filters.letterDateFrom)
      filtered = filtered.filter(folio =>
        new Date(folio.letterDate) >= fromDate
      )
    }

    if (filters.letterDateTo) {
      const toDate = new Date(filters.letterDateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(folio =>
        new Date(folio.letterDate) <= toDate
      )
    }

    if (filters.createdFrom) {
      const fromDate = new Date(filters.createdFrom)
      filtered = filtered.filter(folio =>
        new Date(folio.createdAt) >= fromDate
      )
    }

    if (filters.createdTo) {
      const toDate = new Date(filters.createdTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(folio =>
        new Date(folio.createdAt) <= toDate
      )
    }

    return filtered
  }, [folios, searchTerm, filters])

  const handleDelete = async (ids) => {
    setDeleteLoading(true)
    try {
      // Handle single or multiple deletes
      if (Array.isArray(ids)) {
        await Promise.all(ids.map(id => onDelete(id)))
      } else {
        await onDelete(ids)
      }
    } finally {
      setDeleteLoading(false)
      setDeleteModal({ isOpen: false, item: null, type: 'single' })
    }
  }

  const openDeleteModal = (item, type = 'single') => {
    setDeleteModal({ isOpen: true, item, type })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, item: null, type: 'single' })
  }

  const confirmDelete = async () => {
    if (deleteModal.item) {
      if (deleteModal.type === 'multiple' && Array.isArray(deleteModal.item)) {
        await handleDelete(deleteModal.item)
      } else {
        await handleDelete(deleteModal.item.id)
      }
    }
  }

  const handleBulkDelete = (ids) => {
    openDeleteModal(ids, 'multiple')
  }

  const handleExport = async (data) => {
    setExportLoading(true)
    try {
      // Simulate async operation for better UX (even though export is fast)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Custom export function for folios
      const headers = 'Folio Number,Running No,Description,Drafted By,Letter Date,Created\n'
      const rows = data.map(folio => 
        `"${folio.item}","${folio.runningNo}","${folio.description || ''}","${folio.draftedBy}","${formatDateForCSV(folio.letterDate)}","${formatDateForCSV(folio.createdAt)}"`
      ).join('\n')
      
      const csv = headers + rows
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `folios-export-${Date.now()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Folios exported successfully')
    } finally {
      setExportLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const SkeletonRow = () => (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </td>
    </tr>
  )

  const columns = [
    {
      key: 'item',
      label: 'Folio Number',
      sortable: true,
      className: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'
    },
    {
      key: 'runningNo',
      label: 'Running_No',
      sortable: true,
      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      className: 'px-6 py-4 text-sm text-gray-500 max-w-xs truncate',
      accessor: (row) => row.description || '-'
    },
    {
      key: 'draftedBy',
      label: 'Drafted_By',
      sortable: true,
      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
    },
    {
      key: 'letterDate',
      label: 'Letter_Date',
      sortable: true,
      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      accessor: (row) => formatDate(row.letterDate)
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
      accessor: (row) => formatDate(row.createdAt)
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEditClick(row)}
            disabled={deleteLoading || exportLoading}
            className={`p-1 transition-colors ${
              deleteLoading || exportLoading 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:text-blue-900'
            }`}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              openDeleteModal(row, 'single')
            }}
            disabled={deleteLoading || exportLoading}
            className={`p-1 transition-colors ${
              deleteLoading || exportLoading 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:text-red-900'
            }`}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  if (loading || deleteLoading || exportLoading) {
    return (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Folio Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Running No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drafted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letter Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Folios</h2>
          <button
            onClick={() => {
              onCreateClick()
            }}
            disabled={deleteLoading || exportLoading}
            className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
              deleteLoading || exportLoading
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>New Folio</span>
          </button>
        </div>
      </div>

      <AdvancedSearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filters}
      />

      <Table
        columns={columns}
        data={filteredFolios}
        loading={loading || deleteLoading || exportLoading}
        onDelete={handleDelete}
        onExport={handleExport}
        onBulkDelete={handleBulkDelete}
        enableSelection={true}
        enableSort={true}
        enableExport={true}
        emptyMessage="No folios"
        emptyDescription="Get started by creating a new folio."
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={deleteModal.type === 'multiple' ? "Delete Folios" : "Delete Folio"}
        message={
          deleteModal.type === 'multiple' && Array.isArray(deleteModal.item)
            ? `Are you sure you want to delete ${deleteModal.item.length} folio(s)? This action cannot be undone.`
            : `Are you sure you want to delete folio "${deleteModal.item?.item}"? This action cannot be undone.`
        }
        confirmText={deleteModal.type === 'multiple' ? "Delete Folios" : "Delete Folio"}
        variant="danger"
      />
    </div>
  )
}

export default FolioTable