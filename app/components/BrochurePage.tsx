'use client'

import { useState, useEffect } from 'react'

export default function BrochurePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 41

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
      } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Main slide container with aspect ratio */}
      <div className="w-full max-w-6xl">
        <div className="relative bg-white shadow-2xl" style={{ aspectRatio: '16/9' }}>
          <img
            src={`/images/presentation/${currentPage}.jpg`}
            alt={`Slide ${currentPage}`}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="text-white text-lg">
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
        
        {/* Quick navigation */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {[1, 5, 10, 15, 20, 25, 30, 35, 40].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <div className="mt-4 text-center text-gray-400 text-sm">
          Use arrow keys ← → to navigate
        </div>
      </div>
    </div>
  )
}