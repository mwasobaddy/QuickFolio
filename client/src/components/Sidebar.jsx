import { FileText, Plus, Eye } from 'lucide-react'
import { toast } from 'react-toastify'

function Sidebar({ activeView, onViewChange, onCreateClick }) {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">QuickFolio</h2>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3 space-y-2">
          <button
            onClick={() => {
              onViewChange('view')
              toast.info('Viewing folios...')
            }}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
              activeView === 'view'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Eye className="h-5 w-5" />
            <span className="font-medium">View Folios</span>
          </button>

          <button
            onClick={() => {
              onViewChange('create')
              onCreateClick()
              toast.info('Opening create folio form...')
            }}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
              activeView === 'create'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Create Folio</span>
          </button>
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h3>
          <button
            onClick={() => {
              onCreateClick()
              toast.info('Opening create folio form...')
            }}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + New Folio
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar