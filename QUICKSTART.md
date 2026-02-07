# CityPulse Quick Start

## 30-Second Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

Done! The app is ready to use.

## Instant Demo Access

No credentials needed. Simply:

1. Open http://localhost:3000
2. Select a role (Citizen, Field Staff, Officer, or Admin)
3. Click "Continue"
4. You're logged in!

## What to Try First

### As a Citizen (👤)
- Click "Report an Incident" 
- Fill in the form (all fields required)
- See your ticket number appear
- Go to "My Reports" to track status

### As Field Staff (🔧)
- Check "Available Work" for open tickets
- Click "Accept This Job" on any ticket
- Go to "My Assigned Tasks"
- Update status and add work notes

### As Officer (👮)
- View "All Incidents" dashboard
- Use filters to find critical issues
- Click on a ticket to assign to field staff
- Go to "Team Management" to see utilization

### As Admin (⚙️)
- View analytics on home dashboard
- Change report period (Daily/Weekly/Monthly)
- Click "Download Report" to export data
- Browse "Audit Logs" to see all activities

## Key Features Working Out of the Box

✅ **Full Ticket Workflow**
- Create incidents → Assign → Progress → Resolve → Close

✅ **Role-Based Access**
- Citizens see only their reports
- Staff see assigned work
- Officers see all incidents
- Admins see analytics

✅ **Complete Audit Trail**
- Every action logged with timestamp
- Field change tracking
- Actor identification
- Compliance ready

✅ **Mobile Responsive**
- Works on phones, tablets, desktops
- Touch-friendly interface
- Hamburger menu on mobile

✅ **Analytics & Reports**
- Real-time KPIs
- Category/severity breakdowns
- JSON export for compliance
- Performance metrics

## Quick Test Scenarios

### Scenario 1: Report an Incident (5 min)

1. Login as Citizen
2. Click "Report an Incident"
3. Fill form:
   - Title: "Large pothole on Main Street"
   - Category: Pothole
   - Severity: High
   - Location: "Main Street at 5th Ave"
   - Description: "Deep pothole, water pooling, safety hazard"
4. Click Submit
5. Note the ticket number
6. Go to "My Reports" and see it there
7. Timeline shows creation in audit history

### Scenario 2: Assign & Complete Work (5 min)

1. Login as Officer
2. Go to "All Incidents"
3. Find your new ticket from Scenario 1
4. Click on it
5. Scroll to "Assignment" section
6. Select "Field Officer Sarah" from dropdown
7. Click "Assign"
8. Audit log shows assignment
9. Login as Field Staff (Sarah)
10. Go to "My Assigned Tasks"
11. Find the ticket
12. Add a work note: "Arrived on scene, assessing damage"
13. Change status to "In Progress"
14. Add another note: "Repairs complete, surface smooth"
15. Change status to "Mark as Resolved"
16. Audit trail shows all changes

### Scenario 3: View Analytics (3 min)

1. Login as Admin
2. Home page shows:
   - Total incidents
   - Critical count
   - Resolution rate
   - Average resolution time
3. Click "Download Report"
4. JSON file downloaded with all metrics
5. Go to "Audit Logs"
6. See all system activities in timeline
7. Scroll to see all 50 most recent actions

### Scenario 4: Team Performance (3 min)

1. Login as Officer
2. Go to "Team Management"
3. See each field staff:
   - Active job count
   - Completed jobs
   - Workload bar chart
4. Use this to balance assignments

## File Structure Reference

```
Key files you'll interact with:
├── app/page.tsx                    # Main app entry
├── components/auth/login-page.tsx  # Role selection
├── components/portals/
│   ├── citizen-portal.tsx
│   ├── field-staff-interface.tsx
│   ├── officer-dashboard.tsx
│   └── admin-analytics.tsx
├── lib/types.ts                    # Type definitions
└── lib/storage.ts                  # Data management
```

## Data Storage

All data is stored in browser's localStorage:
- Demo data pre-populated
- Persists across page refreshes
- Clear browser data to reset
- No server/database needed for demo

## Build Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

```

## Environment Setup (Optional)

```bash
# Copy example to .env.local (optional)
cp .env.example .env.local

# For future backend integration:
# DATABASE_URL=your_database
# NEXT_PUBLIC_API_URL=your_api
```

## Troubleshooting

**App won't start?**
```bash
npm install              # Reinstall dependencies
npm run dev             # Try again
```

**Data reset between sessions?**
- Browser localStorage is enabled
- Check if private/incognito mode (uses different storage)

**Mobile view looks wrong?**
- Check device width setting in browser dev tools
- Try actual mobile device

**Performance slow?**
- Close other browser tabs
- Clear browser cache
- Disable browser extensions

## Next Steps

1. **Explore each role** - Spend 5 min in each
2. **Create test incidents** - Get comfortable with reporting
3. **Test the audit trail** - Make changes and see history
4. **Generate reports** - Download and inspect data
5. **Review the code** - See how it's built in `/components` and `/lib`

## Learning Resources

- **README.md** - Full feature documentation
- **GUIDE.md** - Comprehensive user guide
- **lib/types.ts** - Data structure reference
- **components/** - Component architecture

## Tips for Getting Most Out of Demo

1. Use realistic scenarios
2. Test role-based access (try things as wrong roles, notice restrictions)
3. Pay attention to audit logs (they show everything)
4. Try mobile view (responsive design feature)
5. Export a report and inspect the JSON
6. Create multiple incidents to test filtering

## What's Pre-Loaded

Demo comes with:
- 4 demo users (one for each role)
- 3 sample incidents at various stages
- Complete audit logs for each
- No authentication required - just select and go

## Backend Integration Ready

The app is structured for easy backend addition:
- All API calls would go through `/lib/storage.ts`
- Replace `localStorage` with API calls
- Add authentication system
- Add database integration
- All UI components unchanged

---

That's it! You have a fully functional, mobile-first incident management platform ready to explore. Start by trying each role and going through the test scenarios above.

Need help? Check README.md and GUIDE.md for detailed documentation.

Happy exploring! 🏙️
