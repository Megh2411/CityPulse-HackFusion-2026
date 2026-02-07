'use client'

import React, { useState, useEffect, useRef } from 'react'
import { User, Ticket, IncidentCategory, Severity, CATEGORY_LABELS } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { fetchTickets, createTicket } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import TicketCard from '@/components/tickets/ticket-card'
import IncidentMap from '@/components/map/incident-map'
import { detectDuplicates } from '@/lib/duplicate-detection'
import { calculateCityAnalytics } from '@/lib/analytics'
import { TimeSeriesChart, CategoryDistributionChart, SeverityDistributionChart } from '@/components/charts/incident-charts'
import { MapPin, Send, Upload, AlertCircle, CheckCircle, Clock, TrendingUp, RefreshCw } from 'lucide-react'
import AuditTimeline from '@/components/tickets/audit-timeline'

interface CitizenPortalEnhancedProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}

export default function CitizenPortalEnhanced({ currentUser, onNavigate, currentView }: CitizenPortalEnhancedProps) {
  // 1. STATE: Live data from Supabase
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole' as IncidentCategory,
    severity: 'medium' as Severity,
    location: '',
    latitude: 40.7128,
    longitude: -74.006,
  })

  // 2. DATA FETCHING & REALTIME
  const loadData = async () => {
    setLoading(true)
    const data = await fetchTickets()
    setTickets(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('citizen-portal-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchTickets().then(setTickets)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const myReports = tickets.filter((t) => t.reportedBy === currentUser.name)
  const analytics = calculateCityAnalytics(tickets)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setUploadedImages((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  const handleSubmitReport = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    // Prepare ticket object for duplicate detection
    const tempTicket = {
      ...formData,
      id: 'temp',
      ticketNumber: 'temp',
      status: 'open',
      reportedBy: currentUser.name,
      reportedAt: new Date().toISOString(),
      images: uploadedImages,
      comments: [],
      audit: [],
      tags: [],
      isDuplicate: false,
    }

    // Check for duplicates
    const matches = detectDuplicates(tempTicket as any, tickets)

    if (matches.length > 0 && duplicateMatches.length === 0) {
      setDuplicateMatches(matches)
      return
    }

    try {
      // 3. API CALL: Create Ticket in Supabase
      const { error } = await createTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        reportedBy: currentUser.name,
        images: uploadedImages
      })

      if (error) throw error

      // Reset Form
      setShowReportForm(false)
      onNavigate('my-reports') // Redirect to list
      setFormData({
        title: '',
        description: '',
        category: 'pothole',
        severity: 'medium',
        location: '',
        latitude: 40.7128,
        longitude: -74.006,
      })
      setUploadedImages([])
      setDuplicateMatches([])
      
    } catch (err) {
      console.error('Error creating ticket:', err)
      alert('Failed to submit report. Please try again.')
    }
  }

  // --- VIEW: CITY WIDE ---
  if (currentView === 'city-wide') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
                City-Wide Incidents
                {loading && <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />}
              </h1>
              <p className="text-muted-foreground mt-2">Real-time view of all reported incidents across your city</p>
            </div>
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Report Incident
            </button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Incidents</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.totalIncidents}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-primary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Resolution</p>
                  <p className="text-3xl font-bold text-foreground">{Math.round(analytics.averageResolutionTime)}h</p>
                </div>
                <Clock className="w-12 h-12 text-secondary" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Critical Areas</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.criticalAreas.length}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-destructive" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Duplicate Rate</p>
                  <p className="text-3xl font-bold text-foreground">{Math.round(analytics.duplicateRate)}%</p>
                </div>
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Incident Distribution Map</h2>
            <IncidentMap incidents={tickets.filter((t) => t.status !== 'closed')} />
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <TimeSeriesChart analytics={analytics} />
            </Card>
            <Card className="p-6">
              <CategoryDistributionChart analytics={analytics} />
            </Card>
            <Card className="p-6">
              <SeverityDistributionChart analytics={analytics} />
            </Card>
          </div>

          {/* Critical Areas */}
          {analytics.criticalAreas.length > 0 && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Critical Areas (High Activity)</h2>
              <div className="space-y-2">
                {analytics.criticalAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {area.latitude.toFixed(4)}, {area.longitude.toFixed(4)}
                        </p>
                        <p className="text-sm text-muted-foreground">{area.category}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">{area.incidentCount}</p>
                      <p className="text-xs text-muted-foreground">{area.severity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // --- VIEW: REPORT FORM ---
  if (currentView === 'report' || showReportForm) {
    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={() => onNavigate('my-reports')} className="text-primary hover:underline flex items-center gap-2 mb-4">
              ← Back to My Reports
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Report an Incident</h1>
            <p className="text-muted-foreground mt-2">Help us improve your city by reporting issues</p>
          </div>

          {/* Duplicate Warning */}
          {duplicateMatches.length > 0 && (
            <Card className="p-6 mb-6 border-yellow-200 bg-yellow-50">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Similar Incidents Found
              </h3>
              <p className="text-sm text-foreground mb-4">We found {duplicateMatches.length} similar incident(s). Please review before submitting:</p>
              <div className="space-y-2">
                {duplicateMatches.map((match) => {
                  const matchTicket = tickets.find((t) => t.id === match.ticketId)
                  return (
                    <div key={match.ticketId} className="p-3 bg-white rounded border border-yellow-200">
                      <p className="font-semibold text-foreground">{matchTicket?.title}</p>
                      <p className="text-sm text-muted-foreground">{match.reason}</p>
                      <p className="text-sm font-bold text-yellow-700">{match.similarity}% similar</p>
                    </div>
                  )
                })}
              </div>
              <Button onClick={() => {
                  setDuplicateMatches([]) // Clear duplicates to allow submission next click
                  handleSubmitReport() // Trigger submit
                }} 
                className="mt-4 w-full"
              >
                Continue Anyway
              </Button>
            </Card>
          )}

          <Card className="p-8">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="title-input">Incident Title *</label>
                <Input
                  id="title-input"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full"
                  aria-label="Incident title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="desc-input">Detailed Description *</label>
                <Textarea
                  id="desc-input"
                  placeholder="Provide details about the incident"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32"
                  aria-label="Incident description"
                />
              </div>

              {/* Category and Severity - Using Native Selects for A11y & Compatibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="category-select">Category *</label>
                  <select
                    id="category-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IncidentCategory })}
                    className={inputClass}
                    aria-label="Select incident category"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="severity-select">Severity Level *</label>
                  <select 
                    id="severity-select"
                    value={formData.severity} 
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
                    className={inputClass}
                    aria-label="Select incident severity"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="location-input">Location *</label>
                <Input 
                  id="location-input"
                  placeholder="Street address or landmark" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                  className="w-full"
                  aria-label="Location"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="lat-input">Latitude</label>
                  <Input
                    id="lat-input"
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    aria-label="Latitude"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="long-input">Longitude</label>
                  <Input
                    id="long-input"
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    aria-label="Longitude"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Upload Photos (Optional)</label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Upload photos"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 mx-auto"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
                  </button>
                </div>

                {/* Preview uploaded images */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-foreground mb-2">{uploadedImages.length} image(s) uploaded</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img || "/placeholder.svg"} alt={`Upload ${idx}`} className="w-full h-24 object-cover rounded border border-muted" />
                          <button
                            onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button onClick={handleSubmitReport} className="w-full py-6 text-lg font-bold">
                <Send className="w-5 h-5 mr-2" /> Submit Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // --- VIEW: MY REPORTS ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Reports</h1>
            <p className="text-muted-foreground mt-2">Track your submitted incidents and their status</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => onNavigate('city-wide')} className="bg-secondary text-secondary-foreground">
              View City-Wide
            </Button>
            <Button onClick={() => onNavigate('report')} className="bg-primary text-primary-foreground">
              + New Report
            </Button>
          </div>
        </div>

        {myReports.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No incidents reported yet</p>
            <Button onClick={() => onNavigate('report')} className="mt-4 bg-primary">
              Report Your First Incident
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {myReports.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => setSelectedTicket(ticket)}
                clickable
              />
            ))}
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <button
                onClick={() => setSelectedTicket(null)}
                className="mb-4 text-muted-foreground hover:text-foreground"
              >
                ← Close
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedTicket.title}</h2>
              <p className="text-muted-foreground mb-6">{selectedTicket.ticketNumber}</p>
              <AuditTimeline auditLogs={selectedTicket.audit} />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}