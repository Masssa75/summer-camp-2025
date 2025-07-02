'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

export default function TestAuthPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Check if dev login is allowed
      if (process.env.NEXT_PUBLIC_ALLOW_DEV_LOGIN !== 'true') {
        setError('Test login is disabled')
        setLoading(false)
        return
      }

      // For simplicity, we'll just check the password and create a mock Telegram user
      if (password === process.env.NEXT_PUBLIC_DEV_LOGIN_PASSWORD || password === 'test123') {
        // Create a mock Telegram user
        const mockTelegramUser = {
          id: 123456789,
          first_name: 'Test',
          last_name: 'Admin',
          username: 'testadmin',
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'test_hash'
        }

        // Store in localStorage (same as real Telegram login)
        localStorage.setItem('telegram_user', JSON.stringify(mockTelegramUser))
        
        // Redirect to admin page
        router.push('/admin')
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Shield size={60} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Test Admin Access</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter test password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use: test123</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login as Test Admin'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            For development testing only
          </p>
          <p className="text-xs text-gray-400 text-center mt-2">
            This bypasses Telegram authentication
          </p>
        </div>
      </div>
    </div>
  )
}