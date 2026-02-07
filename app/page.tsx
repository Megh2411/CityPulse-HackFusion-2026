'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { storage } from '@/lib/storage'
import LandingPage from '@/components/layout/landing-page'
import LoginPage from '@/components/auth/login-page'
import Dashboard from '@/components/dashboard/dashboard'

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const user = storage.getCurrentUser()
    setCurrentUser(user)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading CityPulse...</p>
        </div>
      </div>
    )
  }

  if (currentUser) {
    return <Dashboard currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
  }

  if (showLogin) {
    return <LoginPage onLoginSuccess={setCurrentUser} />
  }

  return <LandingPage onGetStarted={() => setShowLogin(true)} />
}
