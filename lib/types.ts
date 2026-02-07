// User Roles
export type UserRole = 'citizen' | 'field_staff' | 'officer' | 'admin'

// Ticket Status
export type TicketStatus = 'open' | 'in_progress' | 'assigned' | 'resolved' | 'closed'

// Incident Severity
export type Severity = 'low' | 'medium' | 'high' | 'critical'

// Incident Category
export type IncidentCategory = 'pothole' | 'flooding' | 'traffic_signal' | 'street_light' | 'debris' | 'accident' | 'other'

// Category to emoji/label mapping
export const CATEGORY_LABELS: Record<IncidentCategory, { label: string; emoji: string }> = {
  pothole: { label: 'Pothole', emoji: '🕳️' },
  flooding: { label: 'Flooding', emoji: '💧' },
  traffic_signal: { label: 'Traffic Signal', emoji: '🚦' },
  street_light: { label: 'Street Light', emoji: '💡' },
  debris: { label: 'Debris', emoji: '🪨' },
  accident: { label: 'Accident', emoji: '🚗' },
  other: { label: 'Other', emoji: '⚠️' },
}

// Severity color mapping
export const SEVERITY_CONFIG: Record<Severity, { color: string; label: string }> = {
  low: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'High' },
  critical: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Critical' },
}

// Status color mapping
export const STATUS_CONFIG: Record<TicketStatus, { color: string; label: string }> = {
  open: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Open' },
  in_progress: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'In Progress' },
  assigned: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Assigned' },
  resolved: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Resolved' },
  closed: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Closed' },
}

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  createdAt: string
  lastLogin: string
}

// Incident/Ticket interface
export interface Ticket {
  id: string
  ticketNumber: string
  category: IncidentCategory
  severity: Severity
  status: TicketStatus
  title: string
  description: string
  location: string
  latitude: number
  longitude: number
  reportedBy: string
  reportedAt: string
  assignedTo?: string
  resolvedBy?: string
  resolvedAt?: string
  closedAt?: string
  estimatedCompletion?: string
  actualCompletion?: string
  images: string[]
  comments: Comment[]
  audit: AuditLog[]
  tags: string[]
}

// Comment interface
export interface Comment {
  id: string
  author: string
  authorRole: UserRole
  content: string
  createdAt: string
  edited: boolean
}

// Audit Log interface
export interface AuditLog {
  id: string
  action: string
  actor: string
  actorRole: UserRole
  timestamp: string
  details: Record<string, any>
  fieldChanged?: string
  oldValue?: any
  newValue?: any
}

// Dashboard statistics
export interface DashboardStats {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  resolvedTickets: number
  averageResolutionTime: number
  criticalTickets: number
  fieldStaffUtilization: number
}

// Report interface
export interface Report {
  id: string
  generatedAt: string
  generatedBy: string
  period: 'daily' | 'weekly' | 'monthly'
  stats: DashboardStats
  categoryBreakdown: Record<IncidentCategory, number>
  severityBreakdown: Record<Severity, number>
  statusBreakdown: Record<TicketStatus, number>
}
