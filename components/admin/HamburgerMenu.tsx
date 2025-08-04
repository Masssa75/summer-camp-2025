'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Home, Users, Calendar, FileText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface HamburgerMenuProps {
  onLogout: () => void
  user: TelegramUser
}

export default function HamburgerMenu({ onLogout, user }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.hamburger-menu-container')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const menuItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
      active: pathname === '/admin'
    },
    {
      href: '/admin/teacher-recruitment',
      label: 'Teacher Recruitment',
      icon: Users,
      active: pathname === '/admin/teacher-recruitment'
    },
    {
      href: '/admin/timetable',
      label: 'Timetable',
      icon: Calendar,
      active: pathname === '/admin/timetable'
    },
    {
      href: '/',
      label: 'Summer Camp Website',
      icon: FileText,
      active: false,
      external: true
    }
  ]

  return (
    <div className="hamburger-menu-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hamburger-button user-menu-button"
        aria-label="Toggle menu"
      >
        {user.photo_url ? (
          <img src={user.photo_url} alt={user.first_name} className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">
            {user.first_name.charAt(0)}
          </div>
        )}
        <span className="user-name">{user.first_name}</span>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsOpen(false)} />
          <nav className="hamburger-menu">
            <div className="menu-user-info">
              {user.photo_url ? (
                <img src={user.photo_url} alt={user.first_name} className="menu-user-avatar" />
              ) : (
                <div className="menu-user-avatar-placeholder">
                  {user.first_name.charAt(0)}
                </div>
              )}
              <div className="menu-user-details">
                <h3>{user.first_name} {user.last_name}</h3>
                {user.username && <p>@{user.username}</p>}
              </div>
            </div>
            <div className="menu-items">
              {menuItems.map((item) => {
                const Icon = item.icon
                
                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`menu-item ${item.active ? 'active' : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`menu-item ${item.active ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="menu-divider" />
              
              <button
                onClick={onLogout}
                className="menu-item logout-item"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </>
      )}

      <style jsx>{`
        .hamburger-menu-container {
          position: relative;
        }

        .hamburger-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #333;
          transition: color 0.2s;
        }

        .user-menu-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .user-menu-button:hover {
          background: #f3f4f6;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #7a9a3b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          font-weight: 500;
          margin-right: 4px;
        }

        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 998;
        }

        .hamburger-menu {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 280px;
          background: white;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 999;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .menu-user-info {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f9fafb;
        }

        .menu-user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .menu-user-avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #7a9a3b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 20px;
        }

        .menu-user-details h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .menu-user-details p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .menu-items {
          padding: 20px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 4px;
          color: #333;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          font-size: 15px;
        }

        .menu-item:hover {
          background: #f0f7ff;
          color: #2b6cb0;
        }

        .menu-item.active {
          background: #e6f2ff;
          color: #2b6cb0;
          font-weight: 500;
        }

        .menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 16px 0;
        }

        .logout-item {
          color: #dc2626;
        }

        .logout-item:hover {
          background: #fef2f2;
          color: #b91c1c;
        }

        @media (max-width: 768px) {
          .hamburger-menu {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  )
}