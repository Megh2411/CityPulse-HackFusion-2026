'use client'

import { useState } from 'react'
import { User } from '@/lib/types'
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LoginPageProps {
  onLoginSuccess: (user: User) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (email: string) => {
    setIsLoading(true)
    const users = storage.getUsers()
    const user = users.find((u) => u.email === email)

    if (user) {
      user.lastLogin = new Date().toISOString()
      storage.setCurrentUser(user)
      setTimeout(() => {
        onLoginSuccess(user)
        setIsLoading(false)
      }, 500)
    }
  }

  const roles = [
    {
      id: 'citizen',
      name: 'Citizen',
      email: 'citizen@citypulse.local',
      description: 'Report incidents in your area',
      icon: '👤',
    },
    {
      id: 'field_staff',
      name: 'Field Staff',
      email: 'sarah@citypulse.local',
      description: 'Respond and fix incidents',
      icon: '🔧',
    },
    {
      id: 'officer',
      name: 'Officer',
      email: 'mike@citypulse.local',
      description: 'Manage operations and assignments',
      icon: '👮',
    },
    {
      id: 'admin',
      name: 'Admin',
      email: 'admin@citypulse.local',
      description: 'View analytics and reports',
      icon: '⚙️',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">CityPulse</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Urban Incident Management System</p>
        </div>

        {/* Login Cards */}
        <div className="space-y-3">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`p-4 sm:p-5 cursor-pointer transition-all border-2 hover:shadow-md ${
                selectedRole === role.id
                  ? 'border-primary bg-orange-50 shadow-lg'
                  : 'border-border hover:border-primary/50 bg-white'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{role.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Login Button */}
        {selectedRole && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Button
              onClick={() => handleLogin(roles.find((r) => r.id === selectedRole)?.email || '')}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-orange-600 text-white h-12 sm:h-14 text-base font-semibold transition-all"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Logging in...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Demo mode. Select any role to explore the system.
          </p>
        </div>
      </div>
    </div>
  )
}
