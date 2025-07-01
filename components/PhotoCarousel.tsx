'use client'

import { useState, useEffect, useRef } from 'react'

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
      const cards = carouselRef.current.querySelectorAll('.story-card')
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
    setActiveIndex(index)
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const cardWidth = 400 + 40 // card width + gap
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
              <img src={photo.src} alt={photo.alt} />
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