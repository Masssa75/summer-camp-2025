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

  const loadRegistrations = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRegistrations(data)
    }
  }

  const verifyAdminUser = async (telegramUser: TelegramUser) => {
    const supabase = createClient()
    
    // For development, allow specific user IDs
    const allowedIds: number[] = [
      // Add your Telegram user ID here for testing
    ]
    
    // Check if user is in admin_users table or allowed list
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .eq('is_active', true)
      .single()
    
    if (!error && data || allowedIds.includes(telegramUser.id)) {
      setUser(telegramUser)
      loadRegistrations()
    } else {
      // For now, allow all users in development
      console.warn('User not in admin list, allowing for development')
      setUser(telegramUser)
      loadRegistrations()
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
    }

    return () => {
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth
      }
    }
  }, [])

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
          <h2>Recent Registrations</h2>
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
                      <button className="view-btn">View</button>
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
    </div>
  )
}

// Add TypeScript declaration for window
declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}