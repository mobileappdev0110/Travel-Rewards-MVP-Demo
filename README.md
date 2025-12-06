# GateReady MVP

A travel rewards tracking web app that helps users track their loyalty balances, set travel dates, and get matched to the best redemption opportunities.

## Features

- ✅ **Authentication**: Supabase Magic Link authentication
- ✅ **Dashboard**: Manual entry of loyalty balances (credit cards & airlines)
- ✅ **Travel Preferences**: Set specific dates or flexible date ranges
- ✅ **Deals Page**: View matched reward deals (static/mock data)
- ✅ **+1 Invite Flow**: Generate invite links and share trip details

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma ORM**
- **Supabase** (Auth + Postgres + RLS)
- **TailwindCSS**
- **shadcn/ui** components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- PostgreSQL database (via Supabase)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `DATABASE_URL`: Your Supabase Postgres connection string

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
4. Deploy!

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── travel-preferences/ # Travel preferences page
│   ├── deals/             # Deals page
│   ├── invite/            # Invite flow
│   └── login/             # Login page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── supabase.ts       # Supabase client
└── prisma/               # Prisma schema
    └── schema.prisma     # Database schema
```

## Environment Variables

Make sure to set these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `DATABASE_URL`: Your Supabase Postgres connection string (with connection pooling)

## Database Schema

The app uses Prisma with the following main models:
- `User`: User accounts
- `LoyaltyBalance`: Credit card and airline balances
- `TravelPreference`: User travel date preferences
- `Deal`: Matched reward deals (mock data)
- `Invite`: +1 invite links and trip sharing

## Notes

- This is an MVP with mock/static data for deals
- No live API integrations or scraping
- Authentication uses Supabase Magic Links
- All data is stored in Supabase Postgres with RLS enabled

# Travel-Rewards-MVP-Demo
