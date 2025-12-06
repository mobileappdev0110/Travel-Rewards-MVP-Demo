# Demo Mode Guide

## What is Demo Mode?

Demo Mode allows you to showcase the GateReady MVP interface **without any backend setup**. All data is stored locally in the browser using localStorage.

## How to Enable Demo Mode

### Option 1: Via UI (Easiest)
1. Visit the homepage (`/`)
2. Click the **"View Demo"** button
3. You'll be automatically logged in and can explore all features

### Option 2: Via Login Page
1. Go to `/login`
2. Click **"Enter Demo Mode"** button at the bottom
3. You'll be redirected to the dashboard

### Option 3: Environment Variable
Add to your `.env` file:
```
NEXT_PUBLIC_DEMO_MODE=true
```

## What Works in Demo Mode

✅ **Dashboard** - Add/remove loyalty balances (stored in browser)
✅ **Travel Preferences** - Set travel dates (stored in browser)
✅ **Deals Page** - View mock deals (no API needed)
✅ **Invite Flow** - Generate invite links (demo data)
✅ **All UI Components** - Full interface experience

## What's Different

- No Supabase authentication required
- No database connection needed
- All data persists in browser localStorage
- Data is cleared when you clear browser data
- Perfect for client demos and presentations

## How to Exit Demo Mode

1. Click **"Sign Out"** in the navbar
2. Demo mode will be disabled
3. You'll be redirected to the homepage

## For Client Presentations

1. **Deploy to Vercel** (or any hosting)
2. **Enable Demo Mode** by clicking "View Demo"
3. **Show all features**:
   - Add loyalty balances
   - Set travel preferences
   - View deals
   - Generate invite links
4. All data persists during the session

## Technical Details

- Demo mode uses `localStorage` for data persistence
- Mock user is automatically created
- All API calls are bypassed
- No environment variables needed
- Works completely offline after initial load

## Perfect For

- Client demonstrations
- UI/UX reviews
- Stakeholder presentations
- Design validation
- Quick prototyping feedback

