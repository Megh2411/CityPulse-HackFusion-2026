'use client'

import { useState } from 'react'
import { User } from '@/lib/types'
import CitizenPortal from '@/components/portals/citizen-portal'
import FieldStaffInterface from '@/components/portals/field-staff-interface'
import OfficerDashboard from '@/components/portals/officer-dashboard'
import AdminAnalytics from '@/components/portals/admin-analytics'
import NavigationBar from '@/components/navigation/navigation-bar'

interface DashboardProps {
  currentUser: User
  onLogout: () => void
}

export default function Dashboard({ currentUser, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('home')

  const renderContent = () => {
    switch (currentUser.role) {
      case 'citizen':
        return <CitizenPortal currentUser={currentUser} onNavigate={setCurrentView} currentView={currentView} />
      case 'field_staff':
        return <FieldStaffInterface currentUser={currentUser} onNavigate={setCurrentView} currentView={currentView} />
      case 'officer':
        return <OfficerDashboard currentUser={currentUser} onNavigate={setCurrentView} currentView={currentView} />
      case 'admin':
        return <AdminAnalytics currentUser={currentUser} onNavigate={setCurrentView} currentView={currentView} />
      default:
        return <CitizenPortal currentUser={currentUser} onNavigate={setCurrentView} currentView={currentView} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationBar currentUser={currentUser} onLogout={onLogout} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-hidden">{renderContent()}</main>
    </div>
  )
}
