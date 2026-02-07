'use client'

import { useState, useEffect } from 'react'
import { User, Ticket, TicketStatus } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { fetchTickets, updateTicketStatus } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import IncidentMap from '@/components/map/incident-map'
import { CheckCircle, AlertCircle, Clock, MessageSquare, MapPin, RefreshCw } from 'lucide-react'
import AuditTimeline from '@/components/tickets/audit-timeline'

// Helper for state transitions (Local definition to ensure it works)
const getValidTransitions = (status: TicketStatus): TicketStatus[] => {
  switch (status) {
    case 'assigned': return ['in_progress']
    case 'in_progress': return ['on_hold', 'resolved']
    case 'on_hold': return ['in_progress', 'resolved']
    case 'resolved': return [] // Can't move from resolved
    default: return []
  }
}

interface FieldStaffEnhancedProps {
  currentUser: User
  onLogout: () => void
}

export default function FieldStaffEnhanced({ currentUser, onLogout }: FieldStaffEnhancedProps) {
  // 1. STATE: Live data
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [view, setView] = useState<'list' | 'map' | 'detail'>('list')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all')
  const [newComment, setNewComment] = useState('')

  // 2. FETCH DATA & REALTIME
  const loadData = async () => {
    setLoading(true)
    const data = await fetchTickets()
    setTickets(data)
    setLoading(false)
    
    // Update selected ticket reference if it exists
    if (selectedTicket) {
      const updated = data.find(t => t.id === selectedTicket.id)
      if (updated) setSelectedTicket(updated)
    }
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('field-staff-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        // Refresh full list on incident change
        fetchTickets().then((data) => {
          setTickets(data)
          // Update selected ticket in view if open
          if (selectedTicket) {
             const updated = data.find(t => t.id === selectedTicket.id)
             if (updated) setSelectedTicket(updated)
          }
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, () => {
        // Refresh on new comment
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
  }, [selectedTicket?.id]) // Re-bind if selection changes to ensure correct updates

  const assignedTickets = tickets.filter((t) => t.assignedTo === currentUser.name && t.status !== 'closed')
  
  const filtered = filterStatus === 'all' 
    ? assignedTickets 
    : assignedTickets.filter((t) => t.status === filterStatus)

  // 3. ACTIONS
  const handleAcceptTicket = async (ticket: Ticket) => {
    try {
      await updateTicketStatus(ticket.id, 'in_progress', currentUser.name)
      // Realtime subscription will handle UI update
    } catch (error) {
      console.error('Error accepting ticket:', error)
    }
  }

  const handleStatusTransition = async (ticket: Ticket, newStatus: TicketStatus) => {
    try {
      await updateTicketStatus(ticket.id, newStatus, currentUser.name)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleAddComment = async (ticket: Ticket) => {
    if (!newComment.trim()) return

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          incident_id: ticket.id,
          author: currentUser.name,
          author_role: currentUser.role,
          content: newComment
        })

      if (error) throw error
      setNewComment('')
      
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add note')
    }
  }

  const getPriorityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-emerald-100 text-emerald-800',
    }
    return colors[severity] || 'bg-gray-100'
  }

  // --- VIEW: MAP ---
  if (view === 'map') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50">
        <div className="fixed top-4 left-4 right-4 z-10 flex gap-2 md:hidden">
          <Button
            onClick={() => setView('list')}
            className="flex-1 py-2 bg-white text-foreground border border-muted"
          >
            List
          </Button>
          <Button onClick={() => setView('map')} className="flex-1 py-2 bg-primary text-primary-foreground">
            Map
          </Button>
        </div>

        <div className="hidden md:fixed md:left-4 md:top-4 md:flex md:flex-col md:gap-2 md:z-10">
          <Button onClick={() => setView('list')} className="bg-white text-foreground border border-muted">
            Back to List
          </Button>
        </div>

        <IncidentMap incidents={filtered} />

        <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:top-20 md:right-4 md:left-auto md:w-80">
          <Card className="p-4">
            <h3 className="font-bold text-foreground mb-2">Assigned Tasks</h3>
            <p className="text-2xl font-bold text-primary">{filtered.length}</p>
            <p className="text-sm text-muted-foreground">Click on markers for details</p>
          </Card>
        </div>
      </div>
    )
  }

  // --- VIEW: DETAIL ---
  if (view === 'detail' && selectedTicket) {
    const validTransitions = getValidTransitions(selectedTicket.status)

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Button onClick={() => setView('list')} className="mb-4 bg-white text-foreground border border-muted">
            ← Back to Tasks
          </Button>

          <Card className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground">{selectedTicket.title}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getPriorityColor(selectedTicket.severity)}`}>
                  {selectedTicket.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-muted-foreground">{selectedTicket.ticketNumber}</p>
            </div>

            {/* Quick Actions */}
            {selectedTicket.status === 'assigned' && (
              <Button
                onClick={() => handleAcceptTicket(selectedTicket)}
                className="w-full mb-6 py-3 bg-secondary text-secondary-foreground"
              >
                Accept & Start Work
              </Button>
            )}

            {/* Status Transitions */}
            {validTransitions.length > 0 && selectedTicket.status !== 'assigned' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-foreground mb-3">Update Status:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {validTransitions.map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusTransition(selectedTicket, status)}
                      className="py-2 bg-primary/20 text-primary border border-primary hover:bg-primary/30"
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground mt-1">{selectedTicket.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-foreground">{selectedTicket.location}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-foreground mt-1 capitalize">{selectedTicket.category.replace('_', ' ')}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                <p className="text-foreground mt-1 capitalize">{selectedTicket.status.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Images */}
            {selectedTicket.images && selectedTicket.images.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">Reported Photos ({selectedTicket.images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedTicket.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img || "/placeholder.svg"}
                      alt={`Incident ${idx}`}
                      className="w-full h-24 object-cover rounded border border-muted"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-muted pt-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Progress Notes
              </h3>

              {selectedTicket.comments && selectedTicket.comments.map((comment) => (
                <div key={comment.id} className="mb-4 p-3 bg-muted rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground text-sm">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <Textarea
                  placeholder="Add progress note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleAddComment(selectedTicket)}
                  className="bg-primary text-primary-foreground"
                >
                  Add Note
                </Button>
              </div>
            </div>
            
            {/* Audit Log */}
            <div className="mt-8 border-t border-muted pt-6">
               {selectedTicket.audit && <AuditTimeline auditLogs={selectedTicket.audit} />}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // --- VIEW: LIST (Default) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
              My Assigned Tasks
              {loading && <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />}
            </h1>
            <p className="text-muted-foreground mt-2">Welcome, {currentUser.name}! 🙏 Your work dashboard</p>
          </div>
          <Button onClick={onLogout} className="w-full md:w-auto bg-destructive text-destructive-foreground">
            Logout
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6 md:gap-4">
          <Button
            onClick={() => setView('list')}
            className={`flex-1 md:flex-none ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground border border-muted'}`}
          >
            List View
          </Button>
          <Button
            onClick={() => setView('map')}
            className={`flex-1 md:flex-none ${view === 'map' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground border border-muted'}`}
          >
            Map View
          </Button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label htmlFor="status-filter" className="sr-only">Filter Status</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
            className="w-full md:w-64 px-4 py-2 border border-muted rounded-lg bg-white text-foreground"
          >
            <option value="all">All Tasks</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold text-foreground">{assignedTickets.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-primary">
              {assignedTickets.filter((t) => t.status === 'in_progress').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">On Hold</p>
            <p className="text-2xl font-bold text-yellow-600">
              {assignedTickets.filter((t) => t.status === 'on_hold').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold text-emerald-600">
              {assignedTickets.filter((t) => t.status === 'resolved').length}
            </p>
          </Card>
        </div>

        {/* Task List */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No tasks found</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered
              .sort((a, b) => {
                const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
                return severityOrder[a.severity as keyof typeof severityOrder] -
                  severityOrder[b.severity as keyof typeof severityOrder]
              })
              .map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => {
                    setSelectedTicket(ticket)
                    setView('detail')
                  }}
                  className="cursor-pointer"
                >
                  <Card className="p-4 hover:shadow-lg transition border-l-4 border-primary">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-foreground">{ticket.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full font-bold ${getPriorityColor(ticket.severity)}`}>
                            {ticket.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.ticketNumber}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{ticket.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                          ticket.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.status === 'on_hold'
                              ? 'bg-yellow-100 text-yellow-800'
                              : ticket.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-orange-100 text-orange-800'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        {ticket.status === 'assigned' && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                        {ticket.estimatedCompletion && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(ticket.estimatedCompletion).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}