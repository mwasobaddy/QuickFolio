import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function Card({ title, description, icon, onClick, delay = 0, isLoading = false }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: delay,
          ease: 'back.out(1.7)'
        }
      )
    }
  }, [delay])

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      y: -10,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  return (
    <div
      ref={cardRef}
      onClick={isLoading ? undefined : onClick}
      onMouseEnter={isLoading ? undefined : handleMouseEnter}
      onMouseLeave={isLoading ? undefined : handleMouseLeave}
      className={`bg-white rounded-xl shadow-lg p-8 transition-all duration-300 border border-gray-100 ${
        isLoading ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl group'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full text-white transition-transform duration-300 ${
          isLoading 
            ? 'bg-gray-200 animate-pulse' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110'
        }`}>
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          ) : (
            icon
          )}
        </div>

        <div className="space-y-2 w-full">
          {isLoading ? (
            <>
              <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6 mx-auto"></div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </>
          )}
        </div>

        {!isLoading && (
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="text-sm font-medium">Select File</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card