# Responsive Design & Interactive Testing Guide

## Quick Start Testing

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 1. Landing Page Testing

### Desktop (1280px+)
- [ ] Hero section displays with gradient background
- [ ] "Get Started" and "Watch Demo" buttons are side-by-side
- [ ] Feature grid shows 4 columns
- [ ] How It Works shows 4 steps horizontally
- [ ] User roles grid displays 4 roles in single row
- [ ] Footer shows 4 columns
- [ ] Logo and tagline visible in header

### Tablet (768px - 1024px)
- [ ] Hero section still responsive
- [ ] Buttons stack vertically
- [ ] Feature grid shows 2 columns
- [ ] How It Works shows 2 columns
- [ ] User roles grid shows 2 columns
- [ ] Footer shows 2 columns
- [ ] Header still clean and organized

### Mobile (375px - 640px)
- [ ] Hero section centered
- [ ] Single column layout throughout
- [ ] Buttons full width and stackable
- [ ] Text sizes readable
- [ ] No horizontal scroll
- [ ] CTA section properly formatted
- [ ] Footer compressed but readable

---

## 2. Login Page Testing

### Desktop Flow
1. Click "Get Started Free" button on landing page
2. See 4 role cards displayed
3. Click on each role card - should highlight with orange border
4. Click "Continue" button - should navigate into dashboard
5. Verify loading spinner appears
6. Check user profile shows correct role

### Tablet Flow
1. Repeat desktop flow
2. Verify touch targets are 44px minimum
3. Check spacing is comfortable for touch
4. Verify no horizontal scroll

### Mobile Flow
1. Repeat above steps
2. Verify card height doesn't exceed viewport
3. Check button sizing (should be large for thumb)
4. Verify emoji icon displays correctly
5. No layout shift when button appears

---

## 3. Header Component Testing

### Desktop
- [ ] CityPulse logo visible on left
- [ ] User profile info visible on right (name + role badge)
- [ ] Avatar circle shows user initial
- [ ] Logout button visible and clickable
- [ ] Hamburger menu NOT visible

### Tablet
- [ ] Logo visible
- [ ] User info still visible
- [ ] Hamburger menu starts appearing around 768px
- [ ] Smooth transition at breakpoints

### Mobile
- [ ] Logo visible but name hidden
- [ ] Hamburger menu visible
- [ ] Click hamburger - menu slides down
- [ ] Menu shows: Home, Notifications, Settings, Logout
- [ ] Click an item - menu closes
- [ ] Click X button - menu closes
- [ ] User info in menu or separate section

---

## 4. Footer Testing

### All Sizes
- [ ] Footer sticks to bottom of page
- [ ] Links are clickable (no cursor pointer issues)
- [ ] Text is readable
- [ ] Hover effects visible on links
- [ ] Copyright year is current
- [ ] No overlapping content

### Mobile
- [ ] 2-column layout
- [ ] Gap between columns is proper
- [ ] Scrollable if needed
- [ ] Social links work (placeholder in demo)

### Desktop
- [ ] 4-column layout visible
- [ ] Equal spacing
- [ ] Proper alignment

---

## 5. Officer Task Manager Testing

### Task Assignment Workflow
1. **Login as Officer** (mike@citypulse.local)
2. **Navigate to Team Management** (should show OfficerTaskManager)
3. **View Unassigned Tasks**:
   - [ ] All unassigned incidents display
   - [ ] Each shows title, location, severity
   - [ ] "Assign" button visible on each
   - [ ] Click button - modal appears

4. **Assignment Modal**:
   - [ ] Shows ticket title
   - [ ] Dropdown populated with field staff
   - [ ] Can select staff member
   - [ ] "Assign Task" button functional
   - [ ] "Cancel" button closes modal
   - [ ] Success message appears after assign

5. **Assigned Tasks Section**:
   - [ ] Moved to "Assigned Tasks" after assignment
   - [ ] Shows assignee name
   - [ ] Cannot reassign (optional)

### Filter Testing
- [ ] Search by title works
- [ ] Search by ticket ID works
- [ ] Status filter works (all, open, assigned, in_progress, on_hold)
- [ ] Severity filter works (all, critical, high, medium, low)
- [ ] Filters combine properly
- [ ] Apply Filters button updates results

