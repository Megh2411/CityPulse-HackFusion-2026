'use client'

import { Ticket } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface IncidentMapProps {
  tickets: Ticket[]
  onTicketClick?: (ticket: Ticket) => void
  height?: string
}

export default function IncidentMap({ tickets, onTicketClick, height = 'h-96' }: IncidentMapProps) {
  // Create a simple map visualization using divs instead of a full map library
  // This shows incident density and locations in a grid format

  const cityBounds = {
    minLat: 40.7,
    maxLat: 40.72,
    minLng: -74.01,
    maxLng: -73.99,
  }

  const latRange = cityBounds.maxLat - cityBounds.minLat
  const lngRange = cityBounds.maxLng - cityBounds.minLng

  return (
    <Card className={`${height} w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-4`}>
      {/* Map Grid Background */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`v-${i}`} x1={`${(i + 1) * 20}%`} y1="0" x2={`${(i + 1) * 20}%`} y2="100%" stroke="gray" strokeWidth="1" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 20}%`} x2="100%" y2={`${(i + 1) * 20}%`} stroke="gray" strokeWidth="1" />
        ))}
      </svg>

      {/* Incident Markers */}
      <div className="absolute inset-0 w-full h-full">
        {tickets.map((ticket, idx) => {
          const x = ((ticket.longitude - cityBounds.minLng) / lngRange) * 100
          const y = ((cityBounds.maxLat - ticket.latitude) / latRange) * 100

          const sizeMap = {
            critical: 'w-4 h-4',
            high: 'w-3 h-3',
            medium: 'w-2.5 h-2.5',
            low: 'w-2 h-2',
          }

          const colorMap = {
            critical: 'bg-red-500',
            high: 'bg-orange-500',
            medium: 'bg-yellow-500',
            low: 'bg-emerald-500',
          }

          return (
            <div
              key={ticket.id}
              className={`absolute ${sizeMap[ticket.severity]} ${colorMap[ticket.severity]} rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-150 shadow-lg`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                zIndex: ticket.severity === 'critical' ? 10 : 5,
              }}
              onClick={() => onTicketClick?.(ticket)}
              title={ticket.title}
            >
              <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-pulse"></div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow-md p-3">
        <p className="text-xs font-semibold text-foreground mb-2">Severity</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Info Card */}
      {tickets.length > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-md p-3">
          <p className="text-xs font-semibold text-foreground">Total Incidents</p>
          <p className="text-2xl font-bold text-primary">{tickets.length}</p>
        </div>
      )}

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No incidents to display</p>
          </div>
        </div>
      )}
    </Card>
  )
}
