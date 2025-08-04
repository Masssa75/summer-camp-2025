'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Shield, ChevronDown, ChevronRight, ExternalLink, Phone, Mail, Globe, MapPin, Check, ArrowUp, ArrowDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import HamburgerMenu from '@/components/admin/HamburgerMenu'

interface TelegramUser {
  id: number
  username?: string
  first_name: string
  last_name?: string
  photo_url?: string
}

interface Contact {
  id: string
  contact_id: string
  name: string
  location: string
  priority: 'high' | 'medium' | 'low'
  category: 'university' | 'jobsite' | 'network' | 'school' | 'social'
  summary?: string
  website?: string
  email?: string
  phone?: string
  contact_info?: string
  key_person?: string
  groups?: string[]
  note?: string
  description: string
  sort_order: number
  is_active: boolean
}

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
  const [contacts, setContacts] = useState<Contact[]>([])
  const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(['TH'])) // Thailand selected by default
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        // First check for test auth user
        const storedUser = localStorage.getItem('telegram_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setLoading(false)
          return
        }

        // If no test auth, check Supabase auth
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          router.push('/admin')
          return
        }

        // Supabase user exists but no Telegram user stored
        // This shouldn't happen in normal flow, but redirect to admin
        router.push('/admin')
      } catch (error) {
        console.error('Error checking user:', error)
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase.auth])

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const { data, error } = await supabase
          .from('teacher_recruitment_contacts')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Error loading contacts:', error)
          return
        }

        setContacts(data || [])
      } catch (error) {
        console.error('Error loading contacts:', error)
      }
    }

    if (!loading) {
      loadContacts()
    }
  }, [loading, supabase])

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

  const toggleContact = (contactId: string) => {
    setExpandedContacts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(contactId)) {
        newSet.delete(contactId)
      } else {
        newSet.add(contactId)
      }
      return newSet
    })
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
    // Regional contacts should appear when any SEA country is selected
    if (contact.location.includes('Regional')) {
      return selectedCountries.size > 0
    }
    return country ? selectedCountries.has(country) : false
  }

  const moveContact = async (contactId: string, direction: 'up' | 'down') => {
    const currentIndex = contacts.findIndex(c => c.contact_id === contactId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= contacts.length) return

    // Create new array with swapped positions
    const newContacts = [...contacts]
    const [movedContact] = newContacts.splice(currentIndex, 1)
    newContacts.splice(newIndex, 0, movedContact)

    // Update sort_order values
    const updatedContacts = newContacts.map((contact, index) => ({
      ...contact,
      sort_order: index + 1
    }))

    try {
      // Update in database
      const updates = updatedContacts
        .filter((contact, index) => 
          contact.sort_order !== contacts[index]?.sort_order
        )
        .map(contact => ({
          id: contact.id,
          sort_order: contact.sort_order
        }))

      for (const update of updates) {
        await supabase
          .from('teacher_recruitment_contacts')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      }

      // Update local state
      setContacts(updatedContacts)
    } catch (error) {
      console.error('Error updating contact order:', error)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <Shield className="loading-icon" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const filteredContacts = contacts
    .filter(contact => selectedCategory === 'all' || contact.category === selectedCategory)
    .filter(contact => isContactInSelectedCountries(contact))

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <Shield size={24} />
            <h1>Teacher Recruitment</h1>
          </div>
          <HamburgerMenu 
            user={user} 
            onLogout={async () => {
              await supabase.auth.signOut()
              localStorage.removeItem('telegram_user')
              router.push('/admin')
            }}
          />
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
          {filteredContacts.map((contact, index) => {
            const isExpanded = expandedContacts.has(contact.contact_id)
            return (
              <div key={contact.contact_id} className="contact-item">
                <div className="contact-header" onClick={() => toggleContact(contact.contact_id)}>
                  <div 
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(contact.priority) }}
                  />
                  <div className="contact-header-content">
                    <div>
                      <h3>{contact.name}</h3>
                      <div className="contact-meta">
                        <span className="contact-location">{contact.location}</span>
                        {contact.summary && (
                          <span className="contact-summary">• {contact.summary}</span>
                        )}
                      </div>
                    </div>
                    <div className="contact-controls">
                      <div className="reorder-buttons">
                        <button
                          className="reorder-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveContact(contact.contact_id, 'up')
                          }}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          className="reorder-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveContact(contact.contact_id, 'down')
                          }}
                          disabled={index === filteredContacts.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                      <div className="expand-icon">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="contact-details">
                    <p className="contact-description">{contact.description}</p>
                    
                    <div className="contact-info">
                      {contact.website && (
                        <div className="contact-detail-item">
                          <Globe size={16} />
                          <strong>Website:</strong>
                          <a href={contact.website} target="_blank" rel="noopener noreferrer">
                            {contact.website} <ExternalLink size={12} />
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
                          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                        </div>
                      )}
                      
                      {contact.contact_info && (
                        <div className="contact-detail-item">
                          <MapPin size={16} />
                          <strong>Contact:</strong>
                          <span>{contact.contact_info}</span>
                        </div>
                      )}
                      
                      {contact.key_person && (
                        <div className="contact-detail-item">
                          <strong>Key Person:</strong>
                          <span>{contact.key_person}</span>
                        </div>
                      )}
                      
                      {contact.groups && contact.groups.length > 0 && (
                        <div className="contact-detail-item">
                          <strong>Groups:</strong>
                          <ul>
                            {contact.groups.map((group, idx) => (
                              <li key={idx}>{group}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {contact.note && (
                        <div className="contact-detail-item note">
                          <strong>Note:</strong>
                          <span>{contact.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .admin-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-header-content {
          maximum-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #2d3748;
        }

        .admin-title h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .recruitment-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .recruitment-intro {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .recruitment-intro p {
          margin: 0;
          font-size: 1.1rem;
          color: #4a5568;
          font-weight: 500;
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

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .contact-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .contact-header {
          display: flex;
          align-items: flex-start;
          padding: 1.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .contact-header:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .priority-indicator {
          width: 4px;
          height: 100%;
          min-height: 40px;
          border-radius: 2px;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .contact-header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          gap: 1rem;
        }

        .contact-header-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          line-height: 1.3;
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

        .contact-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .reorder-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-right: 0.5rem;
        }

        .reorder-btn {
          background: #ffffff;
          border: 2px solid #cbd5e0;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          min-height: 36px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #4a5568;
        }

        .reorder-btn:hover:not(:disabled) {
          background: #e2e8f0;
          border-color: #2b6cb0;
          color: #2b6cb0;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .reorder-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .expand-icon {
          color: #a0aec0;
          transition: transform 0.2s;
        }

        .contact-details {
          padding: 0 1.5rem 1.5rem 2.5rem;
          border-top: 1px solid #f1f5f9;
          background: rgba(248, 250, 252, 0.5);
        }

        .contact-description {
          margin: 0 0 1.5rem 0;
          color: #4a5568;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
        }

        .contact-detail-item strong {
          min-width: 80px;
          color: #2d3748;
          font-weight: 600;
        }

        .contact-detail-item a {
          color: #2b6cb0;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .contact-detail-item a:hover {
          text-decoration: underline;
        }

        .contact-detail-item.note {
          background: #fef5e7;
          padding: 0.75rem;
          border-radius: 6px;
          border-left: 3px solid #f6ad55;
        }

        .contact-detail-item ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .contact-detail-item li {
          margin-bottom: 0.25rem;
          color: #4a5568;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-icon {
          animation: spin 2s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

          .contact-controls {
            flex-direction: column;
            gap: 0.5rem;
          }

          .reorder-buttons {
            flex-direction: row;
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