### Stats Display
- [ ] Total Tasks count correct
- [ ] Critical count matches filtered results
- [ ] Unassigned count matches unassigned tasks
- [ ] Assigned count matches assigned tasks

---

## 6. Responsive Button Testing

### Login Page Buttons
1. **Get Started Button** (Landing Page)
   - [ ] Responsive sizing (grows on larger screens)
   - [ ] Hover state changes color to darker orange
   - [ ] Active state shows press feedback
   - [ ] Works on touch devices

2. **Continue Button** (Login Page)
   - [ ] Only shows when role selected
   - [ ] Full width on mobile
   - [ ] Proper height (h-12 sm:h-14)
   - [ ] Loading state shows spinner
   - [ ] Disabled state when loading

3. **Quick Action Buttons** (Officer Dashboard)
   - [ ] All 4 buttons visible on desktop
   - [ ] Wrap to 2 columns on tablet
   - [ ] Single column on mobile
   - [ ] Click navigation works
   - [ ] Hover effects visible

### Interactive Button Features
- [ ] All buttons have `:hover` states
- [ ] All buttons have `:active` states
- [ ] All buttons have `:disabled` states
- [ ] Touch feedback on mobile (visual change)
- [ ] No text selection on button click
- [ ] Proper focus states (keyboard navigation)

---

## 7. Mobile Touchscreen Testing

### Test on Actual Device (iPhone/Android)
1. **Navigation**:
   - [ ] Hamburger menu tap opens dropdown
   - [ ] Menu items are tappable (44px minimum)
   - [ ] Back gesture works
   - [ ] No zoom required

2. **Forms**:
   - [ ] Inputs don't zoom on focus
   - [ ] Keyboard appears for text inputs
   - [ ] Dropdown selectors work
   - [ ] Form submission works

3. **Scrolling**:
   - [ ] No horizontal scroll
   - [ ] Smooth vertical scroll
   - [ ] Sticky header stays fixed
   - [ ] No jank/stuttering

4. **Gestures**:
   - [ ] Swipe left/right doesn't break layout
   - [ ] Pinch zoom disabled (optional)
   - [ ] Double-tap zoom works as expected

---

## 8. Accessibility Testing

### Keyboard Navigation
1. Press `Tab` repeatedly
   - [ ] Focus moves through all interactive elements
   - [ ] Focus indicator visible
   - [ ] Logical tab order (left-to-right, top-to-bottom)
   - [ ] Can reach all buttons without scrolling

2. Press `Enter` on buttons
   - [ ] All buttons activate on Enter
   - [ ] Links activate on Enter
   - [ ] Select dropdowns open on Enter

3. Press `Escape`
   - [ ] Modals close on Escape
   - [ ] Menus close on Escape

### Screen Reader Testing (macOS VoiceOver / Windows NVDA)
1. Launch screen reader
2. Navigate page:
   - [ ] Page title announces "CityPulse"
   - [ ] Headings announced with level (h1, h2, etc)
   - [ ] Button text announced clearly
   - [ ] Form labels associated with inputs
   - [ ] Images have alt text

### Color Contrast Testing
- Use axe DevTools browser extension
- [ ] All text passes WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Buttons pass contrast requirements
- [ ] Error messages are visible

---

## 9. Cross-Browser Testing

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] Responsive design works
- [ ] Animations smooth
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Responsive design works
- [ ] Animations smooth
- [ ] CSS compatibility good

### Safari (macOS/iOS)
- [ ] All features work
- [ ] Touch gestures work
- [ ] Mobile viewport correct
- [ ] No webkit-specific issues

---

## 10. Performance Testing

### Lighthouse Audit (DevTools)
1. Run Lighthouse audit
2. Check scores:
   - [ ] Performance: > 90
   - [ ] Accessibility: > 95
   - [ ] Best Practices: > 90
   - [ ] SEO: > 90

### Mobile Performance
- [ ] Page loads in < 3 seconds on 4G
- [ ] Interactions respond in < 100ms
- [ ] No layout shift (CLS < 0.1)
- [ ] No long tasks (> 50ms)

