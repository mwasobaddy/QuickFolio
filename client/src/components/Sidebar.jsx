import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, FolderOpen, Menu, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { gsap } from 'gsap'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const sidebarRef = useRef(null)
  const overlayRef = useRef(null)
  const menuRef = useRef(null)
  const desktopSidebarRef = useRef(null)

  useEffect(() => {
    if (open) {
      // Animate sidebar in
      gsap.set(sidebarRef.current, { x: -256 })
      gsap.to(sidebarRef.current, { x: 0, duration: 0.3, ease: 'power2.out' })
      // Animate overlay in
      gsap.set(overlayRef.current, { opacity: 0 })
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 })
      // Stagger animate buttons
      gsap.fromTo('.sidebar-button', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, delay: 0.2 })
    } else {
      // Animate sidebar out
      gsap.to(sidebarRef.current, { x: -256, duration: 0.3, ease: 'power2.in' })
      // Animate overlay out
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
    }
  }, [open])

  // Animate desktop sidebar collapse/expand
  useEffect(() => {
    if (desktopSidebarRef.current) {
      gsap.to(desktopSidebarRef.current, {
        width: collapsed ? 80 : 256,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    }
  }, [collapsed])

  // Helper function to check if route is active
  const isActive = (path) => location.pathname === path

  // Helper function to check if main menu should be highlighted
  const isMainMenuActive = (mainPath, subPaths = []) => {
    if (location.pathname === mainPath) return true
    return subPaths.some(subPath => location.pathname === subPath)
  }

  // Sidebar content as a function for reuse
  const sidebarContent = (isMobile = false) => (
    <div className={`bg-white shadow-lg h-full flex flex-col relative ${isMobile ? 'w-64' : ''}`}>
      <div className={`p-6 ${collapsed && !isMobile ? 'px-4' : ''}`}>
        <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'space-x-2'}`}>
          <FileText className={`text-blue-600 ${collapsed && !isMobile ? 'h-8 w-8' : 'h-8 w-8'}`} />
          {(!collapsed || isMobile) && <h2 className="text-xl font-bold text-gray-900">QuickFolio</h2>}
        </div>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        {/* Collapse/Expand button for desktop */}
        {!isMobile && (
          <button
            className="hidden md:block absolute top-4 -right-6 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md p-1 transition-colors z-[1]"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-8 w-8" /> : <ChevronLeft className="h-8 w-8" />}
          </button>
        )}
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <div className={`px-3 space-y-2 ${collapsed && !isMobile ? 'px-2' : ''}`}>
          {/* Files Section */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setOpen(false)
                navigate('/')
              }}
              className={`sidebar-button w-full flex items-center ${collapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-full text-left transition-colors ${
                isMainMenuActive('/', ['/create-file']) 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed && !isMobile ? 'px-2' : ''}`}
              title={collapsed && !isMobile ? "Files" : ""}
            >
              <FolderOpen className="h-5 w-5 flex-shrink-0" />
              {(!collapsed || isMobile) && <span className="font-medium">Files</span>}
            </button>
            
            {/* Create File submenu - only show when expanded */}
            {(!collapsed || isMobile) && (
              <>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/')
                  }}
                  className={`sidebar-button w-full flex items-center space-x-3 px-3 py-2 ml-6 rounded-full text-left transition-colors ${
                    isActive('/')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">All Files</span>
                </button>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/create-file')
                  }}
                  className={`sidebar-button w-full flex items-center space-x-3 px-3 py-2 ml-6 rounded-full text-left transition-colors ${
                    isActive('/create-file')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Create File</span>
                </button>
              </>
            )}
          </div>

          {/* Folios Section */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setOpen(false)
                navigate('/folios')
              }}
              className={`sidebar-button w-full flex items-center ${collapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-full text-left transition-colors ${
                isMainMenuActive('/folios', ['/create-folio'])
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed && !isMobile ? 'px-2' : ''}`}
              title={collapsed && !isMobile ? "Folio" : ""}
            >
              <FileText className="h-5 w-5 flex-shrink-0" />
              {(!collapsed || isMobile) && <span className="font-medium">Folio</span>}
            </button>
            
            {/* Create Folio submenu - only show when expanded */}
            {(!collapsed || isMobile) && (
              <>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/folios')
                  }}
                  className={`sidebar-button w-full flex items-center space-x-3 px-3 py-2 ml-6 rounded-full text-left transition-colors ${
                    isActive('/folios')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">All Folios</span>
                </button>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/create-folio')
                  }}
                  className={`sidebar-button w-full flex items-center space-x-3 px-3 py-2 ml-6 rounded-full text-left transition-colors ${
                    isActive('/create-folio')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Create Folio</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className={`mt-auto w-full p-4 ${collapsed && !isMobile ? 'p-2' : ''}`}>
        {(!collapsed || isMobile) ? (
          <div className="bg-blue-50 rounded-full p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h3>
            <button
              onClick={() => {
                setOpen(false)
                navigate('/create-folio')
              }}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + New Folio
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setOpen(false)
              navigate('/create-folio')
            }}
            className="w-full bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
            title="New Folio"
          >
            <FileText className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sticky header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">QuickFolio</h1>
          </div>
          <button
            ref={menuRef}
            className="bg-blue-50 rounded-full p-2 focus:outline-none hover:bg-blue-100 transition-colors"
            onClick={() => {
              gsap.to(menuRef.current, { rotation: 180, duration: 0.2, ease: 'power2.inOut', yoyo: true, repeat: 1 })
              setOpen(true)
            }}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6 text-blue-700" />
          </button>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div ref={desktopSidebarRef} className="hidden md:block h-full transition-all duration-300" style={{ width: collapsed ? '80px' : '256px' }}>
        {sidebarContent(false)}
      </div>

      {/* Sidebar drawer and overlay for mobile */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/10 backdrop-blur-xs z-30 ${open ? 'block' : 'hidden'}`}
        onClick={() => setOpen(false)}
        style={{ opacity: 0 }}
      ></div>
      {/* Slide-in sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full z-40 w-64"
        style={{ transform: 'translateX(-256px)' }}
      >
        {sidebarContent(true)}
      </div>
    </>
  )
}

export default Sidebar