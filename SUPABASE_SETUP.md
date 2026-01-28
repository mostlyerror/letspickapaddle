# Supabase Setup Guide

This guide walks you through setting up Supabase for the LetsPicKAPaddle application.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: letspickapaddle (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for MVP

5. Click "Create new project" and wait ~2 minutes for provisioning

## Step 2: Get Connection Strings

Once your project is ready:

1. Go to **Project Settings** (gear icon) → **Database**
2. Scroll to **Connection string** section
3. You'll need TWO connection strings:

### Connection Pooler URL (for DATABASE_URL)
- Select **URI** tab under "Connection Pooler"
- Mode should be **Transaction**
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your database password
- Add `&connection_limit=1` at the end
- Example: `postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`

### Direct Connection URL (for DIRECT_URL)
- Select **URI** tab under "Connection string"
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your database password
- Example: `postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

## Step 3: Configure Local Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase connection strings:
   ```env
   DATABASE_URL="postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

## Step 4: Initialize Database

Run the following commands to set up your database schema and seed data:

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to Supabase (creates tables)
npx prisma db push

# Seed the database with paddle data and quiz questions
npm run db:seed
```

You should see:
- ✅ 20 paddles created
- ✅ 8 quiz questions created

## Step 5: Verify Database in Supabase Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. You should see three tables:
   - `paddles` (20 rows)
   - `quiz_questions` (8 rows)
   - `quiz_responses` (0 rows initially)

## Step 6: Configure Vercel Environment Variables

1. Go to your Vercel project: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add both variables for **Production**, **Preview**, and **Development**:
   - `DATABASE_URL` = your connection pooler URL
   - `DIRECT_URL` = your direct connection URL

4. Redeploy your application:
   ```bash
   git push
   ```
   Or manually trigger a redeployment in Vercel dashboard

## Step 7: Test Your Application

### Local Testing
```bash
npm run dev
```

Visit:
- http://localhost:3000 - Homepage
- http://localhost:3000/quiz - Quiz with 8 questions
- http://localhost:3000/paddles - Browse all 20 paddles
- http://localhost:3000/api/paddles - API endpoint

### Production Testing
After deployment, test these endpoints:
```bash
# Check paddle count
curl https://letspickapaddle.vercel.app/api/paddles | jq '.count'
# Should return: 20

# Check quiz questions
curl https://letspickapaddle.vercel.app/api/quiz/questions | jq '.data | length'
# Should return: 8
```

## Optional: Enable Row-Level Security

For future features (user accounts, B2B), you can enable RLS:

1. Go to **SQL Editor** in Supabase dashboard
2. Run this SQL:

```sql
-- Enable RLS on tables
ALTER TABLE paddles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to paddles and questions
CREATE POLICY "Public paddles read" ON paddles FOR SELECT USING (true);
CREATE POLICY "Public quiz questions read" ON quiz_questions FOR SELECT USING (true);

-- Allow anyone to create quiz responses
CREATE POLICY "Anyone can create quiz responses" ON quiz_responses FOR INSERT WITH CHECK (true);
```

Note: For now, we'll keep RLS disabled since we're not using Supabase Auth yet. This will be enabled in V1.1.

## Troubleshooting

### "relation does not exist" error
- Make sure you ran `npx prisma db push`
- Check that your DATABASE_URL is correct

### Connection timeout
- Verify your connection string is correct
- Check that `connection_limit=1` is added to DATABASE_URL
- Make sure you're using the connection pooler URL (port 6543) not direct connection (port 5432) for DATABASE_URL

### Seed script fails
- Make sure the schema was pushed first with `npx prisma db push`
- Check the Supabase dashboard → Table Editor to verify tables exist

### Vercel build fails
- Verify both DATABASE_URL and DIRECT_URL are set in Vercel environment variables
- Check the build logs in Vercel dashboard for specific errors
- Ensure environment variables are set for all environments (Production, Preview, Development)

## Next Steps

Once Supabase is working:

### V1.1 Features (Planned)
- ✅ Supabase Auth for user accounts
- ✅ Save quiz results with user profiles
- ✅ Share results via unique URLs
- ✅ Affiliate click tracking

### V2 Features (Future)
- pgvector extension for ML-enhanced recommendations
- PostGIS extension for demo locator geolocation
- Edge Functions for webhook processing
- Realtime for live admin dashboards

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
