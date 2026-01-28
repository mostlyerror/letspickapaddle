# Quick Start Guide

## For Local Development

### Prerequisites
- Node.js 20+ installed
- Supabase account (free tier)

### Setup (5 minutes)

1. **Create Supabase project**
   ```
   → Go to https://supabase.com
   → New Project → Save your password!
   ```

2. **Get connection strings**
   ```
   → Settings → Database
   → Copy both URLs (replace [YOUR-PASSWORD])
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase URLs
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start developing**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

## For Production Deployment

### Vercel Setup (2 minutes)

1. **Add environment variables**
   ```
   → Vercel Dashboard → Your Project → Settings
   → Environment Variables → Add:
     - DATABASE_URL (connection pooler)
     - DIRECT_URL (direct connection)
   → Apply to: Production, Preview, Development
   ```

2. **Deploy**
   ```bash
   git push
   # Vercel auto-deploys
   ```

3. **Seed production database**
   ```bash
   # Option 1: Via Vercel CLI
   vercel env pull .env.production
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx tsx prisma/seed.ts
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx tsx prisma/seedQuiz.ts

   # Option 2: Run SQL in Supabase dashboard
   ```

## Connection String Format

### DATABASE_URL (Connection Pooler - Port 6543)
```
postgresql://postgres.xxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### DIRECT_URL (Direct Connection - Port 5432)
```
postgresql://postgres.xxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## Common Commands

```bash
# Development
npm run dev                # Start dev server
npm run db:seed           # Seed database
npm run db:push           # Push schema changes

# Production
npm run build             # Build for production
npm start                 # Start production server

# Database
npx prisma studio         # Open Prisma Studio GUI
npx prisma db push        # Sync schema to database
npx prisma generate       # Generate Prisma Client
```

## Verification Tests

### Local
```bash
# Test homepage
curl http://localhost:3000

# Test API
curl http://localhost:3000/api/paddles | jq '.count'
# Expected: 20

curl http://localhost:3000/api/quiz/questions | jq '.data | length'
# Expected: 8
```

### Production
```bash
# Test homepage
curl https://letspickapaddle.vercel.app

# Test API
curl https://letspickapaddle.vercel.app/api/paddles | jq '.count'
# Expected: 20

curl https://letspickapaddle.vercel.app/api/quiz/questions | jq '.data | length'
# Expected: 8
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Relation does not exist" | Run `npx prisma db push` |
| Connection timeout | Check connection strings, ensure correct ports |
| Build fails on Vercel | Verify environment variables are set |
| No data after deployment | Run seed scripts (see production setup) |

## Need More Help?

- Detailed setup: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Migration guide: [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)
- Full documentation: [README.md](./README.md)
