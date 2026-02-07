# Component Reference Guide

## Overview

This document describes every component in the CityPulse application and how they work together.

## Core Application

### `/app/page.tsx`
**Purpose:** Main application entry point and authentication check

**Functionality:**
- Checks if user is logged in
- Shows login page if not authenticated
- Shows dashboard if authenticated
- Handles loading state

**Props:** None (client component)

**Key Dependencies:**
- `storage.getCurrentUser()`
- `LoginPage`
- `Dashboard`

---

### `/app/layout.tsx`
**Purpose:** Root layout for entire application

**Functionality:**
- Sets up HTML document structure
- Configures metadata and viewport
- Applies global fonts (Geist Sans, Geist Mono)
- Wraps children with body element

**Metadata:**
- Title: "CityPulse - Urban Incident Management"
- Theme Color: #FF6B3D (primary orange)
- Viewport: device-width, initial-scale 1.0

**Key Dependencies:**
- `globals.css`
- React children

---

## Authentication

### `/components/auth/login-page.tsx`
**Purpose:** User role selection and login interface

**Functionality:**
- Displays 4 role cards (Citizen, Field Staff, Officer, Admin)
- Allows role selection
- Simulates login (no password needed in demo)
- Sets current user in storage
- Triggers callback to app

**Props:**
```typescript
interface LoginPageProps {
  onLoginSuccess: (user: User) => void
}
```

**Available Roles:**
- Citizen: Report incidents
- Field Staff: Respond to incidents
- Officer: Manage operations
- Admin: View analytics

**Key Dependencies:**
- `storage.getUsers()`
- `storage.setCurrentUser()`
- `Button`, `Card` components

---

## Dashboard & Navigation

### `/components/dashboard/dashboard.tsx`
**Purpose:** Main app router that shows correct portal based on user role

**Functionality:**
- Routes to correct portal component based on user.role
- Maintains current view state
- Passes props to portals
- Wraps content with navigation bar

**Props:**
```typescript
interface DashboardProps {
  currentUser: User
  onLogout: () => void
}
```

**Routing Logic:**
- citizen → CitizenPortal
- field_staff → FieldStaffInterface
- officer → OfficerDashboard
- admin → AdminAnalytics

**Key Dependencies:**
- All portal components
- NavigationBar

---

### `/components/navigation/navigation-bar.tsx`
**Purpose:** Header navigation bar with role-specific menu

**Functionality:**
- Displays app logo and current user info
- Shows role-specific menu items
- Mobile hamburger menu
- Logout button
- Responsive design (hidden on mobile, visible on desktop)

**Props:**
```typescript
interface NavigationBarProps {
  currentUser: User
  onLogout: () => void
  onNavigate: (view: string) => void
}
```

**Menu Items by Role:**
- **Citizen**: Home, Report Incident, My Reports
- **Field Staff**: Home, Assigned Tasks, Available Work
- **Officer**: Home, All Incidents, Team Management
- **Admin**: Home, Analytics, Reports, Audit Logs

**Responsive Behavior:**
- Desktop: Full menu visible
- Mobile: Hamburger menu with expandable options
- Touch-optimized tap targets

**Key Dependencies:**
- `Button` component
- `Menu`, `LogOut` icons from lucide-react

---

## Portal Components

### `/components/portals/citizen-portal.tsx`
**Purpose:** Interface for citizen role - report and track incidents

**Functionality:**
- Home view: Dashboard with stats and recent reports
- Report view: Form to create new incident
- My Reports view: List and detail view of citizen's reports

**Views:**
- **home**: Dashboard with 4 stat cards, welcome message, recent reports
- **report**: Form for reporting new incident
- **my-reports**: List of citizen's reports with filter/search

**Form Fields:**
- Title (required)
- Description (required)
- Category (required) - 7 options
- Severity (required) - 4 levels
- Location (required)
- Coordinates (auto-filled, editable)

**Audit Trail Integration:**
- Creates audit log on report creation
- Shows complete history in detail view
- Tracks reporter and timestamp

**Props:**
```typescript
interface CitizenPortalProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}
```

