'use client'

import React, { useState, useEffect, useRef } from 'react'
import { User, Ticket, IncidentCategory, Severity, CATEGORY_LABELS } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { createTicket, fetchTickets } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import TicketCard from '@/components/tickets/ticket-card'
import IncidentMap from '@/components/map/incident-map'
import { detectDuplicates } from '@/lib/duplicate-detection'
import { calculateCityAnalytics } from '@/lib/analytics'
import { TimeSeriesChart, CategoryDistributionChart, SeverityDistributionChart } from '@/components/charts/incident-charts'
import { MapPin, Send, AlertCircle, CheckCircle, Clock, TrendingUp, RefreshCw, LogOut, Camera, X } from 'lucide-react'
import AuditTimeline from '@/components/tickets/audit-timeline'

interface CitizenPortalEnhancedProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
  onLogout: () => void
}

export default function CitizenPortalEnhanced({ currentUser, onNavigate, currentView, onLogout }: CitizenPortalEnhancedProps) {
  // 1. STATE: Live data from Supabase
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([])
  
  // Camera & Image State
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isCameraOpen, setIsCameraOpen] = useState(false)

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

  // --- GEOLOCATION LOGIC ---
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          // Autofill location text if empty to indicate success
          location: prev.location ? prev.location : `GPS Detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        }))
      },
      (err) => {
        console.error("Location error:", err)
        alert("Unable to retrieve location. Please allow location access.")
      }
    )
  }

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      setIsCameraOpen(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Rear camera preferred
      })
      // Small timeout to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (err) {
      console.error("Camera error:", err)
      alert("Unable to access camera. Please verify permissions.")
      setIsCameraOpen(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg")
      
      setUploadedImages(prev => [...prev, imageData])
      getCurrentLocation() // Auto-grab GPS when photo is taken
      stopCamera()
    }
  }

  const handleSubmitReport = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

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

    const matches = detectDuplicates(tempTicket as any, tickets)

    if (matches.length > 0 && duplicateMatches.length === 0) {
      setDuplicateMatches(matches)
      return
    }

    try {
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

      setShowReportForm(false)
      onNavigate('my-reports')
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
            <div className="flex gap-2">
              <Button
                onClick={() => onNavigate('report')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Report Incident
              </Button>
              <Button onClick={onLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
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

              {/* Category and Severity - Using Native Selects */}
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
                <div className="flex gap-2">
                  <Input 
                    id="location-input"
                    placeholder="Street address or landmark" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                    className="w-full"
                    aria-label="Location"
                  />
                  <Button 
                    onClick={getCurrentLocation} 
                    variant="outline" 
                    title="Get Current GPS Location"
                    aria-label="Get current GPS location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
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

              {/* Camera Photo Capture */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Evidence Photo (Optional)</label>
                
                {isCameraOpen ? (
                  <div className="mb-4 bg-black rounded-lg overflow-hidden border border-gray-700">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                    <div className="p-4 flex justify-center gap-4 bg-muted border-t border-border">
                      <Button onClick={capturePhoto} className="bg-white text-black hover:bg-gray-200" title="Capture Photo">
                        <Camera className="w-4 h-4 mr-2" /> Capture
                      </Button>
                      <Button onClick={stopCamera} variant="destructive" title="Cancel Camera">
                        Cancel
                      </Button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                ) : (
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    className="w-full h-24 border-dashed border-2 flex flex-col gap-2 hover:bg-muted/50"
                    title="Open Camera"
                  >
                    <Camera className="w-8 h-8 text-muted-foreground" />
                    <span className="text-muted-foreground">Take a Photo at Scene</span>
                  </Button>
                )}

                {/* Preview Captured Images */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-foreground mb-2">{uploadedImages.length} photo(s) captured</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Capture ${idx + 1}`} className="w-full h-24 object-cover rounded border border-muted" />
                          <button
                            onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-red-600 transition-colors"
                            aria-label="Remove photo"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
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
            <Button onClick={onLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
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
                aria-label="Close details"
              >
                ← Close
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedTicket.title}</h2>
              <p className="text-muted-foreground mb-6">{selectedTicket.ticketNumber}</p>
              <AuditTimeline auditLogs={selectedTicket.audit || []} />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}