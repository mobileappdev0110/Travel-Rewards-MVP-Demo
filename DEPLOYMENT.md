# Deployment Guide for GateReady MVP

## Prerequisites

1. **Supabase Project**
   - Create a new Supabase project at https://supabase.com
   - Note down your project URL and anon key
   - Go to Settings > Database to get your connection string

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect your GitHub account

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: GateReady MVP"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up Database

1. In your Supabase project, go to SQL Editor
2. Run the Prisma migration (or use `prisma db push` locally first)
3. Alternatively, you can use Supabase's table editor to create tables manually based on the Prisma schema

### 3. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 4. Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**Important Notes:**
- For `DATABASE_URL`, use the connection pooling URL from Supabase (Settings > Database > Connection Pooling)
- The format is: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
- Never commit `.env` files to Git

### 5. Run Database Migrations

After deployment, you can run migrations in two ways:

**Option A: Using Vercel CLI (Recommended)**
```bash
vercel env pull .env.local
npx prisma db push
```

**Option B: Using Supabase SQL Editor**
- Copy the SQL from Prisma migrations
- Run it in Supabase SQL Editor

### 6. Enable Row Level Security (RLS)

In Supabase, enable RLS on all tables and create policies:

```sql
-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoyaltyBalance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TravelPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invite" ENABLE ROW LEVEL SECURITY;

-- Example policy for LoyaltyBalance (users can only see their own)
CREATE POLICY "Users can view own balances"
ON "LoyaltyBalance" FOR SELECT
USING (auth.uid()::text = (SELECT "supabaseId" FROM "User" WHERE "User".id = "LoyaltyBalance"."userId"));

-- Similar policies for other tables
```

### 7. Configure Supabase Auth

1. In Supabase Dashboard, go to Authentication > URL Configuration
2. Add your Vercel domain to "Site URL"
3. Add your Vercel domain to "Redirect URLs"
4. Example: `https://your-app.vercel.app`

### 8. Test Deployment

1. Visit your Vercel URL
2. Try signing up with magic link
3. Test all features:
   - Add loyalty balances
   - Set travel preferences
   - View deals
   - Generate and use invite links

## Troubleshooting

### Database Connection Issues
- Make sure you're using the connection pooling URL for `DATABASE_URL`
- Check that your Supabase project is active
- Verify RLS policies allow your operations

### Authentication Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase Auth settings for redirect URLs
- Ensure email templates are configured in Supabase

### Build Errors
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally first

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database tables created
- [ ] RLS policies configured
- [ ] Supabase Auth redirect URLs configured
- [ ] Test signup/login flow
- [ ] Test all CRUD operations
- [ ] Test invite flow end-to-end
- [ ] Verify deals page loads with mock data

## Staging vs Production

You can set up separate environments:

1. **Staging**: Create a separate Vercel project and Supabase project
2. **Production**: Your main Vercel project

Use Vercel's environment variable management to set different values for:
- Preview deployments (staging)
- Production deployments

