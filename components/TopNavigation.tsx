'use client'

import { useState } from 'react'
import { Palette, Tent, Calendar, Phone, FileEdit, MessageCircle, Shield } from 'lucide-react'

interface TopNavigationProps {
  onAgeGroupSelect?: (ageGroup: 'mini' | 'explorer') => void
}

export default function TopNavigation({ onAgeGroupSelect }: TopNavigationProps) {
  const [selectedAge, setSelectedAge] = useState<'mini' | 'explorer'>('mini')

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
    
    // Scroll to appropriate section based on nav item
    let targetId = ''
    switch (section) {
      case 'top':
        // If on registration page, go to home
        if (window.location.pathname === '/register') {
          window.location.href = '/'
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return
      case 'mini':
        targetId = 'mini-section'
        break
      case 'explorer':
        targetId = 'explorer-section'
        break
      case 'schedule':
        // Jump to the appropriate schedule based on selected age group
        targetId = selectedAge === 'mini' ? 'schedule-section' : 'explorer-schedule-section'
        break
      case 'contact':
        targetId = 'contact-section'
        break
      case 'register':
        // Navigate to registration page with appropriate age group
        window.location.href = `/register?group=${selectedAge}`
        return
      case 'whatsapp':
        window.open('https://wa.me/+66989124218', '_blank')
        return
      case 'admin':
        window.location.href = '/admin'
        return
    }
    
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="top-navigation">
      <div className="nav-container">
        {/* Logo */}
        <button className="nav-logo" onClick={(e) => handleNavClick('top', e)}>
          <img src="/references/Logo Only.png" alt="The Waldorf Phuket" />
        </button>
        
        {/* Age Group Selector */}
        <div className="nav-age-selector">
          <button 
            className={`nav-age-btn ${selectedAge === 'mini' ? 'active' : ''}`}
            onClick={() => handleAgeSelect('mini')}
          >
            <Palette size={14} />
            Mini (3-6)
          </button>
          <button 
            className={`nav-age-btn ${selectedAge === 'explorer' ? 'active' : ''}`}
            onClick={() => handleAgeSelect('explorer')}
          >
            <Tent size={14} />
            Explorer (7-13)
          </button>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <a href="#schedule" className="nav-link" onClick={(e) => handleNavClick('schedule', e)}>
            <Calendar size={14} />
            <span>Schedule</span>
          </a>
          <a href="#contact" className="nav-link" onClick={(e) => handleNavClick('contact', e)}>
            <Phone size={14} />
            <span>Contact</span>
          </a>
          <a href="#whatsapp" className="nav-link contact-link" onClick={(e) => handleNavClick('whatsapp', e)}>
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
          <a href="#register" className="nav-link register-btn" onClick={(e) => handleNavClick('register', e)}>
            <FileEdit size={14} />
            <span>Register</span>
          </a>
          <a href="#admin" className="nav-link" onClick={(e) => handleNavClick('admin', e)}>
            <Shield size={14} />
            <span>Admin</span>
          </a>
        </div>
      </div>
    </nav>
  )
}