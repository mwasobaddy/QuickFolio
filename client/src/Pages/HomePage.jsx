import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { apiUrl } from '../lib/api'
import { gsap } from 'gsap'
import {
  FileText,
  FolderOpen,
  Plus,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react'

function HomePage() {
  const navigate = useNavigate()
  const mainContentRef = useRef(null)
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolios: 0,
    recentFiles: [],
    recentFolios: [],
    monthlyGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // GSAP animation for content fade-in
  useEffect(() => {
    if (!loading && mainContentRef.current) {
      gsap.fromTo(mainContentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    }
  }, [loading])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch files and folios in parallel
      const [filesResponse, foliosResponse] = await Promise.all([
        fetch(apiUrl('/api/files')),
        fetch(apiUrl('/api/folios'))
      ])

      if (!filesResponse.ok || !foliosResponse.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const filesResult = await filesResponse.json()
      const foliosResult = await foliosResponse.json()

      const files = filesResult.data || []
      const folios = foliosResult.data || []

      // Calculate stats
      const totalFiles = files.length
      const totalFolios = folios.length

      // Get recent files (last 5)
      const recentFiles = files
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      // Get recent folios (last 5)
      const recentFolios = folios
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      // Calculate monthly growth (simplified - just showing recent activity)
      const thisMonthFolios = folios.filter(folio => {
        const folioDate = new Date(folio.createdAt)
        const now = new Date()
        return folioDate.getMonth() === now.getMonth() &&
               folioDate.getFullYear() === now.getFullYear()
      }).length

      setStats({
        totalFiles,
        totalFolios,
        recentFiles,
        recentFolios,
        monthlyGrowth: thisMonthFolios
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error.message)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300 text-left w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  )

  // Skeleton loader component for dashboard content
  const DashboardSkeleton = () => (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-80 animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return loading ? (
    <DashboardSkeleton />
  ) : (
    <div ref={mainContentRef} className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your QuickFolio system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Files"
          value={stats.totalFiles}
          icon={FolderOpen}
          color="bg-blue-500"
          trend={`${stats.monthlyGrowth} this month`}
        />
        <StatCard
          title="Total Folios"
          value={stats.totalFolios}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Active Files"
          value={stats.recentFiles.length}
          icon={BarChart3}
          color="bg-purple-500"
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentFolios.length}
          icon={Calendar}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            title="Create New File"
            description="Add a new file to organize your folios"
            icon={Plus}
            onClick={() => navigate('/files/create')}
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Create New Folio"
            description="Add a new folio to an existing file"
            icon={FileText}
            onClick={() => navigate('/folios/create')}
            color="bg-green-500"
          />
          <QuickActionCard
            title="View All Files"
            description="Browse and manage all your files"
            icon={FolderOpen}
            onClick={() => navigate('/files')}
            color="bg-purple-500"
          />
          <QuickActionCard
            title="View All Folios"
            description="Browse and manage all your folios"
            icon={BarChart3}
            onClick={() => navigate('/folios')}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Files */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Files</h2>
            <button
              onClick={() => navigate('/files')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {stats.recentFiles.length > 0 ? (
            <div className="space-y-3">
              {stats.recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => navigate('/folios', { state: { selectedFileId: file.id } })}
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {file.folios?.length || 0} folios • Created {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No files yet. Create your first file to get started!</p>
          )}
        </div>

        {/* Recent Folios */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Folios</h2>
            <button
              onClick={() => navigate('/folios')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {stats.recentFolios.length > 0 ? (
            <div className="space-y-3">
              {stats.recentFolios.map((folio) => (
                <div
                  key={folio.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => navigate('/folios', { state: { selectedFileId: folio.fileId } })}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{folio.item}</p>
                      <p className="text-sm text-gray-600">
                        {folio.file?.name} • {folio.runningNo} • Created {new Date(folio.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No folios yet. Create your first folio to get started!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage