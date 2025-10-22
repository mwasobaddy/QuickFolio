import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X, Calendar, User, FileText, Hash } from 'lucide-react'
import { gsap } from 'gsap'

// Debounce utility function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function AdvancedSearchFilter({ onSearch, onFilter, filters = {} }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    folioNumber: '',
    runningNo: '',
    description: '',
    draftedBy: '',
    letterDateFrom: '',
    letterDateTo: '',
    createdFrom: '',
    createdTo: '',
    ...filters
  })

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch && onSearch(term)
    }, 500),
    [onSearch]
  )

  useEffect(() => {
    if (searchTerm !== undefined) {
      debouncedSearch(searchTerm)
    }
  }, [searchTerm, debouncedSearch])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilter && onFilter(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      folioNumber: '',
      runningNo: '',
      description: '',
      draftedBy: '',
      letterDateFrom: '',
      letterDateTo: '',
      createdFrom: '',
      createdTo: ''
    }
    setLocalFilters(clearedFilters)
    onFilter && onFilter(clearedFilters)
  }

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
    
    // Animate the advanced filters section
    const advancedSection = document.querySelector('.advanced-filters')
    if (advancedSection) {
      if (!showAdvanced) {
        gsap.fromTo(advancedSection, 
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      } else {
        gsap.to(advancedSection, 
          { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }
        )
      }
    }
  }

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '')

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search folios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={toggleAdvanced}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              showAdvanced 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {Object.values(localFilters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        <div 
          className={`advanced-filters overflow-hidden ${showAdvanced ? '' : 'h-0 opacity-0'}`}
          style={{ height: showAdvanced ? 'auto' : 0 }}
        >
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Folio Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folio Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contains..."
                    value={localFilters.folioNumber}
                    onChange={(e) => handleFilterChange('folioNumber', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Running Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Running Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contains..."
                    value={localFilters.runningNo}
                    onChange={(e) => handleFilterChange('runningNo', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Drafted By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drafted By
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contains..."
                    value={localFilters.draftedBy}
                    onChange={(e) => handleFilterChange('draftedBy', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Contains..."
                  value={localFilters.description}
                  onChange={(e) => handleFilterChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Date Filters */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date Filters
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Letter Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Letter Date Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      placeholder="From"
                      value={localFilters.letterDateFrom}
                      onChange={(e) => handleFilterChange('letterDateFrom', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="date"
                      placeholder="To"
                      value={localFilters.letterDateTo}
                      onChange={(e) => handleFilterChange('letterDateTo', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Created Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created Date Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      placeholder="From"
                      value={localFilters.createdFrom}
                      onChange={(e) => handleFilterChange('createdFrom', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="date"
                      placeholder="To"
                      value={localFilters.createdTo}
                      onChange={(e) => handleFilterChange('createdTo', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchFilter