'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from '@/components/auth-provider'
import AuthPage from '@/components/auth-page'
import LandingPage from '@/components/landing-page' // <--- Import this
import AdminDashboardEnhanced from '@/components/portals/admin-dashboard-enhanced'
import OfficerDashboard from '@/components/portals/officer-dashboard'
import FieldStaffEnhanced from '@/components/portals/field-staff-enhanced'
import CitizenPortalEnhanced from '@/components/portals/citizen-portal-enhanced'
import { Loader2 } from 'lucide-react'

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const [currentView, setCurrentView] = useState('home') 
  const [showLogin, setShowLogin] = useState(false) // <--- State for showing login form

  // 1. Loading State
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  // 2. Not Logged In
  if (!user) {
    // Show Landing Page first, toggle to AuthPage on click
    if (!showLogin) {
      return <LandingPage onGetStarted={() => setShowLogin(true)} />
    }
    return <AuthPage />
  }

  // 3. Logged In - Router based on Role
  switch (user.role) {
    case 'admin':
      return <AdminDashboardEnhanced currentUser={user} onLogout={signOut} />
    
    case 'officer':
      return <OfficerDashboard currentUser={user} currentView={currentView === 'home' ? 'home' : currentView} onNavigate={setCurrentView} onLogout={signOut} />
    
    case 'field_staff':
      return <FieldStaffEnhanced currentUser={user} onLogout={signOut} />
    
    case 'citizen':
    default:
      return <CitizenPortalEnhanced currentUser={user} currentView={currentView === 'home' ? 'city-wide' : currentView} onNavigate={setCurrentView} onLogout={signOut} />
  }
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}