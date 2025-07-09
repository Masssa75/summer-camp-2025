'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ExpandableImageProps {
  src: string
  alt: string
  className?: string
}

export default function ExpandableImage({ src, alt, className = '' }: ExpandableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    setIsExpanded(true)
    document.body.style.overflow = 'hidden'
  }

  const handleClose = () => {
    setIsExpanded(false)
    document.body.style.overflow = 'unset'
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer transition-transform hover:scale-105`}
        onClick={handleClick}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {isExpanded && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
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
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
            aria-label="Close image"
            style={{ zIndex: 10000 }}
          >
            <X size={24} />
          </button>
          
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          />
        </div>,
        document.body
      )}
    </>
  )
}