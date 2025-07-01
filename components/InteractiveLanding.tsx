'use client'

import { useState, useEffect } from 'react'
import { Palette, Tent, Calendar, Phone, FileEdit } from 'lucide-react'

interface InteractiveLandingProps {
  onAgeGroupSelect?: (ageGroup: 'mini' | 'explorer') => void
}

export default function InteractiveLanding({ onAgeGroupSelect }: InteractiveLandingProps) {
  const [selectedAge, setSelectedAge] = useState<'mini' | 'explorer'>('mini')
  const [showBottomNav, setShowBottomNav] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('mini')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      
      // Show bottom nav when scrolled past 20% of viewport height
      if (scrollTop > windowHeight * 0.2) {
        setShowBottomNav(true)
      } else {
        setShowBottomNav(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAgeSelect = (ageGroup: 'mini' | 'explorer') => {
    setSelectedAge(ageGroup)
    onAgeGroupSelect?.(ageGroup)
    
    // Scroll to appropriate section
    const targetId = ageGroup === 'mini' ? 'mini-section' : 'explorer-section'
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavClick = (section: string, e: React.MouseEvent) => {
    e.preventDefault()
    setActiveNavItem(section)
    
    // Scroll to appropriate section based on nav item
    let targetId = ''
    switch (section) {
      case 'mini':
        targetId = 'mini-section'
        break
      case 'explorer':
        targetId = 'explorer-section'
        break
      case 'schedule':
        targetId = 'schedule-section'
        break
      case 'contact':
        targetId = 'contact-section'
        break
      case 'register':
        // Handle registration
        console.log('Opening registration...')
        return
    }
    
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Age Toggle Switch */}
      <div className="age-toggle-container">
        <div className="age-toggle">
          <div className={`toggle-slider ${selectedAge === 'explorer' ? 'explorer' : ''}`}></div>
          <button 
            className={`toggle-option ${selectedAge === 'mini' ? 'active' : ''}`}
            onClick={() => handleAgeSelect('mini')}
          >
            <Palette size={16} />
            Mini (3-6)
          </button>
          <button 
            className={`toggle-option ${selectedAge === 'explorer' ? 'active' : ''}`}
            onClick={() => handleAgeSelect('explorer')}
          >
            <Tent size={16} />
            Explorer (7-13)
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <a href="#register" className="action-btn primary" onClick={(e) => handleNavClick('register', e)}>
          <FileEdit size={18} />
          Register Now
        </a>
        <a href="#contact" className="action-btn secondary" onClick={(e) => handleNavClick('contact', e)}>
          <Phone size={18} />
          Contact Us
        </a>
      </div>

      {/* Sticky Bottom Navigation */}
      <nav className={`sticky-bottom-nav ${showBottomNav ? 'visible' : ''}`}>
        <a 
          href="#mini" 
          className={`bottom-nav-item ${activeNavItem === 'mini' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('mini', e)}
        >
          <Palette size={18} />
          <span>Mini</span>
        </a>
        <a 
          href="#explorer" 
          className={`bottom-nav-item ${activeNavItem === 'explorer' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('explorer', e)}
        >
          <Tent size={18} />
          <span>Explorer</span>
        </a>
        <a 
          href="#schedule" 
          className={`bottom-nav-item ${activeNavItem === 'schedule' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('schedule', e)}
        >
          <Calendar size={18} />
          <span>Schedule</span>
        </a>
        <a 
          href="#contact" 
          className={`bottom-nav-item ${activeNavItem === 'contact' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('contact', e)}
        >
          <Phone size={18} />
          <span>Contact</span>
        </a>
        <a 
          href="#register" 
          className={`bottom-nav-item ${activeNavItem === 'register' ? 'active' : ''}`}
          onClick={(e) => handleNavClick('register', e)}
        >
          <FileEdit size={18} />
          <span>Register</span>
        </a>
      </nav>
    </>
  )
}