# CityPulse User Guide

## Getting Started

### Logging In

1. Open the application
2. Select your role from the available options:
   - **Citizen** - Report and track incidents
   - **Field Staff** - Accept and complete work
   - **Officer** - Manage operations and team
   - **Admin** - View analytics and reports

3. Click "Continue" to log in

## Role-Specific Guides

### CITIZEN PORTAL

#### Reporting an Incident

1. From the home screen, click "Report an Incident"
2. Fill in the required information:
   - **Title**: Brief description (e.g., "Large pothole on Main St")
   - **Category**: Select the type of issue
   - **Severity**: Choose the urgency level
   - **Location**: Street address or intersection
   - **Description**: Detailed information about the issue

3. Click "Submit Report"
4. Your ticket number will be displayed (e.g., CYP-2024-001)

#### Tracking Your Reports

1. Go to "My Reports" to see all your submitted incidents
2. Click on any report to see:
   - Current status
   - Comments and updates from field staff
   - Complete activity history
   - Estimated completion date

#### Understanding Status Updates

- **Open**: Your report has been received and logged
- **Assigned**: A field staff member has been assigned
- **In Progress**: Work has started on your issue
- **Resolved**: The issue has been fixed
- **Closed**: The incident is complete

### FIELD STAFF INTERFACE

#### Finding Work

1. Go to "Available Work" to see unassigned incidents
2. Review the incident details
3. Click "Accept This Job" to assign it to yourself

#### Completing Work

1. Go to "My Assigned Tasks" to see your active jobs
2. Click on a task to open the detail view
3. **Add Notes**: Document your progress with work notes
4. **Update Status**: Change status to "In Progress" or "Mark as Resolved"
5. All changes are automatically logged for compliance

#### Managing Your Queue

- See all your assigned jobs in one place
- Filter by status (In Progress, Resolved)
- View task complexity and priority
- Track completion rate

### OFFICER DASHBOARD

#### Monitoring Operations

1. Home screen shows key metrics:
   - Total incidents in the system
   - Critical incidents requiring attention
   - Incidents in progress
   - Successfully resolved incidents

#### Managing All Incidents

1. Go to "All Incidents" to see the full system view
2. Use filters to focus on specific areas:
   - **Status**: Open, Assigned, In Progress, Resolved
   - **Severity**: Low, Medium, High, Critical
   - **Search**: Find by ticket number or title

3. Click on any incident to view full details

#### Assigning Work

1. Select an incident from the list
2. In the assignment section, choose a field staff member
3. Click "Assign" to send the work order
4. The staff member will be notified and can accept the job

#### Team Management

1. Go to "Team Management" to see staff profiles
2. View each team member's:
   - Active job count
   - Completed jobs
   - Workload percentage
   - Performance metrics

### ADMIN ANALYTICS

#### Dashboard Overview

1. Home screen displays comprehensive metrics:
   - Total incidents tracked
   - Critical incidents count
   - Overall resolution rate
   - Average resolution time

2. Metrics update in real-time as incidents progress

#### Generating Reports

1. Select report period:
   - **Daily**: Day-over-day trends
   - **Weekly**: Weekly performance
   - **Monthly**: Long-term patterns

2. View breakdowns by:
   - **Category**: Type of incidents
   - **Severity**: Incident urgency levels
   - **Status**: Progress through workflow

#### Exporting Data

1. Click "Download Report" to export as JSON
2. Use for:
   - Compliance documentation
   - External stakeholder reporting
   - Data analysis
   - Archival purposes

#### Reviewing Audit Logs

1. Go to "Audit Logs" to see all system activities
2. View complete history of:
   - Ticket creations
   - Status changes
   - Assignments
   - All field modifications

3. Each log shows:
   - Actor (who performed the action)
   - Timestamp
   - What changed
   - Before and after values

## Understanding Tickets

### Ticket Structure

