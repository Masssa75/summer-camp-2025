'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Shield, LogOut, Users, FileText, Bell, Check, Eye, X, Download, ExternalLink, Trash2, MoreVertical, Settings } from 'lucide-react'
import EditableTimetable from '@/components/admin/EditableTimetable'
import NotificationSettings from '@/components/NotificationSettings'
import RegistrationWorkflow from '@/components/admin/RegistrationWorkflow'
import HamburgerMenu from '@/components/admin/HamburgerMenu'
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
  const [recentNotifications, setRecentNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [registrationToDelete, setRegistrationToDelete] = useState<any>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)

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
      await loadRegistrations()
      await loadRecentNotifications()
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
          await loadRegistrations()
          await loadRecentNotifications()
        } else {
          // Allow for development
          console.warn('User not in admin list, allowing for development')
          setUser(telegramUser)
          await loadRegistrations()
          await loadRecentNotifications()
        }
      } catch (err) {
        // Table doesn't exist, allow for development
        console.warn('Admin users table not found, allowing for development')
        setUser(telegramUser)
        await loadRegistrations()
        await loadRecentNotifications()
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
      loadRecentNotifications()
      checkTelegramConnection()
    }

    return () => {
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth
      }
    }
  }, [])

  // Check Telegram connection after user is set
  useEffect(() => {
    if (user) {
      checkTelegramConnection()
    }
  }, [user])

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-container')) {
        setShowNotificationMenu(false)
      }
      if (!target.closest('.action-menu-container')) {
        setOpenMenuId(null)
      }
    }

    if (showNotificationMenu || openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotificationMenu, openMenuId])

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

  const loadRecentNotifications = async () => {
    try {
      const response = await fetch('/api/admin/registrations')
      if (response.ok) {
        const { registrations } = await response.json()
        // Use recent registrations as notifications
        const recent = registrations.slice(0, 5).map((reg: any) => ({
          id: reg.id,
          title: 'New Registration',
          message: `${reg.child_name} registered for ${reg.age_group === 'mini' ? 'Mini Camp' : 'Explorer Camp'}`,
          created_at: reg.created_at,
          child_name: reg.child_name,
          parent_email: reg.email,
          is_read: false, // For now, assume all are unread
          registration: reg
        }))
        setRecentNotifications(recent)
        setUnreadCount(recent.length)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setRecentNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const deleteNotification = (notificationId: string) => {
    setRecentNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setRecentNotifications(prev => 
      prev.map(notif => ({ ...notif, is_read: true }))
    )
    setUnreadCount(0)
  }

  const handleDelete = (registration: any) => {
    setRegistrationToDelete(registration)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!registrationToDelete) return
    
    setDeletingId(registrationToDelete.id)
    try {
      const response = await fetch(`/api/admin/registrations/${registrationToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from local state
        setRegistrations(prev => prev.filter(r => r.id !== registrationToDelete.id))
        // Also remove from notifications if exists
        setRecentNotifications(prev => prev.filter(n => n.registration?.id !== registrationToDelete.id))
        console.log('Registration deleted successfully')
      } else {
        console.error('Failed to delete registration')
        alert('Failed to delete registration. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('An error occurred while deleting the registration.')
    } finally {
      setDeletingId(null)
      setShowDeleteConfirm(false)
      setRegistrationToDelete(null)
    }
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
          <div className="header-right">
            <HamburgerMenu 
              onLogout={handleLogout} 
              user={user}
            />
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

        {/* Registration Workflow */}
        <RegistrationWorkflow />
        
        {/* Editable Timetable Section */}
        <EditableTimetable />
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

                {/* Documents Section */}
                {(selectedRegistration.child_passport_url || 
                  selectedRegistration.parent_passport_1_url || 
                  selectedRegistration.parent_passport_2_url) && (
                  <div className="detail-section">
                    <h3>Uploaded Documents</h3>
                    <div className="documents-grid">
                      {selectedRegistration.child_passport_url && (
                        <div className="document-item">
                          <label>Child's Passport:</label>
                          <div className="document-actions">
                            <a 
                              href={selectedRegistration.child_passport_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              <ExternalLink size={16} />
                              View Document
                            </a>
                            <a 
                              href={selectedRegistration.child_passport_url} 
                              download
                              className="document-download"
                            >
                              <Download size={16} />
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {selectedRegistration.parent_passport_1_url && (
                        <div className="document-item">
                          <label>Parent 1 Passport:</label>
                          <div className="document-actions">
                            <a 
                              href={selectedRegistration.parent_passport_1_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              <ExternalLink size={16} />
                              View Document
                            </a>
                            <a 
                              href={selectedRegistration.parent_passport_1_url} 
                              download
                              className="document-download"
                            >
                              <Download size={16} />
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {selectedRegistration.parent_passport_2_url && (
                        <div className="document-item">
                          <label>Parent 2 Passport:</label>
                          <div className="document-actions">
                            <a 
                              href={selectedRegistration.parent_passport_2_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              <ExternalLink size={16} />
                              View Document
                            </a>
                            <a 
                              href={selectedRegistration.parent_passport_2_url} 
                              download
                              className="document-download"
                            >
                              <Download size={16} />
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && registrationToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="delete-warning">
                <Trash2 size={48} className="delete-icon" />
                <p>Are you sure you want to delete this registration?</p>
                <div className="delete-details">
                  <strong>Child:</strong> {registrationToDelete.child_name}<br />
                  <strong>Parent:</strong> {registrationToDelete.parent_name_1}<br />
                  <strong>Email:</strong> {registrationToDelete.email}
                </div>
                <p className="delete-note">This action cannot be undone.</p>
              </div>
              
              <div className="delete-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn" 
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                >
                  {deletingId ? 'Deleting...' : 'Delete Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      <NotificationSettings 
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  )
}

// Add TypeScript declaration for window
declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}