'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Users, Zap, BarChart3, MapPin, Clock, CheckCircle, TrendingUp } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground hidden sm:block">CityPulse</h1>
          </div>
          <Button onClick={onGetStarted} className="bg-primary hover:bg-orange-600 text-white px-6">
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Real-Time Urban <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Incident Management</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Empower communities to report incidents instantly. Enable officers to respond faster. Transform your city into a connected, resilient urban ecosystem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} className="bg-primary hover:bg-orange-600 text-white h-12 px-8 text-lg font-semibold">
              Get Started Free
            </Button>
            <Button variant="outline" className="h-12 px-8 text-lg font-semibold border-2">
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Real-time Monitoring</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-secondary">100%</p>
              <p className="text-sm text-muted-foreground">Transparent Audit Trail</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-orange-600">∞</p>
              <p className="text-sm text-muted-foreground">Scalable System</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">Why Choose CityPulse?</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Users,
                title: 'Multi-Role Access',
                description: 'Citizens, Officers, Field Staff, and Admin with custom workflows',
              },
              {
                icon: MapPin,
                title: 'Geographic Insights',
                description: 'Real-time heatmaps and incident density overlays across the city',
              },
              {
                icon: Zap,
                title: 'Instant Assignment',
                description: 'Officers assign tasks instantly to field teams with live updates',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Performance metrics, KPIs, and comprehensive reporting',
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition space-y-3">
                <feature.icon className="w-8 h-8 text-primary" />
                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">How It Works</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: AlertTriangle, step: '1', title: 'Report', desc: 'Citizens report incidents with photos' },
              { icon: Zap, step: '2', title: 'Assign', desc: 'Officers assign tasks to field teams' },
              { icon: Clock, step: '3', title: 'Respond', desc: 'Field staff responds and updates status' },
              { icon: CheckCircle, step: '4', title: 'Resolve', desc: 'Incident marked complete with audit trail' },
            ].map((item, idx) => (
              <div key={idx} className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <item.icon className="w-6 h-6 text-muted-foreground hidden sm:block" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">Built for Everyone</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                role: 'Citizens',
                icon: '👤',
                features: ['Report incidents', 'Track status', 'View city updates'],
              },
              {
                role: 'Field Staff',
                icon: '🔧',
                features: ['Accept tasks', 'Update progress', 'Add photos & notes'],
              },
              {
                role: 'Officers',
                icon: '👮',
                features: ['Manage incidents', 'Assign teams', 'Monitor progress'],
              },
              {
                role: 'Admins',
                icon: '⚙️',
                features: ['Analytics', 'Reports', 'System settings'],
              },
            ].map((user, idx) => (
              <Card key={idx} className="p-6 space-y-4 hover:shadow-lg transition">
                <div className="text-4xl">{user.icon}</div>
                <h4 className="text-xl font-semibold text-foreground">{user.role}</h4>
                <ul className="space-y-2">
                  {user.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your City?</h3>
          <p className="text-lg text-orange-50">Join thousands of cities using CityPulse for incident management</p>
          <Button onClick={onGetStarted} className="bg-white text-primary hover:bg-orange-50 h-12 px-8 text-lg font-semibold">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">CityPulse</h4>
              <p className="text-sm text-orange-100">Real-time urban incident management platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-orange-100">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-orange-100">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-orange-100">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-orange-100">
            <p>&copy; 2024 CityPulse. All rights reserved.</p>
            <p>Transforming urban infrastructure management</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
