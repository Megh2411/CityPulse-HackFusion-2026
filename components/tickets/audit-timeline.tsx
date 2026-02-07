'use client'

import { AuditLog } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow as formatDistance } from 'date-fns'
import { CheckCircle, AlertCircle, Clock, User, Edit } from 'lucide-react'

interface AuditTimelineProps {
  auditLogs: AuditLog[]
}

export default function AuditTimeline({ auditLogs }: AuditTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getActionIcon = (action: string) => {
    if (action.includes('created')) return <CheckCircle className="h-5 w-5 text-emerald-600" />
    if (action.includes('resolved') || action.includes('completed')) return <CheckCircle className="h-5 w-5 text-emerald-600" />
    if (action.includes('assigned')) return <User className="h-5 w-5 text-blue-600" />
    if (action.includes('status')) return <Clock className="h-5 w-5 text-orange-600" />
    if (action.includes('updated')) return <Edit className="h-5 w-5 text-purple-600" />
    return <AlertCircle className="h-5 w-5 text-gray-600" />
  }

  const getActionLabel = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const sortedLogs = [...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Activity History</h3>

      {sortedLogs.length === 0 ? (
        <p className="text-muted-foreground text-sm">No activity yet</p>
      ) : (
        <div className="space-y-3">
          {sortedLogs.map((log, index) => (
            <div key={log.id} className="flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                {getActionIcon(log.action)}
                {index < sortedLogs.length - 1 && <div className="w-0.5 h-12 bg-border mt-2"></div>}
              </div>

              {/* Content */}
              <div className="flex-1 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm md:text-base">{getActionLabel(log.action)}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.actorRole.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">By {log.actor}</p>

                {/* Details */}
                {log.fieldChanged && (
                  <div className="bg-muted p-2 rounded text-xs space-y-1 font-mono">
                    <p>
                      <span className="text-muted-foreground">Field:</span> <span className="font-semibold">{log.fieldChanged}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Old:</span>{' '}
                      <span className="line-through text-destructive">{String(log.oldValue || 'None')}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">New:</span>{' '}
                      <span className="text-emerald-600">{String(log.newValue || 'None')}</span>
                    </p>
                  </div>
                )}

                {/* Additional details */}
                {Object.keys(log.details || {}).length > 0 && !log.fieldChanged && (
                  <div className="bg-muted p-2 rounded text-xs space-y-1">
                    {Object.entries(log.details || {}).map(([key, value]) => (
                      <p key={key}>
                        <span className="text-muted-foreground">{key}:</span> <span className="font-semibold">{String(value)}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
