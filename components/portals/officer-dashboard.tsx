'use client'

import { useState, useEffect } from 'react'
import { User, Ticket, TicketStatus } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { fetchTickets } from '@/lib/api' 
import { storage } from '@/lib/storage' // Keeping storage for static user list
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import TicketCard from '@/components/tickets/ticket-card'
import OfficerTaskManager from '@/components/portals/officer-task-manager'
import AuditTimeline from '@/components/tickets/audit-timeline'
import { Zap, AlertTriangle, Filter, Search, RefreshCw, BarChart, MapPin, MessageSquare, Clock } from 'lucide-react'

interface OfficerDashboardProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}

export default function OfficerDashboard({ currentUser, onNavigate, currentView }: OfficerDashboardProps) {
  // 1. STATE: Live Data
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Static users list
  const fieldStaff = storage.getUsers().filter((u) => u.role === 'field_staff')

  // 2. DATA FETCHING
  const loadData = async () => {
    setLoading(true)
    const data = await fetchTickets()
    setTickets(data)
    setLoading(false)
    
    // Update selected ticket if open
    if (selectedTicket) {
      const updated = data.find(t => t.id === selectedTicket.id)
      if (updated) setSelectedTicket(updated)
    }
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('officer-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchTickets().then((data) => {
          setTickets(data)
          if (selectedTicket) {
             const updated = data.find(t => t.id === selectedTicket.id)
             if (updated) setSelectedTicket(updated)
          }
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket?.id])

  // 3. FILTER LOGIC
  let filteredTickets = tickets
  if (statusFilter !== 'all') {
    filteredTickets = filteredTickets.filter((t) => t.status === statusFilter)
  }
  if (severityFilter !== 'all') {
    filteredTickets = filteredTickets.filter((t) => t.severity === severityFilter)
  }
  if (searchTerm) {
    filteredTickets = filteredTickets.filter(
      (t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketNumber.includes(searchTerm)
    )
  }

  const stats = {
    total: tickets.length,
    critical: tickets.filter((t) => t.severity === 'critical').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  }

  // 4. ASSIGNMENT ACTION
  const handleAssignTicket = async (ticketId: string, staffName: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ 
          assigned_to: staffName, 
          status: 'assigned' 
        })
        .eq('id', ticketId)

      if (error) throw error

      alert(`Ticket assigned to ${staffName}`)
      
    } catch (err) {
      console.error('Assignment failed:', err)
      alert('Failed to assign ticket')
    }
  }

  // Team Management View
  if (currentView === 'team') {
    return <OfficerTaskManager currentUser={currentUser} />
  }

  // Home View
  if (currentView === 'home') {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 overflow-y-auto">
        {/* Dashboard Header */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            Operations Dashboard
            {loading && <RefreshCw className="h-5 w-5 animate-spin text-white/80" />}
          </h2>
          <p className="text-orange-50">Monitor and manage all urban incidents</p>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary">{stats.total}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Total Incidents</p>
          </Card>
          <Card className="p-4 text-center bg-red-50 border-red-200">
            <p className="text-2xl md:text-3xl font-bold text-red-600">{stats.critical}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Critical</p>
          </Card>
          <Card className="p-4 text-center bg-orange-50 border-orange-200">
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{stats.inProgress}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">In Progress</p>
          </Card>
          <Card className="p-4 text-center bg-emerald-50 border-emerald-200">
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">{stats.resolved}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Resolved</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={() => onNavigate('incidents')} className="bg-primary hover:bg-orange-600 text-white h-12">
            <Zap className="h-4 w-4 mr-2" />
            All Incidents
          </Button>
          
          {/* FIX: Correctly setting Severity Filter, not Status Filter */}
          <Button 
            onClick={() => {
              setSeverityFilter('critical')
              onNavigate('incidents')
            }} 
            variant="outline" 
            className="h-12"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical
          </Button>
          
          <Button onClick={() => onNavigate('team')} variant="outline" className="h-12">
            <BarChart className="h-4 w-4 mr-2" />
            Team
          </Button>
          <Button onClick={() => onNavigate('incidents')} variant="outline" className="h-12">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Recent Critical Incidents */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Recent Critical Incidents</h3>
          {stats.critical === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No critical incidents</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tickets
                .filter((t) => t.severity === 'critical')
                .slice(0, 3)
                .map((ticket) => (
                  <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                    <TicketCard ticket={ticket} clickable onClick={() => setSelectedTicket(ticket)} />
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Selected Ticket Modal (Reusable) */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <IncidentDetailView
                  ticket={selectedTicket}
                  onClose={() => setSelectedTicket(null)}
                  fieldStaff={fieldStaff}
                  onAssign={handleAssignTicket}
                />
             </div>
          </div>
        )}
      </div>
    )
  }

  // All Incidents View
  if (currentView === 'incidents') {
    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto overflow-y-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl md:text-3xl font-bold text-foreground">All Incidents</h2>
             <Button variant="ghost" onClick={() => onNavigate('home')}>← Back</Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or ticket #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
                aria-label="Search incidents"
              />
            </div>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={inputClass}
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={inputClass}
              aria-label="Filter by severity"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('all')
                setSeverityFilter('all')
                setSearchTerm('')
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* List */}
        {filteredTickets.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No incidents found matching criteria</p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Showing {filteredTickets.length} incidents</p>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                <TicketCard ticket={ticket} clickable onClick={() => setSelectedTicket(ticket)} />
              </div>
            ))}
          </div>
        )}

        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <IncidentDetailView
                  ticket={selectedTicket}
                  onClose={() => setSelectedTicket(null)}
                  fieldStaff={fieldStaff}
                  onAssign={handleAssignTicket}
                />
             </div>
          </div>
        )}
      </div>
    )
  }

  return null
}

function IncidentDetailView({
  ticket,
  onClose,
  fieldStaff,
  onAssign,
}: {
  ticket: Ticket
  onClose: () => void
  fieldStaff: User[]
  onAssign: (ticketId: string, staffName: string) => void
}) {
  const [selectedStaff, setSelectedStaff] = useState(ticket.assignedTo || '')
  
  const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6 shadow-2xl border-2 border-primary/20">
        <div className="flex justify-between items-start">
           <h2 className="text-2xl font-bold">Incident Details</h2>
           <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        
        <TicketCard ticket={ticket} expanded />

        {/* Assignment Section */}
        <div className="border-t border-border pt-6 space-y-3">
          <h3 className="font-bold text-lg">Assignment</h3>
          <div className="flex gap-2 flex-col sm:flex-row">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className={`${selectClass} flex-1`}
              aria-label="Assign to field staff"
            >
              <option value="">Assign to field staff...</option>
              {fieldStaff.map((staff) => (
                <option key={staff.id} value={staff.name}>
                  {staff.name} ({staff.department})
                </option>
              ))}
            </select>
            <Button
              onClick={() => onAssign(ticket.id, selectedStaff)}
              disabled={!selectedStaff}
              className="bg-primary hover:bg-orange-600 text-white"
            >
              Assign
            </Button>
          </div>
        </div>
        
        <div className="border-t border-border pt-6">
           <AuditTimeline auditLogs={ticket.audit || []} />
        </div>
      </Card>
    </div>
  )
}