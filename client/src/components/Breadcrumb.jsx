import { ChevronRight, Home } from 'lucide-react'

function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 bg-white px-4 py-3 rounded-lg shadow">
      {/* Home breadcrumb - always present */}
      <button
        onClick={items[0]?.onClick}
        className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Render additional breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              {item.icon && <item.icon className="w-4 h-4" />}
              <span className="text-gray-900 font-medium">{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb