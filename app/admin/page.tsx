'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Shield, LogOut, Users, FileText, Bell } from 'lucide-react'
import './admin.css'

// Telegram Bot Configuration
const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'Bamboo_Valley_Admin_Bot'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export default function AdminPage() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const [telegramConnected, setTelegramConnected] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  const loadRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations')
      if (response.ok) {
        const { registrations } = await response.json()
        setRegistrations(registrations || [])
      } else {
        console.error('Failed to load registrations:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    }
  }

  const checkTelegramConnection = async () => {
    if (user) {
      try {
        const response = await fetch('/api/admin/telegram-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegram_id: user.id })
        })
        if (response.ok) {
          const { connected } = await response.json()
          setTelegramConnected(connected)
        }
      } catch (error) {
        console.error('Error checking Telegram connection:', error)
      }
    }
  }

  const connectTelegram = () => {
    const botUsername = TELEGRAM_BOT_USERNAME
    const message = `Hello! I'm an admin for Summer Camp 2025. My Telegram ID is ${user?.id}. Please add me to receive registration notifications.`
    const encodedMessage = encodeURIComponent(message)
    const telegramUrl = `https://t.me/${botUsername}?start=admin_${user?.id}&text=${encodedMessage}`
    window.open(telegramUrl, '_blank')
  }

  const verifyAdminUser = async (telegramUser: TelegramUser) => {
    const supabase = createClient()
    
    // For development, allow specific user IDs
    const allowedIds: number[] = [
      123456789, // Test admin user ID from test-auth
    ]
    
    // For development/testing, skip admin_users table check
    // In production, you would check the admin_users table
    if (allowedIds.includes(telegramUser.id) || process.env.NEXT_PUBLIC_ALLOW_DEV_LOGIN === 'true') {
      setUser(telegramUser)
      loadRegistrations()
      checkTelegramConnection()
    } else {
      // Try to check admin_users table if it exists
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('telegram_id', telegramUser.id)
          .eq('is_active', true)
          .single()
        
        if (!error && data) {
          setUser(telegramUser)
          loadRegistrations()
          checkTelegramConnection()
        } else {
          // Allow for development
          console.warn('User not in admin list, allowing for development')
          setUser(telegramUser)
          loadRegistrations()
          checkTelegramConnection()
        }
      } catch (err) {
        // Table doesn't exist, allow for development
        console.warn('Admin users table not found, allowing for development')
        setUser(telegramUser)
        loadRegistrations()
        checkTelegramConnection()
      }
    }
    
    setLoading(false)
  }

  useEffect(() => {
    // Check if user is logged in
    const telegramUser = localStorage.getItem('telegram_user')
    if (telegramUser) {
      const parsedUser = JSON.parse(telegramUser)
      // Verify user is authorized
      verifyAdminUser(parsedUser)
    } else {
      setLoading(false)
    }

    // Define global function for Telegram auth callback
    window.onTelegramAuth = (telegramUser: TelegramUser) => {
      localStorage.setItem('telegram_user', JSON.stringify(telegramUser))
      setUser(telegramUser)
      loadRegistrations()
      checkTelegramConnection()
    }

    return () => {
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth
      }
    }
  }, [])

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-container')) {
        setShowNotificationMenu(false)
      }
    }

    if (showNotificationMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotificationMenu])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showRegistrationModal) {
        closeRegistrationModal()
      }
    }

    if (showRegistrationModal) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showRegistrationModal])

  // Separate useEffect for loading Telegram widget
  useEffect(() => {
    if (!loading && !user) {
      // Add Telegram widget script
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-radius', '10')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      script.async = true

      const widgetContainer = document.getElementById('telegram-widget')
      if (widgetContainer) {
        console.log('Adding Telegram widget with bot:', TELEGRAM_BOT_USERNAME)
        widgetContainer.appendChild(script)
      } else {
        console.error('Telegram widget container not found')
      }
    }
  }, [loading, user])

  const handleLogout = () => {
    localStorage.removeItem('telegram_user')
    setUser(null)
    setRegistrations([])
  }

  const viewRegistration = (registration: any) => {
    setSelectedRegistration(registration)
    setShowRegistrationModal(true)
  }

  const closeRegistrationModal = () => {
    setSelectedRegistration(null)
    setShowRegistrationModal(false)
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
    return (
      <div className="admin-login">
        <div className="login-card">
          <Shield size={60} className="login-icon" />
          <h1>Admin Access</h1>
          <p>Please sign in with Telegram to access the admin panel</p>
          <div id="telegram-widget"></div>
          {process.env.NEXT_PUBLIC_ALLOW_DEV_LOGIN === 'true' && (
            <div className="test-login-link">
              <p>or</p>
              <a href="/test-auth" className="test-auth-link">Use Test Login</a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Summer Camp Admin</h1>
          <div className="user-info">
            {/* Notification Bell */}
            <div className="notification-container">
              <button 
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className={`notification-bell ${telegramConnected ? 'connected' : 'disconnected'}`}
                title={telegramConnected ? 'Telegram notifications enabled' : 'Connect Telegram for notifications'}
              >
                <Bell size={20} />
                {!telegramConnected && <span className="notification-dot"></span>}
              </button>
              
              {showNotificationMenu && (
                <div className="notification-menu">
                  <div className="notification-header">
                    <Bell size={16} />
                    <span>Notifications</span>
                  </div>
                  
                  <div className="telegram-status">
                    {telegramConnected ? (
                      <div className="status-connected">
                        <div className="status-indicator connected"></div>
                        <span>Telegram connected</span>
                      </div>
                    ) : (
                      <div className="status-disconnected">
                        <div className="status-indicator disconnected"></div>
                        <span>Telegram not connected</span>
                      </div>
                    )}
                  </div>
                  
                  {!telegramConnected ? (
                    <button onClick={connectTelegram} className="connect-telegram-btn">
                      Connect TG
                    </button>
                  ) : (
                    <button 
                      onClick={checkTelegramConnection} 
                      className="refresh-status-btn"
                      title="Refresh connection status"
                    >
                      Refresh Status
                    </button>
                  )}
                  
                  {/* Always show a refresh button for manual checking */}
                  <button 
                    onClick={checkTelegramConnection} 
                    className="refresh-connection-btn"
                    title="Check connection status"
                  >
                    🔄 Check Status
                  </button>
                  
                  <div className="notification-info">
                    <p>Get notified instantly when new registrations come in!</p>
                    {telegramConnected && (
                      <p className="telegram-id">Your ID: {user.id}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {user.photo_url && (
              <img src={user.photo_url} alt={user.first_name} className="user-avatar" />
            )}
            <span>{user.first_name} {user.last_name}</span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={30} />
            <h3>Total Registrations</h3>
            <p className="stat-number">{registrations.length}</p>
          </div>
          <div className="stat-card">
            <FileText size={30} />
            <h3>This Week</h3>
            <p className="stat-number">
              {registrations.filter(r => {
                const date = new Date(r.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return date > weekAgo
              }).length}
            </p>
          </div>
          <div className="stat-card">
            <Bell size={30} />
            <h3>Pending Review</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="registrations-section">
          <div className="flex items-center justify-between mb-4">
            <h2>Recent Registrations</h2>
            <button 
              onClick={loadRegistrations}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
          <div className="registrations-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Child Name</th>
                  <th>Age Group</th>
                  <th>Parent</th>
                  <th>Email</th>
                  <th>Weeks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{new Date(reg.created_at).toLocaleDateString()}</td>
                    <td>{reg.child_name}</td>
                    <td>
                      <span className={`badge ${reg.age_group}`}>
                        {reg.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'}
                      </span>
                    </td>
                    <td>{reg.parent_name_1}</td>
                    <td>{reg.email}</td>
                    <td>{reg.weeks_selected?.join(', ') || 'N/A'}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => viewRegistration(reg)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {registrations.length === 0 && (
              <p className="no-data">No registrations yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Registration Detail Modal */}
      {showRegistrationModal && selectedRegistration && (
        <div className="modal-overlay" onClick={closeRegistrationModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registration Details</h2>
              <button className="modal-close" onClick={closeRegistrationModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="registration-details">
                <div className="detail-section">
                  <h3>Child Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Child Name:</label>
                      <span>{selectedRegistration.child_name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nick Name:</label>
                      <span>{selectedRegistration.nick_name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Gender:</label>
                      <span>{selectedRegistration.gender}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth:</label>
                      <span>{selectedRegistration.date_of_birth}</span>
                    </div>
                    <div className="detail-item">
                      <label>Age Group:</label>
                      <span className={`badge ${selectedRegistration.age_group}`}>
                        {selectedRegistration.age_group === 'mini' ? 'Mini Camp (3-6)' : 'Explorer Camp (7-13)'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Current School:</label>
                      <span>{selectedRegistration.current_school}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nationality & Language:</label>
                      <span>{selectedRegistration.nationality_language}</span>
                    </div>
                    <div className="detail-item">
                      <label>English Level:</label>
                      <span>{selectedRegistration.english_level}/5</span>
                    </div>
                    <div className="detail-item">
                      <label>Selected Weeks:</label>
                      <span>{selectedRegistration.weeks_selected?.join(', ') || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Parent Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Parent 1:</label>
                      <span>{selectedRegistration.parent_name_1}</span>
                    </div>
                    <div className="detail-item">
                      <label>Parent 2:</label>
                      <span>{selectedRegistration.parent_name_2 || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedRegistration.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Mobile 1:</label>
                      <span>{selectedRegistration.mobile_phone_1}</span>
                    </div>
                    <div className="detail-item">
                      <label>Mobile 2:</label>
                      <span>{selectedRegistration.mobile_phone_2 || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>WeChat/WhatsApp 1:</label>
                      <span>{selectedRegistration.wechat_whatsapp_1 || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>WeChat/WhatsApp 2:</label>
                      <span>{selectedRegistration.wechat_whatsapp_2 || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Emergency Contact:</label>
                      <span>{selectedRegistration.emergency_contact}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Health & Additional Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Allergies:</label>
                      <span>{selectedRegistration.allergies}</span>
                    </div>
                    <div className="detail-item">
                      <label>Health/Behavioral Conditions:</label>
                      <span>{selectedRegistration.health_behavioral_conditions}</span>
                    </div>
                    <div className="detail-item">
                      <label>Has Insurance:</label>
                      <span>{selectedRegistration.has_insurance ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Photo Permission:</label>
                      <span>{selectedRegistration.photo_permission ? 'Granted' : 'Not granted'}</span>
                    </div>
                    <div className="detail-item">
                      <label>How did you find us:</label>
                      <span>{selectedRegistration.how_did_you_find}</span>
                    </div>
                    <div className="detail-item">
                      <label>Registration Date:</label>
                      <span>{new Date(selectedRegistration.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add TypeScript declaration for window
declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}