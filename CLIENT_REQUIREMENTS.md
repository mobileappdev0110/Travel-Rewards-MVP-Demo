# Client Requirements for Production Setup

## What You Need From Your Client

To convert the demo into a fully functional production site, you'll need the following from your client:

---

## 1. Supabase Account & Credentials

### Required Information:
- ✅ **Supabase Project URL**
  - Format: `https://xxxxxxxxxxxxx.supabase.co`
  - Where to find: Supabase Dashboard → Settings → API → Project URL

- ✅ **Supabase Anon/Public Key**
  - Format: Long JWT token string
  - Where to find: Supabase Dashboard → Settings → API → anon/public key

- ✅ **Supabase Service Role Key** (Optional, for admin operations)
  - Format: Long JWT token string
  - Where to find: Supabase Dashboard → Settings → API → service_role key
  - ⚠️ **Keep this secret!** Never expose in client-side code

### Database Connection:
- ✅ **Database Connection String**
  - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
  - Where to find: Supabase Dashboard → Settings → Database → Connection String
  - **Important**: Use the "Connection Pooling" URL for production (port 6543)

---

## 2. Supabase Project Setup

### Client Needs to:
1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up (free tier available)
   - Create a new project

2. **Configure Authentication**
   - Go to Authentication → URL Configuration
   - Add your production domain to "Site URL"
   - Add your production domain to "Redirect URLs"
   - Example: `https://yourdomain.com`

3. **Set Up Email Templates** (Optional but recommended)
   - Go to Authentication → Email Templates
   - Customize the magic link email
   - Test email delivery

4. **Configure Row Level Security (RLS)**
   - Enable RLS on all tables
   - Set up security policies (you can provide SQL scripts)

---

## 3. Domain & Hosting

### If Using Vercel:
- ✅ **Domain Name** (optional, Vercel provides free subdomain)
- ✅ **Vercel Account Access** (or you deploy on their behalf)

### If Using Other Hosting:
- ✅ **Hosting Provider Account Details**
- ✅ **Domain Name & DNS Access**
- ✅ **SSL Certificate** (usually auto-provisioned)

---

## 4. Environment Variables to Set

Once you have the Supabase credentials, set these in your hosting platform:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Database (use connection pooling URL)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Optional: App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 5. Database Schema Setup

### You'll Need to:
1. **Run Prisma Migrations**
   ```bash
   npx prisma db push
   ```
   Or provide SQL scripts for the client to run in Supabase SQL Editor

2. **Set Up RLS Policies**
   - Provide SQL scripts for Row Level Security
   - Ensure users can only access their own data

---

## 6. Optional: Additional Services

### If Adding Real Features Later:
- **Email Service** (if custom emails needed)
  - SendGrid, Mailgun, AWS SES, etc.
  - API keys and configuration

- **Payment Processing** (if adding paid features)
  - Stripe, PayPal, etc.
  - API keys and webhook URLs

- **Analytics** (if tracking needed)
  - Google Analytics, Plausible, etc.
  - Tracking IDs

---

## Quick Setup Checklist for Client

### Step 1: Supabase Setup (Client Does This)
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project
- [ ] Note down Project URL and Anon Key
- [ ] Get Database Connection String
- [ ] Configure Authentication URLs
- [ ] Share credentials with you

### Step 2: You Do This
- [ ] Add environment variables to Vercel/hosting
- [ ] Run database migrations
- [ ] Set up RLS policies
- [ ] Test authentication flow
- [ ] Deploy to production

### Step 3: Client Verification
- [ ] Test signup/login
- [ ] Test all features
- [ ] Verify data persistence
- [ ] Check email delivery

---

## Cost Estimates for Client

### Supabase (Free Tier):
- ✅ **Free**: Up to 500MB database, 2GB bandwidth, 50,000 monthly active users
- 💰 **Pro**: $25/month for more resources

### Vercel (Free Tier):
- ✅ **Free**: Unlimited personal projects, 100GB bandwidth
- 💰 **Pro**: $20/month for team features

### Total Minimum Cost: **$0/month** (free tier)
### Recommended for Production: **~$45/month** (Pro tiers)

---

## Security Checklist

Before going live, ensure:
- [ ] All environment variables are set (never commit to Git)
- [ ] RLS policies are enabled on all tables
- [ ] Service role key is never exposed
- [ ] HTTPS is enabled (auto on Vercel)
- [ ] CORS is properly configured
- [ ] Rate limiting is considered (Supabase has built-in)

---

## Support & Maintenance

### What Client Needs to Know:
1. **Supabase Dashboard Access**
   - Monitor database usage
   - View user analytics
   - Manage authentication

2. **Vercel Dashboard Access**
   - View deployment logs
   - Monitor performance
   - Manage domains

3. **Backup Strategy**
   - Supabase provides automatic backups
   - Consider additional backup solution for critical data

---

## Handoff Document Template

When ready to go live, provide client with:

```
PRODUCTION CREDENTIALS
=====================

Supabase:
- Project URL: https://xxxxxxxxxxxxx.supabase.co
- Dashboard: https://app.supabase.com/project/xxxxx
- Login: [client email]

Vercel:
- Dashboard: https://vercel.com/your-team
- Production URL: https://yourdomain.com
- Login: [client email]

Environment Variables:
[Share securely via password manager or encrypted file]

Support Contacts:
- Technical Support: [your email]
- Supabase Support: support@supabase.com
```

---

## Summary: Minimum Requirements

**To go live, you need:**
1. ✅ Supabase Project URL
2. ✅ Supabase Anon Key  
3. ✅ Database Connection String
4. ✅ Production domain (or use Vercel subdomain)

**That's it!** Everything else can be configured after deployment.

