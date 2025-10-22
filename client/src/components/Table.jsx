import { useState, useEffect, useRef } from 'react'
import { ChevronUp, ChevronDown, Download, Trash2 } from 'lucide-react'
import { gsap } from 'gsap'
import { toast } from 'react-toastify'

function Table({ 
  columns, 
  data, 
  loading, 
  onDelete, 
  onExport,
  enableSelection = true,
  enableSort = true,
  enableExport = true,
  emptyMessage = 'No data available',
  emptyDescription = 'Get started by adding some data.'
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [sortedData, setSortedData] = useState([])
  const tableRef = useRef(null)

  useEffect(() => {
    // Sort data when sortConfig or data changes
    if (data && data.length > 0) {
      let sorted = [...data]
      if (sortConfig.key && enableSort) {
        sorted.sort((a, b) => {
          const aValue = a[sortConfig.key]
          const bValue = b[sortConfig.key]
          
          if (aValue === null || aValue === undefined) return 1
          if (bValue === null || bValue === undefined) return -1
          
          if (typeof aValue === 'string') {
            return sortConfig.direction === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          
          return sortConfig.direction === 'asc'
            ? aValue < bValue ? -1 : 1
            : aValue > bValue ? -1 : 1
        })
      }
      setSortedData(sorted)
    } else {
      setSortedData([])
    }
  }, [data, sortConfig, enableSort])

  useEffect(() => {
    if (!loading && sortedData.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr')
      gsap.fromTo(rows, 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      )
    }
  }, [sortedData, loading])

  const handleSort = (key) => {
    if (!enableSort) return
    
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(sortedData.map(item => item.id)))
    }
  }

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) {
      toast.warning('Please select rows to delete')
      return
    }
    
    if (confirm(`Are you sure you want to delete ${selectedRows.size} item(s)?`)) {
      onDelete(Array.from(selectedRows))
      setSelectedRows(new Set())
      toast.success(`${selectedRows.size} item(s) deleted successfully`)
    }
  }

  const handleExport = () => {
    const dataToExport = selectedRows.size > 0 
      ? sortedData.filter(item => selectedRows.has(item.id))
      : sortedData
    
    if (onExport) {
      onExport(dataToExport)
    } else {
      // Default CSV export
      const headers = columns.map(col => col.label).join(',')
      const rows = dataToExport.map(item => 
        columns.map(col => {
          const value = col.accessor ? col.accessor(item) : item[col.key]
          return `"${value || ''}"`
        }).join(',')
      )
      const csv = [headers, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${Date.now()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    }
  }

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {enableSelection && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </td>
      )}
      {columns.map((col, idx) => (
        <td key={idx} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  )

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
                {enableSelection && (
                  <th className="px-6 py-3 text-left">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
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
      {/* Action Bar */}
      {(enableSelection && selectedRows.size > 0) && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedRows.size} item(s) selected
            </span>
            <div className="flex space-x-2">
              {enableExport && (
                <button
                  onClick={handleExport}
                  className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              )}
              <button
                onClick={handleDeleteSelected}
                className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-100 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {sortedData.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
              <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
            <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
          </div>
        ) : (
          <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {enableSelection && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === sortedData.length && sortedData.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      col.sortable !== false && enableSort ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                    }`}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {col.sortable !== false && enableSort && (
                        <span className="flex flex-col">
                          {sortConfig.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="h-4 w-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-blue-600" />
                            )
                          ) : (
                            <span className="text-gray-400">
                              <ChevronUp className="h-3 w-3 -mb-1" />
                              <ChevronDown className="h-3 w-3" />
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {enableSelection && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={col.className || "px-6 py-4 whitespace-nowrap text-sm text-gray-900"}>
                      {col.render ? col.render(row) : col.accessor ? col.accessor(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {sortedData.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing {sortedData.length} item{sortedData.length !== 1 ? 's' : ''}
          </p>
          {enableExport && selectedRows.size === 0 && (
            <button
              onClick={handleExport}
              className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center space-x-1 text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export All</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Table
