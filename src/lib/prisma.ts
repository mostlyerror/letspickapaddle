import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Development database connection logging
if (process.env.NODE_ENV === 'development') {
  const dbUrl = process.env.DATABASE_URL || '';
  const dbName = dbUrl.match(/\/([^/?]+)(\?|$)/)?.[1] || 'unknown';
  console.log(`🔗 Connected to database: ${dbName}`);

  if (dbUrl.includes('prod')) {
    console.error('⚠️  WARNING: Connected to PRODUCTION database in dev mode!');
  }
}
