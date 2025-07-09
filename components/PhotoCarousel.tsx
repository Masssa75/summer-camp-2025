'use client'

import { useState, useEffect, useRef } from 'react'
import { GalleryProvider, GalleryImage } from './ExpandableImageGallery'

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
      const scrollAmount = index * 440 // card width (400) + margin (40)
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
      const cardWidth = 440 // card width + margin
      const newIndex = Math.round(scrollPosition / cardWidth)
      setActiveIndex(Math.min(Math.max(0, newIndex), photos.length - 1))
    }
  }

  return (
    <GalleryProvider images={photos}>
      <div className={`photo-carousel ${className}`}>
        <div 
          ref={carouselRef}
          className="carousel-wrapper"
          onScroll={handleScroll}
        >
          {photos.map((photo, index) => (
            <div key={index} className="story-card">
              <div className="card-image">
                <GalleryImage index={index} src={photo.src} alt={photo.alt} />
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
    </GalleryProvider>
  )
}