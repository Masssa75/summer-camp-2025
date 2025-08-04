'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Shield, ChevronDown, ChevronRight, ExternalLink, Phone, Mail, Globe, MapPin, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import HamburgerMenu from '@/components/admin/HamburgerMenu'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface Contact {
  id: string
  name: string
  location: string
  priority: 'high' | 'medium' | 'low'
  category: 'university' | 'jobsite' | 'network' | 'school' | 'social'
  summary?: string
  website?: string
  email?: string
  phone?: string
  contact?: string
  keyPerson?: string
  groups?: string[]
  note?: string
  description: string
}

const contacts: Contact[] = [
  {
    id: 'rajabhat',
    name: 'Rajabhat University Phuket',
    location: 'Phuket',
    priority: 'high',
    category: 'university',
    summary: 'Local teacher training with progressive methods',
    contact: 'Early Childhood Education Department',
    phone: '076-211-959',
    website: 'http://pkru.ac.th',
    email: 'ece@pkru.ac.th',
    keyPerson: 'Head of Early Childhood Education Department',
    description: 'Local university training early childhood teachers with progressive methods. Graduates often stay in Phuket and seek innovative schools.'
  },
  {
    id: 'alliance',
    name: 'Alternative Education Alliance Thailand',
    location: 'Thailand-wide',
    priority: 'high',
    category: 'network',
    summary: 'Coalition of all alternative schools in Thailand',
    contact: 'Through member schools like Panyotai Waldorf',
    keyPerson: 'Contact conference organizers or Panyotai School for network access',
    description: 'Coalition of ALL alternative schools in Thailand. Annual gatherings where progressive teachers network and seek new positions.'
  },
  {
    id: 'act',
    name: 'Asian College of Teachers (ACT)',
    location: 'Bangkok',
    priority: 'high',
    category: 'university',
    summary: 'Trains 50,000+ teachers in alternative methods',
    website: 'https://asiancollegeofteachers.com',
    email: 'info@asiancollegeofteachers.com',
    phone: '+66 2 213 3939',
    keyPerson: 'Admissions Office for teacher placement partnerships',
    description: 'Trains 50,000+ teachers in Montessori and alternative methods. Fresh graduates seeking schools that match their progressive training.'
  },
  {
    id: 'facebook',
    name: 'Facebook Groups',
    location: 'Online',
    priority: 'high',
    category: 'social',
    summary: 'Active communities of alternative education teachers',
    groups: [
      'การศึกษาทางเลือก (Alternative Education Thailand)',
      'Waldorf Education Thailand',
      'Montessori Thailand Community'
    ],
    description: 'Active Thai teachers already believing in alternative education. Post about outdoor learning and discovering children\'s magic powers.'
  },
  {
    id: 'panyotai',
    name: 'Panyotai Waldorf School',
    location: 'Bangkok',
    priority: 'medium',
    category: 'school',
    summary: 'Thailand\'s first Waldorf school',
    website: 'https://panyotai.com',
    email: 'info@panyotai.com',
    phone: '02-885-2670',
    keyPerson: 'School Director or HR Department',
    description: 'Thailand\'s first Waldorf school. Experienced teachers who understand child development and may seek new adventures in Phuket.'
  },
  {
    id: 'montessori-foundation',
    name: 'Thai Montessori Foundation',
    location: 'Thailand',
    priority: 'medium',
    category: 'network',
    summary: 'National Montessori teacher network',
    contact: 'Through member schools',
    keyPerson: 'Conference organizers or established Montessori schools',
    email: 'thaimontessorifoundation@gmail.com',
    description: 'National Montessori network. Teachers here specifically interested in nature-based approaches to Montessori education.'
  },
  {
    id: 'eef',
    name: 'Equitable Education Fund (EEF)',
    location: 'Bangkok',
    priority: 'medium',
    category: 'network',
    summary: 'Government fund connecting innovative educators',
    website: 'https://www.eef.or.th',
    email: 'contact@eef.or.th',
    phone: '02-079-5475',
    description: 'Government fund connecting innovative educators. Their network includes teachers passionate about educational transformation.'
  },
  {
    id: 'ajarn',
    name: 'Ajarn.com',
    location: 'Online',
    priority: 'medium',
    category: 'jobsite',
    summary: 'Thailand\'s main teaching job board',
    website: 'https://www.ajarn.com',
    email: 'info@ajarn.com',
    description: 'Thailand\'s main teaching job site. Teachers browsing here often seek escape from traditional schools.'
  },
  {
    id: 'rainbow-montessori',
    name: 'Rainbow Montessori Phuket',
    location: 'Phuket (Competing School)',
    priority: 'low',
    category: 'school',
    summary: 'Local competing Montessori school',
    note: 'Competing Montessori school - unlikely to share teachers',
    description: 'Local Montessori school. While they won\'t help with recruitment, knowing their approach helps position your unique outdoor offering.'
  },
  {
    id: 'sunshine-village',
    name: 'Phuket Sunshine Village',
    location: 'Phuket (Competing School)',
    priority: 'low',
    category: 'school',
    summary: 'Local competing alternative school',
    note: 'Alternative school in Phuket - approach diplomatically',
    description: 'Another alternative school in Phuket. Unlikely to help with recruitment but worth understanding their approach.'
  },
  {
    id: 'green-school',
    name: 'Green School Bali Network',
    location: 'Bali, Indonesia',
    priority: 'low',
    category: 'school',
    summary: 'Nature-based school alumni network',
    website: 'https://www.greenschool.org',
    email: 'info@greenschool.org',
    keyPerson: 'Alumni Relations Office',
    description: 'Nature-based school with teachers who already believe in outdoor learning. Many alumni seek tropical teaching positions.'
  },
  {
    id: 'siratthaya',
    name: 'Siratthaya Waldorf Learning Center',
    location: 'Thailand',
    priority: 'low',
    category: 'school',
    summary: 'Waldorf learning center with heart-centered approach',
    contact: 'Through Waldorf network',
    description: 'Waldorf teachers who believe in heart-centered education. Small community where everyone knows who\'s looking for new opportunities.'
  }
]

