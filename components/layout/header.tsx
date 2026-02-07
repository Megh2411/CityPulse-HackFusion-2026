'use client'

import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut, Home, Bell, Settings } from 'lucide-react'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface HeaderProps {
  currentUser?: User
  onLogout?: () => void
  onNavigate?: (view: string) => void
  showNav?: boolean
}

export default function Header({ currentUser, onLogout, onNavigate, showNav = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = currentUser
    ? [
        { label: 'Home', icon: Home, action: () => onNavigate?.('home') },
        { label: 'Notifications', icon: Bell, action: () => {} },
        { label: 'Settings', icon: Settings, action: () => {} },
      ]
    : []

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-muted shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground hidden sm:block">CityPulse</h1>
        </div>

        {/* Desktop Navigation */}
        {showNav && currentUser && (
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={item.action}
                className="text-foreground hover:bg-muted"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        )}

        {/* User Section */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          )}

          {currentUser && onLogout && (
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}

          {/* Mobile Menu Button */}
          {showNav && currentUser && (
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && showNav && currentUser && (
        <div className="md:hidden border-t border-muted bg-white">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => {
                  item.action()
                  setMobileMenuOpen(false)
                }}
                variant="ghost"
                className="w-full justify-start text-foreground hover:bg-muted"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
            <div className="border-t border-muted pt-2 mt-2">
              <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
