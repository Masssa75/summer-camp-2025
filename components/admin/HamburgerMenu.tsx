'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Home, Users, Calendar, FileText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HamburgerMenuProps {
  onLogout: () => void
}

export default function HamburgerMenu({ onLogout }: HamburgerMenuProps) {
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
        className="hamburger-button"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsOpen(false)} />
          <nav className="hamburger-menu">
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

        .hamburger-button:hover {
          color: #2b6cb0;
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
          left: 0;
          height: 100vh;
          width: 280px;
          background: white;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 999;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .menu-items {
          padding: 20px;
          padding-top: 60px;
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