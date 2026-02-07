# CityPulse - Quick Start Guide (5 Minute Setup)

## 🚀 Installation (1 minute)

```bash
npm install
npm run dev
```

Visit: **http://localhost:3000**

---

## 🎯 Test Accounts (Use Any)

| Role | Email | Password | Use Case |
|------|-------|----------|----------|
| 👤 Citizen | citizen@citypulse.local | Demo | Report incidents |
| 🔧 Field Staff | sarah@citypulse.local | Demo | Accept & complete tasks |
| 👮 Officer | mike@citypulse.local | Demo | **Assign tasks to staff** |
| ⚙️ Admin | admin@citypulse.local | Demo | View analytics |

---

## 🎪 Landing Page Tour (30 seconds)

1. **See landing page** with features overview
2. **Click "Get Started Free"** → Go to login
3. **Click "Watch Demo"** → Opens demo (not implemented)

---

## 👥 Role Workflows

### 1️⃣ Citizen (👤)
```
1. Login as citizen@citypulse.local
2. Click "Report Incident"
3. Fill form:
   - Title: "Pothole on Main Street"
   - Location: "123 Main St"
   - Category: "Pothole"
   - Severity: "High"
   - Add photo (optional)
4. Submit
5. See incident in "My Reports"
```

### 2️⃣ Officer (👮) - NEW FEATURE
```
1. Login as mike@citypulse.local
2. Click "Team Management" (or "Team" in nav)
3. See "Unassigned Tasks" section
4. Click "Assign" button on any incident
5. Select field staff from dropdown
6. Click "Assign Task"
7. Task moves to "Assigned Tasks"
8. Refresh - field staff sees assigned task
```

### 3️⃣ Field Staff (🔧)
```
1. Login as sarah@citypulse.local
2. Click "Assigned Tasks"
3. See tasks assigned to you
4. Click "Accept" or status button
5. Update progress
6. Mark "Resolved" when done
7. Add photos/notes
```

### 4️⃣ Admin (⚙️)
```
1. Login as admin@citypulse.local
2. Click "Analytics"
3. See dashboards:
   - KPI cards
   - Charts (bar, line, heatmap)
   - Officer performance
   - Geographic heatmap
4. Click "Export Report" for JSON
```

---

## 📱 Test on Mobile

### Chrome DevTools Method
```
1. Press F12 (Open DevTools)
2. Press Ctrl+Shift+M (Device toolbar)
3. Select device:
   - iPhone 12 Mini (375px)
   - iPad (768px)
   - Any size (drag to resize)
4. Test responsiveness
```

### Real Device
```
1. Get local IP: ipconfig (Windows) / ifconfig (Mac)
2. Visit: http://YOUR_IP:3000
3. Test on phone/tablet
4. All buttons should work
5. No horizontal scroll
```

---

## 🎨 Key Features to Test

### ✅ All Interactive
- [ ] Login buttons work
- [ ] Form submission works
- [ ] Task assignment works
- [ ] Status updates work
- [ ] Comments post work
- [ ] Filters work
- [ ] Search works
- [ ] Modals open/close

### ✅ All Responsive
- [ ] Mobile layout (375px)
- [ ] Tablet layout (768px)
- [ ] Desktop layout (1280px)
- [ ] No horizontal scroll
- [ ] Buttons are tappable
- [ ] Text is readable

---

## 🔥 Must-Try Features

### 1. Landing Page
- Scroll through features
- See how it's designed
- Check mobile responsiveness

### 2. Officer Task Manager (NEW!)
```
Login as Officer (mike@citypulse.local)
1. Click "Team Management"
2. See unassigned incidents
3. Search/filter tasks
4. Click "Assign" button
5. Select field staff
6. Assign task
7. See success message
8. Task moves to assigned section
```

### 3. Geographic Heatmap
```
Login as Admin
1. Click "Analytics"
2. Scroll to map
3. Click "Heatmap" button
4. See incident density visualization
```

### 4. Photo Upload
```
Login as Citizen
1. Click "Report Incident"
2. Take photo or select from device
3. See preview
4. Submit report with photo
5. Photo appears in ticket detail
```

---

## 🧪 Quick Test Cases

### Test 1: Full Citizen Workflow (2 min)
```
✓ Login as citizen
✓ Report incident
✓ See in "My Reports"
✓ Check status (Open)
✓ Logout
```

### Test 2: Officer Task Assignment (2 min)
```
✓ Login as officer
✓ Navigate to "Team Management"
✓ See unassigned tasks
✓ Click "Assign" on any task
✓ Select "Sarah" from dropdown
✓ Click "Assign Task"
✓ See success message
✓ Task appears in "Assigned Tasks"
```