---

## 11. Feature Completeness Checklist

### Landing Page
- [ ] Hero section with CTA
- [ ] Feature grid (4 items)
- [ ] How it works (4 steps)
- [ ] User roles (4 cards)
- [ ] CTA section
- [ ] Footer with links

### Login Page
- [ ] 4 role cards
- [ ] Role selection highlighting
- [ ] Continue button (conditional)
- [ ] Loading state
- [ ] Demo mode info

### Dashboard
- [ ] User profile visible
- [ ] Logout button visible
- [ ] Navigation menu (role-based)
- [ ] Main content area
- [ ] Responsive grid layout

### Officer Task Manager (NEW)
- [ ] Unassigned tasks list
- [ ] Assigned tasks list
- [ ] Search functionality
- [ ] Status filter
- [ ] Severity filter
- [ ] Assignment modal
- [ ] Staff selection dropdown
- [ ] Stats cards

---

## 12. Common Issues & Fixes

### Issue: Button not clickable on mobile
**Solution**: Check button is not inside click-stopping div
```tsx
// Bad
<div onClick={...} className="cursor-not-allowed">
  <Button>Click me</Button>
</div>

// Good
<Button onClick={...}>Click me</Button>
```

### Issue: Text too small on mobile
**Solution**: Use responsive font sizes
```tsx
// Bad
<h1 className="text-4xl">Title</h1>

// Good
<h1 className="text-2xl sm:text-3xl lg:text-4xl">Title</h1>
```

### Issue: Dropdown cut off on mobile
**Solution**: Use `z-50` and `fixed` positioning
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Modal content */}
</div>
```

### Issue: Header takes too much space
**Solution**: Hide unnecessary elements on mobile
```tsx
<span className="hidden sm:inline">Desktop only text</span>
```

---

## 13. Pre-Launch Checklist

Before deploying to production:

- [ ] All pages load without errors
- [ ] All buttons are interactive
- [ ] All forms submit properly
- [ ] Mobile layout is clean
- [ ] Tablet layout is clean
- [ ] Desktop layout is clean
- [ ] Accessibility audit passes
- [ ] Performance audit passes
- [ ] No console errors
- [ ] All links work
- [ ] User can complete full workflow
- [ ] Officer can assign tasks to field staff
- [ ] Field staff can view assigned tasks
- [ ] Admin can view analytics

---

## 14. Test Results Template

```
Test Date: __________
Tester: __________
Device/Browser: __________

Landing Page
- [ ] Desktop: Pass / Fail
- [ ] Tablet: Pass / Fail
- [ ] Mobile: Pass / Fail

Login Page
- [ ] Desktop: Pass / Fail
- [ ] Tablet: Pass / Fail
- [ ] Mobile: Pass / Fail

Dashboard
- [ ] Desktop: Pass / Fail
- [ ] Tablet: Pass / Fail
- [ ] Mobile: Pass / Fail

Officer Task Manager
- [ ] Search works: Pass / Fail
- [ ] Filter works: Pass / Fail
- [ ] Assignment works: Pass / Fail
- [ ] Mobile layout: Pass / Fail

Accessibility
- [ ] Keyboard navigation: Pass / Fail
- [ ] Screen reader: Pass / Fail
- [ ] Color contrast: Pass / Fail

Overall Status: ✅ Ready / ⚠️ Issues Found

Issues Found:
1. __________
2. __________
```

---

## 15. Recommended Testing Tools

### Automated
- **Lighthouse**: DevTools built-in
- **axe DevTools**: Chrome extension (accessibility)
- **Responsive Design Checker**: Online tool
- **WebAIM Contrast Checker**: Color contrast

### Manual
- **Device Emulation**: Chrome DevTools
- **Real Devices**: iPhone, Android, iPad
- **Screen Readers**: NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Tab and arrow keys

### Browser DevTools
```
1. Right-click → Inspect
2. Ctrl+Shift+M (toggle device toolbar)
3. Select device size
4. Test interactions
```

---

**Version**: 1.0
**Last Updated**: February 2024
**Status**: Complete ✅
