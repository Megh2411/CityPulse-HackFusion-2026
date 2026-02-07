'use client'

import { useState } from 'react'
import { User, Ticket, TicketStatus, CATEGORY_LABELS } from '@/lib/types'
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import TicketCard from '@/components/tickets/ticket-card'
import AuditTimeline from '@/components/tickets/audit-timeline'
import { CheckCircle, MapPin, Navigation, MessageCircle } from 'lucide-react'

interface FieldStaffInterfaceProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}

export default function FieldStaffInterface({ currentUser, onNavigate, currentView }: FieldStaffInterfaceProps) {
  const [tickets, setTickets] = useState(storage.getTickets())
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('')

  const assignedTickets = tickets.filter((t) => t.assignedTo === currentUser.name)
  const availableTickets = tickets.filter((t) => !t.assignedTo && t.status === 'open')

  const handleAddComment = () => {
    if (!comment.trim() || !selectedTicket) return

    const updated = storage.updateTicket(
      selectedTicket.id,
      {
        comments: [
          ...selectedTicket.comments,
          {
            id: Math.random().toString(36).substring(7),
            author: currentUser.name,
            authorRole: currentUser.role,
            content: comment,
            createdAt: new Date().toISOString(),
            edited: false,
          },
        ],
      },
      currentUser.name,
      currentUser.role
    )

    if (updated) {
      setSelectedTicket(updated)
      setTickets(storage.getTickets())
      setComment('')
    }
  }

  const handleStatusChange = () => {
    if (!newStatus || !selectedTicket) return

    const updated = storage.updateTicket(
      selectedTicket.id,
      { status: newStatus as TicketStatus },
      currentUser.name,
      currentUser.role
    )

    if (updated) {
      setSelectedTicket(updated)
      setTickets(storage.getTickets())
      setNewStatus('')
    }
  }

  const handleAcceptJob = (ticket: Ticket) => {
    const updated = storage.updateTicket(
      ticket.id,
      { assignedTo: currentUser.name, status: 'in_progress' },
      currentUser.name,
      currentUser.role
    )

    if (updated) {
      setTickets(storage.getTickets())
      alert('Job accepted!')
    }
  }

  // Home view
  if (currentView === 'home') {
    const inProgressCount = assignedTickets.filter((t) => t.status === 'in_progress').length
    const completedCount = assignedTickets.filter((t) => t.status === 'resolved').length

    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 overflow-y-auto">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {currentUser.name}</h2>
          <p className="text-emerald-50">You have {inProgressCount} active tasks</p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-primary">{assignedTickets.length}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Assigned Jobs</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{inProgressCount}</p>
            <p className="text-xs md:text-sm text-muted-foreground">In Progress</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">{completedCount}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-secondary">{availableTickets.length}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Available Work</p>
          </Card>
        </div>

        {/* Active Jobs */}
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Current Tasks</h3>
          {assignedTickets.filter((t) => t.status === 'in_progress').length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No active tasks</p>
              <Button onClick={() => onNavigate('available')} className="bg-secondary hover:bg-teal-600 text-white">
                Browse Available Work
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignedTickets
                .filter((t) => t.status === 'in_progress')
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

  // Assigned Tasks view
  if (currentView === 'assigned') {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">My Assigned Tasks</h2>
          <Button onClick={() => onNavigate('available')} className="bg-secondary hover:bg-teal-600 text-white">
            See Available Work
          </Button>
        </div>

        {selectedTicket ? (
          <TaskDetailView
            ticket={selectedTicket}
            currentUser={currentUser}
            onClose={() => setSelectedTicket(null)}
            onCommentAdd={handleAddComment}
            onStatusChange={handleStatusChange}
            comment={comment}
            setComment={setComment}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
          />
        ) : (
          <>
            {assignedTickets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No tasks assigned yet</p>
                <Button onClick={() => onNavigate('available')} className="bg-secondary hover:bg-teal-600 text-white">
                  Find Available Work
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {assignedTickets.map((ticket) => (
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

  // Available Work view
  if (currentView === 'available') {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Available Work</h2>
          <Button onClick={() => onNavigate('assigned')} variant="outline">
            My Tasks
          </Button>
        </div>

        {availableTickets.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No available work at this time</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {availableTickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 md:p-6 border-l-4 border-l-secondary">
                <TicketCard ticket={ticket} />
                <Button
                  onClick={() => handleAcceptJob(ticket)}
                  className="w-full mt-4 bg-secondary hover:bg-teal-600 text-white flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept This Job
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

function TaskDetailView({
  ticket,
  currentUser,
  onClose,
  onCommentAdd,
  onStatusChange,
  comment,
  setComment,
  newStatus,
  setNewStatus,
}: {
  ticket: Ticket
  currentUser: User
  onClose: () => void
  onCommentAdd: () => void
  onStatusChange: () => void
  comment: string
  setComment: (value: string) => void
  newStatus: TicketStatus | ''
  setNewStatus: (value: TicketStatus | '') => void
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onClose} className="mb-4">
        ← Back
      </Button>
      <Card className="p-6 space-y-6">
        <TicketCard ticket={ticket} expanded />

        {/* Status Update */}
        <div className="border-t border-border pt-6 space-y-3">
          <h3 className="font-bold text-lg">Update Status</h3>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as TicketStatus)}
              className="flex-1"
            >
              <option value="">Change status...</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Mark as Resolved</option>
            </Select>
            <Button onClick={onStatusChange} disabled={!newStatus} className="bg-primary hover:bg-orange-600">
              Update
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Work Notes
          </h3>

          {ticket.comments.length > 0 && (
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              {ticket.comments.map((c) => (
                <div key={c.id} className="pb-3 border-b border-border last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{c.author}</span>
                    <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-foreground">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder="Add a note about your progress..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full"
            />
            <Button onClick={onCommentAdd} disabled={!comment.trim()} className="w-full bg-primary hover:bg-orange-600">
              Add Note
            </Button>
          </div>
        </div>

        <AuditTimeline auditLogs={ticket.audit} />
      </Card>
    </div>
  )
}