**Key Dependencies:**
- `storage.createTicket()`, `storage.getTickets()`
- `TicketCard`, `AuditTimeline` components
- Form validation

---

### `/components/portals/field-staff-interface.tsx`
**Purpose:** Interface for field staff role - accept and complete work

**Functionality:**
- Home view: Dashboard with assigned task count and active jobs
- Assigned Tasks view: List of all assigned tickets
- Available Work view: List of unassigned open tickets
- Task Detail view: Individual ticket with status update and notes

**Views:**
- **home**: Welcome, stats (assigned, in progress, completed, available), current tasks list
- **assigned**: Full list of assigned tickets
- **available**: Unassigned tickets with "Accept This Job" buttons
- **detail**: Full ticket info with comment system and status changes

**Key Features:**
- Accept jobs from available work
- Update status (In Progress, Mark as Resolved)
- Add work notes/comments
- See audit trail of all changes

**Status Workflow:**
- Open → (Accept) → In Progress
- In Progress → (Complete) → Resolved
- Each change creates audit entry

**Props:**
```typescript
interface FieldStaffInterfaceProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}
```

**Key Dependencies:**
- `storage.updateTicket()`, `storage.getTickets()`
- `TicketCard`, `AuditTimeline` components
- Comment management

---

### `/components/portals/officer-dashboard.tsx`
**Purpose:** Interface for officer role - manage operations and assignments

**Functionality:**
- Home view: KPI dashboard with critical incidents
- All Incidents view: Full incident list with advanced filters
- Team Management view: Staff profiles with performance metrics
- Incident Detail view: Assign tickets to field staff

**Views:**
- **home**: 4 KPI cards, quick action buttons, critical incidents list
- **incidents**: Searchable, filterable incident list
- **team**: Staff cards showing active jobs, completed jobs, workload %
- **detail**: Incident info with assignment dropdown

**Filtering Options:**
- By Status: Open, Assigned, In Progress, Resolved, All
- By Severity: Low, Medium, High, Critical, All
- By Search: Ticket number or title
- Clear all filters button

**KPIs Displayed:**
- Total incidents
- Critical incidents
- In progress count
- Resolved count

**Assignment System:**
- Dropdown with all field staff
- Assign button creates audit entry
- Updates ticket status to "assigned"
- Notifies field staff

**Props:**
```typescript
interface OfficerDashboardProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}
```

**Key Dependencies:**
- `storage.getTickets()`, `storage.updateTicket()`
- `TicketCard`, `AuditTimeline` components
- Advanced filtering logic

---

### `/components/portals/admin-analytics.tsx`
**Purpose:** Interface for admin role - analytics and compliance

**Functionality:**
- Home view: KPI dashboard with report controls
- Analytics view: Detailed category, severity, status breakdowns
- Reports view: Report generation interface
- Audit Logs view: Complete system activity history
- Export: Download reports as JSON

**Views:**
- **home**: KPIs, report period selector, category/severity/status charts, export button
- **analytics**: Detailed distribution analysis
- **reports**: Report generation with metrics
- **audit**: Timeline of all system activities (50+ entries)

**Report Features:**
- Period selection: Daily, Weekly, Monthly
- Automatic calculation of:
  - Total incidents
  - Critical incidents
  - Resolution rate
  - Average resolution time
  - Field staff utilization
- Category breakdown
- Severity breakdown
- Status breakdown

**Export Functionality:**
- Downloads as JSON file
- Filename: `citypulse-report-{period}-{date}.json`
- Contains all metrics and breakdowns
- Ready for compliance documentation

**Audit Log Features:**
- Shows 50 most recent activities
- Timeline format with icons
- Displays:
  - Action type
  - Actor and role
  - Timestamp
  - Changed fields (if applicable)
  - Before/after values

**Props:**
```typescript
interface AdminAnalyticsProps {
  currentUser: User
  onNavigate: (view: string) => void
  currentView: string
}
```

**Key Dependencies:**
- `storage.generateReport()`, `storage.getTickets()`
- `AuditTimeline` component
- Chart visualization logic
- Export logic