### Test 3: Mobile Responsiveness (2 min)
```
✓ Open DevTools (F12)
✓ Toggle device toolbar (Ctrl+Shift+M)
✓ Select iPhone 12 Mini
✓ Login
✓ Click all buttons
✓ Scroll down - no horizontal scroll
✓ Check text is readable
✓ Try hamburger menu
```

---

## 📊 Sample Data

The system comes pre-loaded with sample incidents:

| ID | Title | Status | Severity | Assigned To |
|----|----|--------|----------|----------|
| CYP-2024-001 | Large pothole on Main Street | In Progress | High | Sarah |
| CYP-2024-002 | Basement flooding downtown | Assigned | Critical | Sarah |
| CYP-2024-003 | Street light out on Park Ave | Resolved | Medium | Sarah |
| CYP-2024-004 | Traffic signal malfunction | Open | Critical | Unassigned |
| CYP-2024-005 | Debris on sidewalk | On Hold | Low | Unassigned |

---

## 🔧 Troubleshooting

### "Page not loading"
```
1. Check if npm run dev is running
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+F5)
4. Check console for errors (F12)
```

### "Buttons not working"
```
1. Check if you're logged in
2. Check user role has permission
3. Try different role
4. Clear localStorage:
   localStorage.clear()
   Then reload
```

### "Mobile doesn't work"
```
1. Check viewport is set correctly
2. Check no horizontal scroll
3. Zoom to 100% (Ctrl+0)
4. Try different device size
5. Test on real device
```

### "Data disappeared"
```
1. Check DevTools → Application → LocalStorage
2. Make sure citypulse_current_user is set
3. If lost, click login again
4. All demo data is auto-loaded
```

---

## 📱 Responsive Sizes to Test

| Device | Width | Height | Test |
|--------|-------|--------|------|
| iPhone 12 Mini | 375px | 812px | Mobile |
| iPhone 12 | 390px | 844px | Mobile |
| iPad | 768px | 1024px | Tablet |
| iPad Pro | 1024px | 1366px | Large tablet |
| Desktop | 1280px+ | 720px+ | Full width |

---

## 🎯 Success Criteria

✅ You've successfully tested CityPulse when:

1. **Landing page loads** with all sections visible
2. **Can login** with any of 4 roles
3. **Can navigate** between role-specific screens
4. **Officer can assign** incidents to field staff
5. **Field staff can accept** assigned tasks
6. **Admin can view** analytics with charts
7. **Mobile looks good** on 375px width
8. **All buttons clickable** and responsive
9. **No errors in console** (F12)
10. **No horizontal scroll** on any page

---

## 🚀 Next Steps

### To Deploy
```bash
npm run build
npm start  # Test production build
```

Then:
1. Connect GitHub repository
2. Link Vercel project
3. Deploy with `vercel deploy`
4. Share live link

### To Customize
1. Edit colors in `/app/globals.css`
2. Add new incidents in `/lib/storage.ts`
3. Modify roles in `/components/auth/login-page.tsx`
4. Update categories in `/lib/types.ts`

### To Learn More
- Read: `/START_HERE.md` (entry point)
- Detailed: `/FINAL_SUMMARY.md` (complete overview)
- Test: `/RESPONSIVE_TESTING.md` (full test cases)
- Design: `/UI_IMPROVEMENTS.md` (design system)

---

## 💡 Pro Tips

1. **Use multiple tabs** to test different roles simultaneously
2. **Open DevTools** on second monitor for better testing
3. **Test mobile first**, then scale up
4. **Use Chrome DevTools** for quick responsive testing
5. **Clear cache** if seeing old data
6. **Check console** (F12) for helpful debug info

---

## 🆘 Need Help?

### Check Documentation
1. `/START_HERE.md` - Quick overview
2. `/GUIDE.md` - Step-by-step workflows
3. `/FINAL_SUMMARY.md` - Complete feature list
4. `/RESPONSIVE_TESTING.md` - Testing guide

### Common Questions
- **"How do I assign tasks?"** → Login as Officer, click "Team Management"
- **"How do I report an incident?"** → Login as Citizen, click "Report Incident"
- **"Is it mobile responsive?"** → Yes! Test with DevTools
- **"Can I test on my phone?"** → Yes! Use local IP instead of localhost

---

## 🎉 You're Ready!

```bash
npm install
npm run dev
# Open http://localhost:3000
# Login with any test account
# Start exploring!
```

**Enjoy testing CityPulse!** 🚀

---

**Version**: 1.0
**Last Updated**: February 2024
**Status**: Production Ready ✅
