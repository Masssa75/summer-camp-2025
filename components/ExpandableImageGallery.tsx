'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryContextType {
  images: { src: string; alt: string }[]
  currentIndex: number
  openGallery: (index: number) => void
  closeGallery: () => void
  isOpen: boolean
}

const GalleryContext = createContext<GalleryContextType | null>(null)

export function useGallery() {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider')
  }
  return context
}

interface GalleryProviderProps {
  images: { src: string; alt: string }[]
  children: React.ReactNode
}

export function GalleryProvider({ images, children }: GalleryProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const openGallery = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeGallery = () => {
    setIsOpen(false)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeThreshold = 50
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return
    
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
        goToNext()
        break
      case 'Escape':
        closeGallery()
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeGallery()
    }
  }

  return (
    <GalleryContext.Provider value={{ images, currentIndex, openGallery, closeGallery, isOpen }}>
      {children}
      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={handleOverlayClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999
          }}
        >
          {/* Close button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-10"
            aria-label="Close gallery"
            style={{ zIndex: 10000 }}
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              aria-label="Previous image"
              style={{ zIndex: 10000 }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              aria-label="Next image"
              style={{ zIndex: 10000 }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image */}
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-full max-h-full object-contain"
            style={{ maxWidth: '90vw', maxHeight: '90vh', userSelect: 'none' }}
            draggable={false}
          />

          {/* Image counter */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1 text-sm"
              style={{ zIndex: 10000 }}
            >
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>,
        document.body
      )}
    </GalleryContext.Provider>
  )
}

interface GalleryImageProps {
  index: number
  src: string
  alt: string
  className?: string
}

export function GalleryImage({ index, src, alt, className = '' }: GalleryImageProps) {
  const { openGallery } = useGallery()

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} cursor-pointer transition-transform hover:scale-105`}
      onClick={() => openGallery(index)}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}