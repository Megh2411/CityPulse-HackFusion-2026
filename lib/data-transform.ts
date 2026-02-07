// lib/data-transform.ts
import { Ticket } from "./types";

export function transformDatabaseRowToTicket(row: any): Ticket {
  return {
    id: row.id,
    ticketNumber: `#${row.ticket_number}`,
    title: row.title,
    description: row.description,
    category: row.category,
    severity: row.severity,
    status: row.status,
    location: row.location, // Address string
    latitude: row.latitude || 0,
    longitude: row.longitude || 0,
    reportedBy: row.reported_by,
    reportedAt: row.created_at,
    assignedTo: row.assigned_to,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at,
    images: row.images || [],
    tags: row.tags || [],
    comments: [],
    audit: [],
    isDuplicate: row.is_duplicate || false,
    onHoldReason: row.on_hold_reason,
    resolutionNotes: row.resolution_notes,
    priority: row.priority || 0,
    duplicateOf: row.duplicate_of,
    estimatedCompletion: row.estimated_completion,
    closedAt: row.closed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    ticket_number: row.ticket_number,
  };
}
