// lib/types.ts
// User Roles
export type UserRole = "citizen" | "field_staff" | "officer" | "admin";

// Ticket Status with deterministic state machine
export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed";

// Valid state transitions
export const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["assigned", "closed"],
  assigned: ["in_progress", "on_hold", "closed"],
  in_progress: ["on_hold", "resolved", "closed"],
  on_hold: ["in_progress", "resolved", "closed"],
  resolved: ["closed", "in_progress"],
  closed: [],
};

// Incident Severity
export type Severity = "low" | "medium" | "high" | "critical";

// Incident Category
export type IncidentCategory =
  | "pothole"
  | "flooding"
  | "traffic_signal"
  | "street_light"
  | "debris"
  | "accident"
  | "other";

// Category to emoji/label mapping
export const CATEGORY_LABELS: Record<
  IncidentCategory,
  { label: string; emoji: string }
> = {
  pothole: { label: "Pothole", emoji: "🕳️" },
  flooding: { label: "Flooding", emoji: "💧" },
  traffic_signal: { label: "Traffic Signal", emoji: "🚦" },
  street_light: { label: "Street Light", emoji: "💡" },
  debris: { label: "Debris", emoji: "🪨" },
  accident: { label: "Accident", emoji: "🚗" },
  other: { label: "Other", emoji: "⚠️" },
};

// Severity color mapping
export const SEVERITY_CONFIG: Record<
  Severity,
  { color: string; label: string }
> = {
  low: {
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    label: "Low",
  },
  medium: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Medium",
  },
  high: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "High",
  },
  critical: {
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Critical",
  },
};

// Status color mapping
export const STATUS_CONFIG: Record<
  TicketStatus,
  { color: string; label: string }
> = {
  open: { color: "bg-red-100 text-red-800 border-red-200", label: "Open" },
  assigned: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Assigned",
  },
  in_progress: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "In Progress",
  },
  on_hold: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    label: "On Hold",
  },
  resolved: {
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Resolved",
  },
  closed: {
    color: "bg-slate-100 text-slate-800 border-slate-200",
    label: "Closed",
  },
};

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Comment interface
export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  edited: boolean;
}

// Audit Log interface
export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  timestamp: string;
  details: Record<string, any>;
  fieldChanged?: string;
  oldValue?: any;
  newValue?: any;
}

// Incident/Ticket interface - UPDATED FOR DATABASE COMPATIBILITY
export interface Ticket {
  id: string;
  ticketNumber: string;
  category: IncidentCategory;
  severity: Severity;
  status: TicketStatus;
  title: string;
  description: string;

  // Location data - supports both formats
  location: string; // This is the address string (like "Khar West Main Road")
  latitude: number;
  longitude: number;

  reportedBy: string;
  reportedAt: string;

  assignedTo?: string; // This matches your database field 'assigned_to'

  resolvedBy?: string;
  resolvedAt?: string | null;
  closedAt?: string | null;
  estimatedCompletion?: string | null;
  actualCompletion?: string | null;

  images: string[];
  comments: Comment[];
  audit: AuditLog[];
  tags: string[];

  duplicateOf?: string;
  isDuplicate: boolean;
  onHoldReason?: string | null;
  resolutionNotes?: string | null;
  priority?: number;

  // Additional fields from your database
  created_at?: string;
  updated_at?: string;
  ticket_number?: number; // The numeric ticket number from DB
  ml_analysis?: any;
  ml_confidence_score?: string;
  detection_count?: number;
  coverage_ratio?: string;
  estimated_duration_hours?: string;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
}

// Dashboard statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  criticalTickets: number;
  fieldStaffUtilization: number;
}

// Officer Performance Metrics
export interface OfficerMetrics {
  userId: string;
  userName: string;
  ticketsAssigned: number;
  ticketsCompleted: number;
  averageResolutionTime: number;
  onTimeCompletion: number;
  overallRating: number;
  tasksInProgress: number;
  tasksOnHold: number;
  duplicateDetection: number;
}
