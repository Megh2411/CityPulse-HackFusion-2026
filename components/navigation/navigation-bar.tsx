'use client'

import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Menu, LogOut, Home, FileText, BarChart3, Users } from 'lucide-react'
import { useState } from 'react'

interface NavigationBarProps {
  currentUser: User
  onLogout: () => void
  onNavigate: (view: string) => void
}

export default function NavigationBar({ currentUser, onLogout, onNavigate }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getMenuItems = () => {
    const baseItems = [{ label: 'Home', icon: Home, view: 'home' }]

    switch (currentUser.role) {
      case 'citizen':
        return [
          ...baseItems,
          { label: 'Report Incident', icon: FileText, view: 'report' },
          { label: 'My Reports', icon: FileText, view: 'my-reports' },
        ]
      case 'field_staff':
        return [
          ...baseItems,
          { label: 'Assigned Tasks', icon: FileText, view: 'assigned' },
          { label: 'Available Work', icon: FileText, view: 'available' },
        ]
      case 'officer':
        return [
          ...baseItems,
          { label: 'All Incidents', icon: FileText, view: 'incidents' },
          { label: 'Team Management', icon: Users, view: 'team' },
        ]
      case 'admin':
        return [
          ...baseItems,
          { label: 'Analytics', icon: BarChart3, view: 'analytics' },
          { label: 'Reports', icon: FileText, view: 'reports' },
          { label: 'Audit Logs', icon: FileText, view: 'audit' },
        ]
      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-full px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="text-2xl">🏙️</div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-primary truncate">CityPulse</h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.view}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(item.view)}
                className="text-sm"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:text-right">
              <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title="Logout"
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-border pt-4">
            {menuItems.map((item) => (
              <Button
                key={item.view}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate(item.view)
                  setIsMenuOpen(false)
                }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
