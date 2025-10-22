import { useState, useEffect, useRef } from 'react'
import { FileText, Plus, Eye, Menu, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { gsap } from 'gsap'

function Sidebar({ onCreateClick }) {
  const [open, setOpen] = useState(false)
  const sidebarRef = useRef(null)
  const overlayRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (open) {
      // Animate sidebar in
      gsap.set(sidebarRef.current, { x: -256 })
      gsap.to(sidebarRef.current, { x: 0, duration: 0.3, ease: 'power2.out' })
      // Animate overlay in
      gsap.set(overlayRef.current, { opacity: 0 })
      gsap.to(overlayRef.current, { opacity: 0.3, duration: 0.3 })
      // Stagger animate buttons
      gsap.fromTo('.sidebar-button', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, delay: 0.2 })
    } else {
      // Animate sidebar out
      gsap.to(sidebarRef.current, { x: -256, duration: 0.3, ease: 'power2.in' })
      // Animate overlay out
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 })
    }
  }, [open])

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col relative">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">QuickFolio</h2>
        </div>
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-900"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-6 flex-1">
        <div className="px-3 space-y-2">
          <button
            onClick={() => {
              setOpen(false)
              toast.info('Viewing folios...')
            }}
            className={`sidebar-button w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors bg-blue-50 text-blue-700 border-r-2 border-blue-700`}
          >
            <Eye className="h-5 w-5" />
            <span className="font-medium">View Folios</span>
          </button>

          <button
            onClick={() => {
              onCreateClick()
              setOpen(false)
              toast.info('Opening create folio form...')
            }}
            className={`sidebar-button w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Create Folio</span>
          </button>
        </div>
      </nav>

      <div className="mt-auto w-full p-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h3>
          <button
            onClick={() => {
              onCreateClick()
              setOpen(false)
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

  return (
    <>
      {/* Hamburger menu icon for mobile */}
      <button
        ref={menuRef}
        className="md:hidden fixed top-4 left-4 z-40 bg-white rounded-full p-2 shadow-lg focus:outline-none"
        onClick={() => {
          gsap.to(menuRef.current, { rotation: 180, duration: 0.2, ease: 'power2.inOut', yoyo: true, repeat: 1 })
          setOpen(true)
        }}
        aria-label="Open sidebar"
      >
        <Menu className="h-7 w-7 text-blue-700" />
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden md:block h-full">
        {sidebarContent}
      </div>

      {/* Sidebar drawer and overlay for mobile */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30"
        onClick={() => setOpen(false)}
        style={{ opacity: 0 }}
      ></div>
      {/* Slide-in sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full z-40 w-64"
        style={{ transform: 'translateX(-256px)' }}
      >
        {sidebarContent}
      </div>
    </>
  )
}

export default Sidebar