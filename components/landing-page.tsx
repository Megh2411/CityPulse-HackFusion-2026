'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Users, MapPin } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              CityPulse
            </span>
          </div>
          <Button 
            onClick={onGetStarted} 
            variant="ghost" 
            className="font-semibold hover:bg-blue-50"
          >
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-700">
              Connecting citizens with local government
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Build Better Cities,
            <br/>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              One Report at a Time
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Report civic issues instantly and track real-time progress as your city responds. 
            Empowering communities through transparent, efficient problem-solving.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/30"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              </div>
              <span className="font-medium text-gray-700">10,000+ active users</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-gray-700">Average 48hr response time</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="pb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CityPulse Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A seamless platform designed to bridge the gap between citizens and city services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-7 w-7 text-amber-500" />}
              title="Instant Reporting"
              desc="Capture the issue with a photo, drop a pin on the map, and submit in seconds. Our intelligent system categorizes and routes your report automatically."
              gradient="from-amber-50 to-orange-50"
              iconBg="bg-amber-100"
            />
            <FeatureCard 
              icon={<Shield className="h-7 w-7 text-emerald-600" />}
              title="Transparent Tracking"
              desc="Follow your report's journey from submission to resolution. Get real-time notifications as city officials review, prioritize, and take action."
              gradient="from-emerald-50 to-teal-50"
              iconBg="bg-emerald-100"
            />
            <FeatureCard 
              icon={<Users className="h-7 w-7 text-blue-600" />}
              title="Community Impact"
              desc="Discover nearby issues, support reports that matter to you, and see the collective impact your community is making in improving your city."
              gradient="from-blue-50 to-indigo-50"
              iconBg="bg-blue-100"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">CityPulse</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 CityPulse. Building better cities together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  desc,
  gradient,
  iconBg
}: { 
  icon: React.ReactNode
  title: string
  desc: string
  gradient: string
  iconBg: string
}) {
  return (
    <div className={`group relative p-8 bg-gradient-to-br ${gradient} rounded-2xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className={`mb-6 ${iconBg} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  )
}