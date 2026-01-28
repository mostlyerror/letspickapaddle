# Database Migration: SQLite → Supabase (PostgreSQL) ✅

## What Was Done

### 1. ✅ Updated Prisma Schema
**File: `prisma/schema.prisma`**
- Changed datasource from SQLite to PostgreSQL
- Added connection pooling support with `DATABASE_URL` and `DIRECT_URL`
- All models remain unchanged (compatible with both databases)

### 2. ✅ Updated Build Configuration
**File: `package.json`**
- Changed build script from `prisma migrate deploy` to `prisma db push`
- Added `db:push` script for manual schema updates
- Better suited for Supabase's schema management approach

### 3. ✅ Removed SQLite Artifacts
- Deleted `prisma/dev.db` (SQLite database file)
- Removed SQLite migration files
- Updated `.gitignore` to prevent SQLite files from being tracked

### 4. ✅ Created Documentation
- **SUPABASE_SETUP.md**: Comprehensive step-by-step setup guide
- **.env.example**: Template for required environment variables
- **Updated README.md**: Reflects new Supabase architecture

### 5. ✅ Committed Changes
All changes have been committed to git with message:
```
Migrate from SQLite to Supabase PostgreSQL
```

## What You Need to Do Next

### Step 1: Create Supabase Project (10 minutes)

1. Go to https://supabase.com and create an account
2. Click "New Project"
3. Fill in:
   - **Name**: letspickapaddle
   - **Database Password**: Generate and save securely
   - **Region**: Choose closest to your users (e.g., US East)
   - **Plan**: Free tier
4. Wait ~2 minutes for provisioning

### Step 2: Get Database Connection Strings (5 minutes)

1. In Supabase dashboard → **Settings** → **Database**
2. Find "Connection Pooler" section:
   - Copy the **Transaction mode** URI
   - Replace `[YOUR-PASSWORD]` with your database password
   - Add `&connection_limit=1` at the end
   - This is your `DATABASE_URL`

3. Find "Connection string" section:
   - Copy the **URI** (port 5432)
   - Replace `[YOUR-PASSWORD]` with your database password
   - This is your `DIRECT_URL`

### Step 3: Configure Local Environment (2 minutes)

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your connection strings:
   ```env
   DATABASE_URL="postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

### Step 4: Initialize Database (3 minutes)

Run these commands in order:

```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Push schema to Supabase (creates tables)
npx prisma db push

# Seed the database
npm run db:seed
```

Expected output:
```
✅ 20 paddles created
✅ 8 quiz questions created
```

### Step 5: Test Locally (2 minutes)

```bash
# Start dev server
npm run dev
```

Visit and verify:
- ✅ http://localhost:3000 - Homepage loads
- ✅ http://localhost:3000/quiz - Shows 8 questions
- ✅ http://localhost:3000/paddles - Shows 20 paddles
- ✅ http://localhost:3000/api/paddles - Returns JSON with count: 20

### Step 6: Configure Vercel (5 minutes)

1. Go to https://vercel.com/dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add TWO variables for all environments (Production, Preview, Development):
   - Name: `DATABASE_URL`
     Value: Your connection pooler URL (from Step 2)
   - Name: `DIRECT_URL`
     Value: Your direct connection URL (from Step 2)

### Step 7: Deploy to Production (1 minute)

```bash
git push
```

Vercel will automatically:
1. Detect the push
2. Run `prisma generate`
3. Run `prisma db push` (creates tables in production)
4. Build and deploy your app

**Note**: You'll need to run the seed script manually in production:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Run seed in production
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx tsx prisma/seed.ts
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx tsx prisma/seedQuiz.ts
```

OR run SQL directly in Supabase dashboard to seed data.

### Step 8: Verify Production (2 minutes)

Test these endpoints:
```bash
curl https://letspickapaddle.vercel.app/api/paddles | jq '.count'
# Should return: 20

curl https://letspickapaddle.vercel.app/api/quiz/questions | jq '.data | length'
# Should return: 8
```

## Verification Checklist

Use this checklist to ensure everything works:

### Local Development
- [ ] `.env` file created with both DATABASE_URL and DIRECT_URL
- [ ] `npx prisma generate` completes successfully
- [ ] `npx prisma db push` creates tables in Supabase
- [ ] `npm run db:seed` populates 20 paddles and 8 questions
- [ ] Supabase dashboard → Table Editor shows all 3 tables with data
- [ ] `npm run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Quiz shows 8 questions
- [ ] Paddle browser shows 20 paddles
- [ ] Completing quiz shows 5 recommendations

### Production Deployment
- [ ] Both environment variables added to Vercel
- [ ] `git push` triggers successful deployment
- [ ] Build logs show Prisma client generation
- [ ] Production database seeded with data
- [ ] Homepage loads at https://letspickapaddle.vercel.app
- [ ] API endpoints return correct data
- [ ] Quiz flow works end-to-end
- [ ] No errors in Vercel function logs

## File Changes Summary

| File | Change | Purpose |
|------|--------|---------|
| `prisma/schema.prisma` | Modified | PostgreSQL datasource config |
| `package.json` | Modified | Updated build script to use db push |
| `.gitignore` | Modified | Allow .env.example to be committed |
| `.env.example` | Created | Template for environment variables |
| `SUPABASE_SETUP.md` | Created | Comprehensive setup guide |
| `README.md` | Modified | Updated tech stack and instructions |
| `prisma/dev.db` | Deleted | Old SQLite database |
| `prisma/migrations/*` | Deleted | Old SQLite migrations |

## Troubleshooting

### Issue: "Relation does not exist" error
**Solution**: Run `npx prisma db push` to create tables

### Issue: Connection timeout
**Solution**:
- Verify connection strings are correct
- Ensure `connection_limit=1` is in DATABASE_URL
- Use port 6543 for DATABASE_URL (pooler)
- Use port 5432 for DIRECT_URL (direct)

### Issue: Vercel build fails
**Solution**:
- Check both environment variables are set in Vercel
- Verify they're set for all environments
- Check Vercel build logs for specific error

### Issue: No data in production
**Solution**: Seed data manually (see Step 7 above)

## Rollback Plan

If you need to rollback to SQLite:

```bash
git revert HEAD
git push
```

This will restore the SQLite configuration and redeploy.

## Next Steps After Migration

Once Supabase is working, you can leverage its features:

### Immediate Benefits
- ✅ Persistent data storage (no more resets)
- ✅ Better performance with connection pooling
- ✅ Production-ready database

### V1.1 Features (4-6 weeks)
- Supabase Auth for user accounts
- Save quiz results to user profiles
- Share results via unique URLs
- Affiliate click tracking

### V2 Features (Future)
- pgvector for ML-enhanced recommendations
- PostGIS for demo locator
- Edge Functions for webhooks
- Realtime for admin dashboards

## Support

- Full setup guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Supabase docs: https://supabase.com/docs
- Prisma + Supabase: https://www.prisma.io/docs/guides/database/supabase

---

**Estimated total time**: ~30 minutes
**Difficulty**: Beginner-friendly with step-by-step instructions
