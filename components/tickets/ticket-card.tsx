'use client'

import { Ticket, CATEGORY_LABELS, SEVERITY_CONFIG, STATUS_CONFIG } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, User, ArrowRight } from 'lucide-react'

interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
  expanded?: boolean
  clickable?: boolean
}

export default function TicketCard({ ticket, onClick, expanded = false, clickable = false }: TicketCardProps) {
  const categoryLabel = CATEGORY_LABELS[ticket.category]
  const severityConfig = SEVERITY_CONFIG[ticket.severity]
  const statusConfig = STATUS_CONFIG[ticket.status]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago'
    return Math.floor(seconds / 86400) + 'd ago'
  }

  return (
    <Card
      className={`p-4 md:p-6 border-l-4 transition-all ${
        clickable && onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${
        ticket.severity === 'critical'
          ? 'border-l-red-500 bg-red-50'
          : ticket.severity === 'high'
            ? 'border-l-orange-500 bg-orange-50'
            : ticket.severity === 'medium'
              ? 'border-l-yellow-500 bg-yellow-50'
              : 'border-l-emerald-500 bg-emerald-50'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xl">{categoryLabel.emoji}</span>
            <h3 className="text-base md:text-lg font-bold text-foreground truncate">{ticket.title}</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">{ticket.ticketNumber}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-start md:justify-end">
          <Badge className={severityConfig.color}>{severityConfig.label}</Badge>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3 mb-4">
        <p className="text-sm md:text-base text-foreground line-clamp-2">{ticket.description}</p>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="truncate">{ticket.location}</span>
        </div>

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{formatTimeAgo(ticket.reportedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{ticket.reportedBy}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-2">
              <span>Assigned to:</span>
              <span className="truncate font-medium">{ticket.assignedTo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="border-t border-border pt-4 mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Full Description</h4>
            <p className="text-sm text-foreground">{ticket.description}</p>
          </div>

          {ticket.resolvedAt && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Resolution</h4>
              <p className="text-sm text-foreground">
                Resolved {formatDate(ticket.resolvedAt)}
                {ticket.resolvedBy && ` by ${ticket.resolvedBy}`}
              </p>
            </div>
          )}

          {ticket.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Comments</span>
              <p className="font-semibold text-foreground">{ticket.comments.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status Updates</span>
              <p className="font-semibold text-foreground">{ticket.audit.length}</p>
            </div>
          </div>
        </div>
      )}

      {clickable && onClick && (
        <div className="flex items-center justify-end text-primary text-sm font-medium mt-4">
          View Details <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      )}
    </Card>
  )
}
