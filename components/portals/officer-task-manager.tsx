'use client'

import { useState, useEffect } from 'react'
import { User, Ticket, TicketStatus } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { fetchTickets } from '@/lib/api'
import { storage } from '@/lib/storage' // Keeping storage only for static list of field staff
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import TicketCard from '@/components/tickets/ticket-card'
import { Users, Zap, Search, Filter, AlertTriangle, Clock, RefreshCw } from 'lucide-react'

interface OfficerTaskManagerProps {
  currentUser: User
}

export default function OfficerTaskManager({ currentUser }: OfficerTaskManagerProps) {
  // 1. STATE
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState('')

  // Static list of staff for the dropdown (Hackathon shortcut)
  const fieldStaff = storage.getUsers().filter((u) => u.role === 'field_staff')

  // 2. DATA FETCHING
  const loadData = async () => {
    setLoading(true)
    const data = await fetchTickets()
    setTickets(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('officer-task-manager')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchTickets().then(setTickets)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 3. FILTERING
  let filtered = tickets
  if (statusFilter !== 'all') {
    filtered = filtered.filter((t) => t.status === statusFilter)
  }
  if (severityFilter !== 'all') {
    filtered = filtered.filter((t) => t.severity === severityFilter)
  }
  if (searchTerm) {
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketNumber.includes(searchTerm)
    )
  }

  // 4. ASSIGNMENT LOGIC
  const handleAssignTask = async () => {
    if (!selectedTicket || !selectedStaff) {
      alert('Please select both a staff member and a ticket')
      return
    }

    try {
      const { error } = await supabase
        .from('incidents')
        .update({ 
          assigned_to: selectedStaff, 
          status: 'assigned' 
        })
        .eq('id', selectedTicket.id)

      if (error) throw error

      alert(`Task assigned successfully to ${selectedStaff}!`)
      setAssignModalOpen(false)
      setSelectedStaff('')
      setSelectedTicket(null)
      // UI updates via Realtime

    } catch (err) {
      console.error('Assignment error:', err)
      alert('Failed to assign task')
    }
  }

  const unassignedTickets = filtered.filter((t) => !t.assignedTo)
  const assignedTickets = filtered.filter((t) => t.assignedTo)

  // Tailwind class for native select to match UI
  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  // --- RENDER ---
  return (
    <div className="space-y-6 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-white p-6 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            Task Management
            {loading && <RefreshCw className="h-5 w-5 animate-spin text-white/80" />}
          </h2>
        </div>
        <p className="text-orange-50">Assign incidents to field staff and track progress</p>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block" htmlFor="search-input">Search</label>
          <Input
            id="search-input"
            placeholder="Search by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            aria-label="Search tickets"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block" htmlFor="status-select">Status</label>
          {/* FIX: Using native select */}
          <select 
            id="status-select"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
            className={inputClass}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block" htmlFor="severity-select">Severity</label>
          {/* FIX: Using native select */}
          <select 
            id="severity-select"
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            className={inputClass}
            aria-label="Filter by severity"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button 
            className="w-full bg-primary hover:bg-orange-600 text-white h-10"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setSeverityFilter('all')
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{filtered.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
        </Card>
        <Card className="p-4 text-center bg-red-50 border-red-200">
          <p className="text-2xl font-bold text-red-600">{filtered.filter((t) => t.severity === 'critical').length}</p>
          <p className="text-xs text-muted-foreground mt-1">Critical</p>
        </Card>
        <Card className="p-4 text-center bg-blue-50 border-blue-200">
          <p className="text-2xl font-bold text-blue-600">{unassignedTickets.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Unassigned</p>
        </Card>
        <Card className="p-4 text-center bg-emerald-50 border-emerald-200">
          <p className="text-2xl font-bold text-emerald-600">{assignedTickets.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Assigned</p>
        </Card>
      </div>

      {/* Unassigned Tasks */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Unassigned Tasks ({unassignedTickets.length})
        </h3>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {unassignedTickets.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">All tasks are assigned!</Card>
          ) : (
            unassignedTickets.map((ticket) => (
              <div key={ticket.id} className="relative">
                <TicketCard
                  ticket={ticket}
                  onClick={() => {
                    setSelectedTicket(ticket)
                    setAssignModalOpen(true)
                  }}
                  clickable
                />
                <Button
                  onClick={() => {
                    setSelectedTicket(ticket)
                    setAssignModalOpen(true)
                  }}
                  className="absolute top-4 right-4 bg-primary hover:bg-orange-600 text-white text-xs h-8 sm:h-10 px-3"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Assign
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assigned Tasks */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Assigned Tasks ({assignedTickets.length})
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {assignedTickets.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">No assigned tasks</Card>
          ) : (
            assignedTickets.map((ticket) => (
              <div key={ticket.id}>
                {/* FIX: Removed 'badge' prop which caused TypeScript error */}
                <TicketCard
                  ticket={ticket}
                  onClick={() => {
                    // Optional: View detail logic could go here
                  }}
                  clickable
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Assign Task</h3>
            <p className="text-sm text-muted-foreground">{selectedTicket.title}</p>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2" htmlFor="staff-select">Select Field Staff</label>
              {/* FIX: Using native select */}
              <select
                id="staff-select"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className={inputClass}
                aria-label="Select field staff"
              >
                <option value="">Choose staff member...</option>
                {fieldStaff.map((staff) => (
                  <option key={staff.id} value={staff.name}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAssignTask}
                className="flex-1 bg-primary hover:bg-orange-600 text-white h-10"
              >
                Assign Task
              </Button>
              <Button
                onClick={() => {
                  setAssignModalOpen(false)
                  setSelectedTicket(null)
                  setSelectedStaff('')
                }}
                variant="outline"
                className="flex-1 h-10"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}