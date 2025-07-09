'use client'

import { useState } from 'react'
import { Bell, Users, User, Mail, BellRing, X } from 'lucide-react'

interface NotificationSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationSettings({ 
  isOpen, 
  onClose
}: NotificationSettingsProps) {
  const [groupInviteLink, setGroupInviteLink] = useState('')

  if (!isOpen) return null

  const handleJoinGroup = () => {
    // TODO: Replace with actual group invite link
    alert('Please ask an admin for the group invite link')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telegram Group Notifications */}
          <div className="mb-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Telegram Group Notifications
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join our admin Telegram group to receive instant notifications when new registrations come in.
            </p>
            <button
              onClick={handleJoinGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm w-full"
            >
              Join Admin Group
            </button>
          </div>

          {/* Coming Soon Features */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg opacity-60">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-500">
                <User className="w-4 h-4" />
                Personal Notifications
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
              </h3>
              <p className="text-sm text-gray-500">
                Connect your personal Telegram for direct notifications
              </p>
            </div>

            <div className="p-4 border rounded-lg opacity-60">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-500">
                <Mail className="w-4 h-4" />
                Email Notifications
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
              </h3>
              <p className="text-sm text-gray-500">
                Receive email summaries of new registrations
              </p>
            </div>

            <div className="p-4 border rounded-lg opacity-60">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-500">
                <BellRing className="w-4 h-4" />
                Notification Preferences
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
              </h3>
              <p className="text-sm text-gray-500">
                Customize which events trigger notifications and set quiet hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}