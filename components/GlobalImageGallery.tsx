'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
}

interface GlobalGalleryContextType {
  images: GalleryImage[]
  registerImage: (image: GalleryImage) => number
  openGallery: (index: number) => void
  closeGallery: () => void
  isOpen: boolean
}

const GlobalGalleryContext = createContext<GlobalGalleryContextType | null>(null)

export function useGlobalGallery() {
  const context = useContext(GlobalGalleryContext)
  if (!context) {
    throw new Error('useGlobalGallery must be used within GlobalGalleryProvider')
  }
  return context
}

interface GlobalGalleryProviderProps {
  children: React.ReactNode
}

export function GlobalGalleryProvider({ children }: GlobalGalleryProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [images, setImages] = useState<GalleryImage[]>([])
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const imageRegistry = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    setMounted(true)
  }, [])

  const registerImage = (image: GalleryImage) => {
    // Check if already registered
    const existingIndex = imageRegistry.current.get(image.src)
    if (existingIndex !== undefined) {
      return existingIndex
    }

    // Register new image
    const newIndex = imageRegistry.current.size
    imageRegistry.current.set(image.src, newIndex)
    
    setImages(prev => {
      // Double check to prevent duplicates in case of concurrent calls
      if (prev.some(img => img.src === image.src)) {
        return prev
      }
      return [...prev, image]
    })
    
    return newIndex
  }

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
  }, [isOpen, images.length])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeGallery()
    }
  }

  return (
    <GlobalGalleryContext.Provider value={{ images, registerImage, openGallery, closeGallery, isOpen }}>
      {children}
      {isOpen && mounted && images.length > 0 && createPortal(
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
          {images[currentIndex] && (
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: '90vw', maxHeight: '90vh', userSelect: 'none' }}
              draggable={false}
            />
          )}

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
    </GlobalGalleryContext.Provider>
  )
}

interface GlobalGalleryImageProps {
  src: string
  alt: string
  className?: string
}

export function GlobalGalleryImage({ src, alt, className = '' }: GlobalGalleryImageProps) {
  const { registerImage, openGallery } = useGlobalGallery()
  const [imageIndex, setImageIndex] = useState<number>(-1)

  useEffect(() => {
    const index = registerImage({ src, alt })
    setImageIndex(index)
  }, [src, alt, registerImage])

  const handleClick = () => {
    if (imageIndex !== -1) {
      openGallery(imageIndex)
    }
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} cursor-pointer transition-transform hover:scale-105`}
      onClick={handleClick}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}