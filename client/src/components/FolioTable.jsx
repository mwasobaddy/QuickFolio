import { Trash2, Plus, Edit } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState, useMemo } from 'react'
import Table from './Table'
import AdvancedSearchFilter from './AdvancedSearchFilter'

function FolioTable({ folios, loading, onDelete, onCreateClick }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  const handleDelete = (ids) => {
    // Handle single or multiple deletes
    if (Array.isArray(ids)) {
      ids.forEach(id => onDelete(id))
    } else {
      onDelete(ids)
    }
  }

  const handleExport = (data) => {
    // Custom export function for folios
    const headers = 'Folio Number,Running No,Description,Drafted By,Letter Date,Created\n'
    const rows = data.map(folio => 
      `"${folio.item}","${folio.runningNo}","${folio.description || ''}","${folio.draftedBy}","${formatDate(folio.letterDate)}","${formatDate(folio.createdAt)}"`
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
      label: 'Running No',
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
      label: 'Drafted By',
      sortable: true,
      className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
    },
    {
      key: 'letterDate',
      label: 'Letter Date',
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
            onClick={() => toast.info('Edit functionality coming soon!')}
            className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Are you sure you want to delete this folio?')) {
                onDelete(row.id)
              }
            }}
            className="text-red-600 hover:text-red-900 p-1 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  if (loading) {
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
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
        loading={loading}
        onDelete={handleDelete}
        onExport={handleExport}
        enableSelection={true}
        enableSort={true}
        enableExport={true}
        emptyMessage="No folios"
        emptyDescription="Get started by creating a new folio."
      />
    </div>
  )
}

export default FolioTable