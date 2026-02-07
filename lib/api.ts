import { supabase } from '@/lib/supabase'
import { Ticket, TicketStatus } from '@/lib/types'

// 1. Fetch All Tickets (With Relations)
export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      audit:audit_logs(*),
      comments(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tickets:', error)
    return []
  }

  // Map DB columns to your TypeScript Interface
  return data.map((row: any) => ({
    id: row.id,
    ticketNumber: `#${row.ticket_number}`,
    title: row.title,
    description: row.description,
    category: row.category,
    severity: row.severity,
    status: row.status,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    reportedBy: row.reported_by,
    reportedAt: row.created_at,
    assignedTo: row.assigned_to,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at,
    images: row.images || [],
    tags: row.tags || [],
    comments: row.comments || [],
    audit: row.audit || [],
    isDuplicate: false // Fixed: Added to satisfy Ticket type
  }))
}

// 2. Create Ticket
export async function createTicket(ticket: any) {
  const { data, error } = await supabase
    .from('incidents')
    .insert([{
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      severity: ticket.severity,
      location: ticket.location,
      latitude: ticket.latitude,
      longitude: ticket.longitude,
      reported_by: ticket.reportedBy,
      status: 'open',
      images: ticket.images || []
    }])
    .select()
    .single()
    
  return { data, error }
}

// 3. Update Status
export async function updateTicketStatus(id: string, status: TicketStatus, actor: string = 'System') {
  const { error } = await supabase
    .from('incidents')
    .update({ status })
    .eq('id', id)
  
  return error
}