const seaCountries = [
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' }, 
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' }
]

export default function TeacherRecruitmentPage() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(['TH'])) // Thailand selected by default
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const telegramUser = localStorage.getItem('telegram_user')
    if (telegramUser) {
      const parsedUser = JSON.parse(telegramUser)
      setUser(parsedUser)
    } else {
      // Redirect to admin login
      router.push('/admin')
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('telegram_user')
    setUser(null)
    router.push('/admin')
  }

  const toggleContact = (id: string) => {
    setExpandedContacts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#48bb78'
      case 'medium':
        return '#4299e1'
      case 'low':
        return '#a0aec0'
      default:
        return '#a0aec0'
    }
  }

  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(countryCode)) {
        newSet.delete(countryCode)
      } else {
        newSet.add(countryCode)
      }
      return newSet
    })
  }

  const selectAllCountries = () => {
    setSelectedCountries(new Set(seaCountries.map(c => c.code)))
  }

  const getCountryByLocation = (location: string): string | null => {
    if (location.includes('Thailand') || location.includes('Bangkok') || location.includes('Phuket')) return 'TH'
    if (location.includes('Singapore')) return 'SG'
    if (location.includes('Malaysia')) return 'MY'
    if (location.includes('Indonesia') || location.includes('Bali')) return 'ID'
    if (location.includes('Philippines')) return 'PH'
    if (location.includes('Vietnam')) return 'VN'
    if (location.includes('Myanmar')) return 'MM'
    if (location.includes('Cambodia')) return 'KH'
    // Treat "Online" as Thailand since these are Thai-focused platforms
    if (location.includes('Online')) return 'TH'
    return null
  }

  const isContactInSelectedCountries = (contact: Contact): boolean => {
    const country = getCountryByLocation(contact.location)
    return country ? selectedCountries.has(country) : false // Hide contacts without clear country match
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Router will redirect
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Teacher Recruitment Contacts</h1>
          <div className="header-right">
            <HamburgerMenu 
              onLogout={handleLogout}
              user={user}
            />
          </div>
        </div>
      </header>

      <div className="recruitment-content">
        <div className="recruitment-intro">
          <p>Organizations and networks for finding teachers who believe in discovering each child's "magic power".</p>
        </div>

        <div className="filter-controls">
          <div className="category-selector">
            <button 
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All ({contacts.length})
            </button>
            <button 
              className={selectedCategory === 'university' ? 'active' : ''}
              onClick={() => setSelectedCategory('university')}
            >
              Universities ({contacts.filter(c => c.category === 'university').length})
            </button>
            <button 
              className={selectedCategory === 'jobsite' ? 'active' : ''}
              onClick={() => setSelectedCategory('jobsite')}
            >
              Job Sites ({contacts.filter(c => c.category === 'jobsite').length})
            </button>
            <button 
              className={selectedCategory === 'network' ? 'active' : ''}
              onClick={() => setSelectedCategory('network')}
            >
              Networks ({contacts.filter(c => c.category === 'network').length})
            </button>
            <button 
              className={selectedCategory === 'school' ? 'active' : ''}
              onClick={() => setSelectedCategory('school')}
            >
              Schools ({contacts.filter(c => c.category === 'school').length})
            </button>
            <button 
              className={selectedCategory === 'social' ? 'active' : ''}
              onClick={() => setSelectedCategory('social')}
            >
              Social Media ({contacts.filter(c => c.category === 'social').length})
            </button>
            
            <div className="countries-dropdown">
              <button 
                className="countries-toggle"
                onClick={() => setShowCountriesDropdown(!showCountriesDropdown)}
              >
                Countries ({selectedCountries.size}) {showCountriesDropdown ? '▲' : '▼'}
              </button>
              
              {showCountriesDropdown && (
                <div className="countries-dropdown-content">
                  <div className="countries-header">
                    <button 
                      className="select-all-btn"
                      onClick={selectAllCountries}
                    >
                      <Check size={14} /> Select All
                    </button>
                  </div>
                  <div className="countries-grid">
                    {seaCountries.map(country => (
                      <label key={country.code} className="country-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCountries.has(country.code)}
                          onChange={() => toggleCountry(country.code)}
                        />
                        <span className="country-flag">{country.flag}</span>
                        <span className="country-name">{country.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="contacts-list">
          {contacts
            .filter(contact => selectedCategory === 'all' || contact.category === selectedCategory)
            .filter(contact => isContactInSelectedCountries(contact))
            .map(contact => {
            const isExpanded = expandedContacts.has(contact.id)
            
            return (
              <div 
                key={contact.id} 
                className="contact-item"
                style={{ borderLeftColor: getPriorityColor(contact.priority) }}
              >
                <div 
                  className="contact-header"
                  onClick={() => toggleContact(contact.id)}
                >
                  <div className="contact-header-left">
                    <div className="contact-expand-icon">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                      <h3>{contact.name}</h3>
                      <div className="contact-meta">
                        <span className="contact-location">{contact.location}</span>
                        {contact.summary && (
                          <span className="contact-summary">• {contact.summary}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="contact-details">
                    {contact.website && (
                      <div className="contact-detail-item">
                        <Globe size={16} />
                        <strong>Website:</strong>
                        <a href={contact.website} target="_blank" rel="noopener noreferrer">
                          {contact.website}
                        </a>
                      </div>
                    )}
                    
                    {contact.email && (
                      <div className="contact-detail-item">
                        <Mail size={16} />
                        <strong>Email:</strong>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </div>
                    )}
                    
                    {contact.phone && (
                      <div className="contact-detail-item">
                        <Phone size={16} />
                        <strong>Phone:</strong>
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    
                    {contact.contact && (
                      <div className="contact-detail-item">
                        <strong>Contact:</strong>
                        <span>{contact.contact}</span>
                      </div>
                    )}
                    
                    {contact.keyPerson && (
                      <div className="contact-detail-item">
                        <strong>Key Person:</strong>
                        <span>{contact.keyPerson}</span>
                      </div>
                    )}
                    
                    {contact.groups && (
                      <div className="contact-detail-item">
                        <strong>Groups to join:</strong>
                        <ul>
                          {contact.groups.map((group, index) => (
                            <li key={index}>{group}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {contact.note && (
                      <div className="contact-detail-item">
                        <strong>Note:</strong>
                        <span className="contact-note">{contact.note}</span>
                      </div>
                    )}
                    
                    <div className="contact-description">
                      {contact.description}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-content h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .recruitment-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .recruitment-intro {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .recruitment-intro p {
          margin: 0;
          color: #4b5563;
          font-size: 1.1rem;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border-left: 4px solid;
          transition: all 0.2s;
        }

        .contact-header {
          padding: 1rem 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }

        .contact-header:hover {
          background-color: #f9fafb;
        }

        .contact-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .contact-expand-icon {
          color: #6b7280;
        }

        .contact-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #2b6cb0;
        }

        .contact-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .contact-location {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .contact-summary {
          font-size: 0.85rem;
          color: #9ca3af;
          font-style: italic;
        }

        .filter-controls {
          margin-bottom: 1.5rem;
        }

        .category-selector {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .category-selector > button {
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-selector > button:hover {
          border-color: #2b6cb0;
          color: #2b6cb0;
        }

        .category-selector > button.active {
          background: #2b6cb0;
          color: white;
          border-color: #2b6cb0;
        }

        .countries-dropdown {
          position: relative;
          display: inline-block;
        }

        .countries-toggle {
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .countries-toggle:hover {
          border-color: #2b6cb0;
          color: #2b6cb0;
        }

        .countries-dropdown-content {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          width: 400px;
          margin-top: 2px;
        }

        .countries-header {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .select-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #2b6cb0;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .select-all-btn:hover {
          background-color: #f3f4f6;
        }

        .countries-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          padding: 0.5rem;
        }

        .country-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
          border-radius: 4px;
        }

        .country-checkbox:hover {
          background-color: #f9fafb;
        }

        .country-checkbox input[type="checkbox"] {
          margin: 0;
          flex-shrink: 0;
        }

        .country-flag {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .country-name {
          font-size: 0.85rem;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .contact-details {
          padding: 0 1.5rem 1.5rem 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #4b5563;
        }

        .contact-detail-item strong {
          color: #2b6cb0;
          min-width: 100px;
        }

        .contact-detail-item svg {
          color: #6b7280;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .contact-detail-item a {
          color: #3182ce;
          text-decoration: none;
        }

        .contact-detail-item a:hover {
          text-decoration: underline;
        }

        .contact-detail-item ul {
          margin: 0;
          padding-left: 1.5rem;
          list-style-type: disc;
        }

        .contact-detail-item li {
          margin: 0.25rem 0;
        }

        .contact-note {
          color: #dc2626;
          font-style: italic;
        }

        .contact-description {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f3f4f6;
          border-radius: 6px;
          color: #374151;
          line-height: 1.6;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .recruitment-content {
            padding: 1rem;
          }

          .contact-details {
            padding-left: 1.5rem;
          }

          .contact-detail-item {
            flex-direction: column;
            gap: 0.25rem;
          }

          .contact-detail-item strong {
            min-width: auto;
          }

          .countries-dropdown-content {
            width: 300px;
          }

          .countries-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .countries-dropdown-content {
            width: 280px;
          }

          .countries-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}