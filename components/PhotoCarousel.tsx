'use client'

import { useState, useEffect, useRef } from 'react'
import { GlobalGalleryImage } from './GlobalImageGallery'

interface Photo {
  src: string
  alt: string
}

interface PhotoCarouselProps {
  photos: Photo[]
  className?: string
}

export default function PhotoCarousel({ photos, className = '' }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth > 768 ? 640 : 440 // Responsive card width
      const scrollAmount = index * cardWidth
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
    setActiveIndex(index)
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const cardWidth = window.innerWidth > 768 ? 640 : 440 // Responsive card width
      const newIndex = Math.round(scrollPosition / cardWidth)
      setActiveIndex(Math.min(Math.max(0, newIndex), photos.length - 1))
    }
  }

  return (
    <div className={`photo-carousel ${className}`}>
      <div 
        ref={carouselRef}
        className="carousel-wrapper"
        onScroll={handleScroll}
      >
        {photos.map((photo, index) => (
          <div key={index} className="story-card">
            <div className="card-image">
              <GlobalGalleryImage src={photo.src} alt={photo.alt} />
            </div>
          </div>
        ))}
      </div>
      
      {photos.length > 1 && (
        <div className="navigation-dots">
          {photos.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToCard(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}