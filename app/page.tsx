'use client'

import { useState } from 'react'
import './styles/carousel-brochure.css'
import TopNavigation from '@/components/TopNavigation'
import PageContent from '@/components/PageContent'

export default function HomePage() {
  const [selectedAge, setSelectedAge] = useState<'mini' | 'explorer'>('mini')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleAgeGroupChange = (ageGroup: 'mini' | 'explorer') => {
    if (ageGroup !== selectedAge) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedAge(ageGroup)
        setIsTransitioning(false)
      }, 300)
    }
  }

  return (
    <>
      <TopNavigation onAgeGroupSelect={handleAgeGroupChange} />
      <main className={`brochure-container ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Slide 1: Title Page */}
        <section className="slide slide-1">
          <div className="background-layer">
            <img src="/references/backgrounds/1.jpg" alt="Phuket coastline" />
          </div>
          <div className="content-wrapper">
            <div className="logo-container">
              <img src="/references/Logo Only.png" alt="The Waldorf Phuket Logo" className="logo-image" />
              <span className="logo-text">The Waldorf Phuket</span>
            </div>
            <h1 className="hero-title">
              <span>SUMMER</span>
              <span>CAMP</span>
            </h1>
          </div>
        </section>

        {/* Page content that changes based on selection */}
        <div className="page-content">
          <PageContent ageGroup={selectedAge} />
        </div>

        {/* Slide 40: Every Summer Memory (shown for both) */}
        <section className="slide slide-40">
          <div className="background-layer">
            <img src="/references/backgrounds/40.jpg" alt="Big Buddha Phuket aerial view" />
            <div className="background-overlay"></div>
          </div>
          
          <div className="content-wrapper">
            <div className="centered-content">
              <h2 className="closing-title">Every Summer,<br/>A Thousand Memories<br/>Are Waiting to Be Made</h2>
            </div>
          </div>
        </section>
        
        {/* Slide 41: Contact (shown for both) */}
        <section className="slide slide-contact" id="contact-section">
          <div className="background-layer">
            <img src="/references/backgrounds/41.jpg" alt="Camp facility" />
            <div className="background-overlay dark"></div>
          </div>
          
          <div className="contact-content">
            <h2>CONTACT US</h2>
            <div className="contact-info">
              <div className="contact-item">
                <span className="icon">📍</span>
                <p>255 Soi Cherngtalay 6, Choeng Thale,<br/>Thalang District, Phuket 83110</p>
              </div>
              <div className="contact-item">
                <span className="icon">📱</span>
                <p>+66 98 912 4218</p>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <p>info@waldorfphuket.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}