Every ticket contains:
- **Ticket Number**: Unique identifier (CYP-YYYY-000)
- **Category**: Type of infrastructure issue
- **Severity**: Urgency level (Low to Critical)
- **Status**: Current position in workflow
- **Location**: Where the issue is located
- **Description**: Detailed problem description
- **Comments**: Collaboration thread
- **Audit Trail**: Complete action history

### Severity Levels

| Level | Definition | Response Time |
|-------|-----------|----------------|
| **Low** | Minor inconvenience | Standard |
| **Medium** | Notable issue | Priority |
| **High** | Significant hazard | Urgent |
| **Critical** | Immediate danger | Emergency |

### Status Workflow

```
OPEN → ASSIGNED → IN PROGRESS → RESOLVED → CLOSED
  ↓         ↓            ↓            ↓
Reported  Assigned   Being Fixed  Complete
```

## Features & Functions

### Real-Time Updates

- Status changes appear instantly
- Comments are visible immediately
- Activity timeline updates in real-time
- No page refresh needed

### Audit Trail

Every action is logged with:
- **Actor**: Who performed the action
- **Timestamp**: Exact date and time
- **Action**: What was changed
- **Details**: Before and after values

This creates a complete compliance record.

### Search & Filtering

- **By Status**: Filter incidents by workflow state
- **By Severity**: Focus on critical issues
- **By Category**: Find specific issue types
- **By Assignee**: See team workloads
- **By Date**: View incidents from a time period

### Mobile Optimization

The system works perfectly on:
- Smartphones (iPhone, Android)
- Tablets (iPad, Android tablets)
- Desktops (Windows, Mac, Linux)

All features work on all devices.

## Best Practices

### For Citizens

- Provide detailed descriptions when reporting
- Include specific location information
- Take photos if possible (feature coming soon)
- Check back on your reports regularly
- Contact your officer if you need updates

### For Field Staff

- Accept jobs promptly
- Update status regularly with progress notes
- Document any challenges or blockers
- Mark complete when finished
- Add notes for compliance

### For Officers

- Review critical incidents daily
- Balance workload across team members
- Monitor resolution times
- Provide guidance to field staff
- Escalate when needed

### For Admins

- Review audit logs weekly
- Generate monthly reports for stakeholders
- Monitor critical incident trends
- Identify systemic issues
- Plan resource allocation based on data

## Troubleshooting

### Can't See My Report?

- Go to "My Reports" instead of "All Incidents"
- Only citizens see their own reports
- Officers and admins see all reports

### Assignment Not Working?

- Only officers can assign work
- Make sure you're logged in as an officer
- Select both the ticket and the staff member
- Click "Assign" to confirm

### Data Not Updating?

- Refresh the page (Cmd+R or Ctrl+R)
- Log out and log back in
- Try a different browser
- Clear browser cache if needed

## Keyboard Shortcuts

- **Search** - Click search field or use Cmd/Ctrl+K
- **Back** - Click back button or press Escape
- **Filter** - Use dropdown menus
- **Export** - Click Download button

## Support

For issues or questions:
1. Check this guide for your role
2. Review the help section in the UI
3. Check system status page
4. Contact your administrator

## System Features Checklist

✅ Multi-role access control
✅ Complete ticket lifecycle management
✅ Real-time status updates
✅ Comprehensive audit logging
✅ Team management and assignments
✅ Analytics and reporting
✅ Mobile-first responsive design
✅ Search and filtering
✅ Data export for compliance
✅ Activity timeline
✅ Comments and collaboration
✅ Critical incident tracking
✅ Performance metrics
✅ Category-based organization
✅ Severity level management

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers (demo mode)
- Each user session is separate
- Clearing browser data will reset the system
- Audit logs are immutable records

## Tips & Tricks

1. **Quick Filters**: Use severity filter to focus on critical issues
2. **Status Overview**: Check home dashboard for quick stats
3. **Bulk View**: See all incidents of one type with category filter
4. **Performance Review**: Use team management to evaluate staff
5. **Compliance Ready**: Export reports regularly for archival

Remember: CityPulse makes it easy to keep our cities safe and well-maintained! 🏙️
