# Quick Setup Guide

## Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings  
   - `DATABASE_URL` - From Supabase database settings (use connection pooling URL)

3. **Set Up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to http://localhost:3000

## First Time Setup Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema pushed to Supabase
- [ ] Row Level Security (RLS) enabled on tables
- [ ] RLS policies created (see DEPLOYMENT.md)
- [ ] Supabase Auth redirect URLs configured
- [ ] Test signup with magic link
- [ ] Test all features locally

## Common Issues

### "Prisma Client not generated"
Run: `npx prisma generate`

### "Database connection failed"
- Check your `DATABASE_URL` is correct
- Use the connection pooling URL from Supabase
- Ensure your Supabase project is active

### "Authentication not working"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase Auth settings
- Ensure redirect URLs are configured

### "Module not found" errors
Run: `npm install` to ensure all dependencies are installed

