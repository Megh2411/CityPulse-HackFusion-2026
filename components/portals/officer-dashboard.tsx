'use client'

import { useState } from 'react'
import { User, Ticket, TicketStatus } from '@/lib/types'
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import TicketCard from '@/components/tickets/ticket-card'
import AuditTimeline from '@/components/tickets/audit-timeline'
import { Zap, AlertTriangle, Clock, CheckCircle, Users, Filter, Search } from 'lucide-react'

interface OfficerDashboardProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}

export default function OfficerDashboard({ currentUser, onNavigate, currentView }: OfficerDashboardProps) {
  const [tickets, setTickets] = useState(storage.getTickets())
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [assignee, setAssignee] = useState('')

  const fieldStaff = storage.getUsers().filter((u) => u.role === 'field_staff')

  // Filter tickets
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

  const handleAssignTicket = (ticketId: string, staffName: string) => {
    const updated = storage.updateTicket(
      ticketId,
      { assignedTo: staffName, status: 'assigned' },
      currentUser.name,
      currentUser.role
    )

    if (updated) {
      setTickets(storage.getTickets())
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updated)
      }
      alert(`Ticket assigned to ${staffName}`)
    }
  }

  // Home view
  if (currentView === 'home') {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 overflow-y-auto">
        {/* Dashboard Header */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Operations Dashboard</h2>
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
          <Button onClick={() => setStatusFilter('critical')} variant="outline" className="h-12">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical
          </Button>
          <Button onClick={() => onNavigate('team')} variant="outline" className="h-12">
            <Users className="h-4 w-4 mr-2" />
            Team
          </Button>
          <Button onClick={() => onNavigate('incidents')} variant="outline" className="h-12">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Recent Critical Incidents */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Critical Incidents</h3>
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
                    <TicketCard ticket={ticket} clickable />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // All Incidents view
  if (currentView === 'incidents') {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto overflow-y-auto space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">All Incidents</h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or ticket #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Select>
            <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value)}>
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
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

        {selectedTicket ? (
          <IncidentDetailView
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            fieldStaff={fieldStaff}
            onAssign={handleAssignTicket}
          />
        ) : (
          <>
            {filteredTickets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No incidents found</p>
              </Card>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Showing {filteredTickets.length} incidents</p>
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                    <TicketCard ticket={ticket} clickable />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Team Management view
  if (currentView === 'team') {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Team Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fieldStaff.map((staff) => {
            const assignedCount = tickets.filter((t) => t.assignedTo === staff.name).length
            const completedCount = tickets.filter((t) => t.resolvedBy === staff.name).length

            return (
              <Card key={staff.id} className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{staff.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{staff.email}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Jobs</span>
                    <span className="font-bold text-primary">{assignedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="font-bold text-emerald-600">{completedCount}</span>
                  </div>
                  <div className="bg-muted rounded-full h-2 w-full mt-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${((completedCount / (assignedCount + completedCount || 1)) * 100).toFixed(0)}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
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

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onClose} className="mb-4">
        ← Back
      </Button>
      <Card className="p-6 space-y-6">
        <TicketCard ticket={ticket} expanded />

        {/* Assignment Section */}
        <div className="border-t border-border pt-6 space-y-3">
          <h3 className="font-bold text-lg">Assignment</h3>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Select
              value={selectedStaff}
              onValueChange={(value) => setSelectedStaff(value)}
            >
              <option value="">Assign to field staff...</option>
              {fieldStaff.map((staff) => (
                <option key={staff.id} value={staff.name}>
                  {staff.name} ({staff.department})
                </option>
              ))}
            </Select>
            <Button
              onClick={() => onAssign(ticket.id, selectedStaff)}
              disabled={!selectedStaff}
              className="bg-primary hover:bg-orange-600 text-white"
            >
              Assign
            </Button>
          </div>
        </div>

        <AuditTimeline auditLogs={ticket.audit} />
      </Card>
    </div>
  )
}