---

## Reusable Components

### `/components/tickets/ticket-card.tsx`
**Purpose:** Display a single ticket in card format with condensed or expanded view

**Functionality:**
- Shows ticket summary (title, category, severity, status)
- Displays metadata (location, reporter, time ago, assignee)
- Clickable for detail view
- Expands to show full description and tags
- Responsive design (collapses on mobile)

**Props:**
```typescript
interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
  expanded?: boolean
  clickable?: boolean
}
```

**Display Elements:**
- Category emoji and label
- Severity badge (color-coded)
- Status badge (color-coded)
- Title and ticket number
- Location with icon
- Reporter name
- Time ago (e.g., "2h ago")
- Assignee (if any)

**Expanded View (Optional):**
- Full description
- Resolution info (if resolved)
- Tags list
- Comments count
- Audit log count

**Color Coding:**
- Critical: Red left border, red background
- High: Orange left border, orange background
- Medium: Yellow left border, yellow background
- Low: Green left border, green background

**Key Dependencies:**
- `Badge` component
- Icons from lucide-react
- Type definitions from types.ts

---

### `/components/tickets/audit-timeline.tsx`
**Purpose:** Visualize complete audit trail of ticket changes

**Functionality:**
- Displays chronological timeline of all ticket actions
- Shows action icons with context
- Reveals field-level changes (before/after)
- Groups related information

**Props:**
```typescript
interface AuditTimelineProps {
  auditLogs: AuditLog[]
}
```

**Timeline Elements:**
- Vertical line connecting entries
- Icon indicating action type
- Action label
- Actor name and role
- Timestamp
- Details box (for field changes)

**Action Icons:**
- Green checkmark: Created, Resolved
- Blue person: Assigned
- Orange clock: Status change
- Purple edit: Updated

**Field Change Display:**
- Field name
- Old value (strikethrough, red)
- New value (green)
- In monospace font for clarity

**Sorting:**
- Most recent first
- Reverse chronological order

**Key Dependencies:**
- `Badge` component
- Icons from lucide-react
- Type definitions from types.ts

---

### `/components/map/incident-map.tsx`
**Purpose:** Visual representation of incident locations and distribution

**Functionality:**
- Shows incident markers on grid-based map
- Color codes by severity
- Size changes by severity
- Interactive markers
- Legend and statistics

**Props:**
```typescript
interface IncidentMapProps {
  tickets: Ticket[]
  onTicketClick?: (ticket: Ticket) => void
  height?: string
}
```

**Visual Elements:**
- Grid background
- Incident markers positioned by coordinates
- Size: Critical > High > Medium > Low
- Color: Red, Orange, Yellow, Green
- Pulse animation for active incidents
- Legend in bottom-left
- Statistics in top-right

**Interactivity:**
- Click markers to show ticket detail
- Hover for tooltip with title
- Scale up on hover
- Mobile responsive

**Legend:**
- Shows color/size mapping
- Helps interpret the map

**Empty State:**
- Shows message if no incidents
- Encourages creating new incidents

**Key Dependencies:**
- `Card` component
- SVG for grid background
- Icons from lucide-react

---

### `/components/common/empty-state.tsx`
**Purpose:** Reusable empty state component for no data scenarios

**Functionality:**
- Displays icon, title, description
- Optional action button
- Consistent styling across app

**Props:**
```typescript
interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

**Example Usage:**
```tsx
<EmptyState
  icon="📋"
  title="No incidents reported"
  description="Start by reporting an issue"
  action={{
    label: "Report Now",
    onClick: () => navigate('/report')
  }}
