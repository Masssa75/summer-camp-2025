'use client'

import { useState } from 'react'
import './styles/carousel-brochure.css'
import TopNavigation from '@/components/TopNavigation'
import PageContent from '@/components/PageContent'
import IsolatedInstagramEmbed from '@/components/IsolatedInstagramEmbed'
import { MapPin, Phone, Mail } from 'lucide-react'

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
        {/* Slide 1: Title Page with Video */}
        <section className="slide slide-1">
          <div className="background-layer">
            <img src="/references/backgrounds/1.jpg" alt="Phuket coastline" />
          </div>
          <div className="content-wrapper hero-with-video">
            <div className="hero-left">
              <div className="logo-container">
                <img src="/references/Logo Only.png" alt="The Waldorf Phuket Logo" className="logo-image" />
                <span className="logo-text">The Waldorf Phuket</span>
              </div>
              <h1 className="hero-title">
                <span>SUMMER</span>
                <span>CAMP</span>
              </h1>
            </div>
            <div className="hero-video">
              <IsolatedInstagramEmbed />
            </div>
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
          
          <div className="content-wrapper">
            <div className="contact-container">
              <h2 className="contact-title">CONTACT US</h2>
              
              <div className="contact-layout">
                <div className="contact-info-section">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <MapPin size={24} />
                    </div>
                    <div className="contact-details">
                      <h3>Location</h3>
                      <p>255 Soi Cherngtalay 6, Choeng Thale,<br/>Thalang District, Phuket 83110</p>
                    </div>
                  </div>
                  
                  <a href="tel:+66989124218" className="contact-item contact-link">
                    <div className="contact-icon">
                      <Phone size={24} />
                    </div>
                    <div className="contact-details">
                      <h3>Phone</h3>
                      <p>+66 98 912 4218</p>
                    </div>
                  </a>
                  
                  <a href="mailto:info@waldorfphuket.com" className="contact-item contact-link">
                    <div className="contact-icon">
                      <Mail size={24} />
                    </div>
                    <div className="contact-details">
                      <h3>Email</h3>
                      <p>info@waldorfphuket.com</p>
                    </div>
                  </a>
                </div>
                
                <div className="map-section">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.1876!2d98.3066155!3d7.9881462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x305037d692c8e82b%3A0x9d66d629c16cb3c6!2sThe%20Waldorf%20Phuket!5e0!3m2!1sen!2sth!4v1701234567890!5m2!1sen!2sth"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}