/>
```

**Styling:**
- Large icon (5xl text size)
- Clear title
- Muted description
- Action button in primary color

**Key Dependencies:**
- `Card`, `Button` components

---

## UI Components (from shadcn/ui)

All standard shadcn components are available:
- `Button` - Primary action buttons
- `Card` - Card containers
- `Input` - Text input fields
- `Textarea` - Multi-line text input
- `Select` - Dropdown selections
- `Badge` - Status and severity badges
- `Dialog` - Modal dialogs
- `Sheet` - Side sheets/drawers
- And 30+ more...

---

## Data & Utility Functions

### `/lib/types.ts`
**Purpose:** TypeScript type definitions for entire application

**Key Types:**
- `User` - User profile
- `Ticket` - Incident ticket
- `Comment` - User comment
- `AuditLog` - Action log entry
- `Report` - Generated report
- `UserRole` - Role enum
- `TicketStatus` - Status enum
- `Severity` - Severity enum
- `IncidentCategory` - Category enum

**Helper Objects:**
- `CATEGORY_LABELS` - Category display info
- `SEVERITY_CONFIG` - Severity colors and labels
- `STATUS_CONFIG` - Status colors and labels

---

### `/lib/storage.ts`
**Purpose:** Data management and persistence layer

**Functions:**
- `initializeDefaultUsers()` - Create demo users
- `initializeDefaultTickets()` - Create demo tickets
- `storage.getTickets()` - Get all tickets
- `storage.saveTickets()` - Persist tickets
- `storage.getTicketById()` - Get specific ticket
- `storage.createTicket()` - Create new ticket with audit
- `storage.updateTicket()` - Update ticket and log changes
- `storage.getUsers()` - Get all users
- `storage.getCurrentUser()` - Get logged-in user
- `storage.setCurrentUser()` - Set logged-in user
- `storage.generateReport()` - Generate analytics report

**Data Persistence:**
- Uses browser localStorage
- Keys: TICKETS, USERS, CURRENT_USER, AUDIT_LOGS, REPORTS
- Survives page refreshes
- Cleared when browser data is cleared

**Audit Integration:**
- Automatic audit entry creation
- Field change tracking
- Actor and timestamp recording
- Status update logging

---

### `/lib/date-utils.ts`
**Purpose:** Date formatting utilities

**Functions:**
- `formatDate()` - Format as date only
- `formatDateTime()` - Format as date and time
- `formatTime()` - Format as time only
- `timeAgo()` - Relative time (e.g., "2h ago")
- `durationBetween()` - Time span between dates

---

### `/lib/utils.ts`
**Purpose:** General utility functions (from shadcn)

**Functions:**
- `cn()` - Conditional class name merging (Tailwind CSS)

---

## Component Hierarchy

```
app/page.tsx
  └─ LoginPage OR Dashboard
       ├─ NavigationBar
       └─ Portal Component
           ├─ TicketCard
           ├─ AuditTimeline
           ├─ IncidentMap
           └─ EmptyState
```

## Data Flow

```
Storage (localStorage)
  └─ getTickets/getUsers
       └─ Portal Components
            ├─ Display in TicketCard
            ├─ Update via updateTicket
            └─ Show in AuditTimeline
                 └─ Save changes back to Storage
```

## Styling System

All components use:
- **Design Tokens**: Color, spacing defined in globals.css
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Component library
- **Mobile-First**: Responsive design from mobile up

---

## Component Usage Examples

### Create Ticket Card
```tsx
<TicketCard ticket={ticket} clickable onClick={() => setSelected(ticket)} />
```

### Show Audit Trail
```tsx
<AuditTimeline auditLogs={ticket.audit} />
```

### Display Map
```tsx
<IncidentMap tickets={tickets} onTicketClick={handleClick} height="h-96" />
```

### Empty State
```tsx
<EmptyState
  icon="📋"
  title="No incidents"
  action={{ label: "Create", onClick: handleCreate }}
/>
```

---

## Customization Guide

### Adding New Component
1. Create file in `/components/{category}/{name}.tsx`
2. Define TypeScript interface for props
3. Use Tailwind CSS for styling
4. Export as default
5. Import in parent component

### Modifying Existing Component
1. Find component file
2. Update functionality
3. Test with different data
4. Update documentation if props change

### Styling Changes
1. Modify Tailwind classes in JSX
2. Or update design tokens in globals.css
3. Use color variables (e.g., `bg-primary`)
4. Maintain responsive design (md:, lg: prefixes)

---

This component reference provides a complete guide to understanding how CityPulse is structured and how each piece fits together.
