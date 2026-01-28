import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Safety check - don't seed if connected to production
const DATABASE_URL = process.env.DATABASE_URL || '';

if (DATABASE_URL.includes('-prod') ||
    DATABASE_URL.includes('production') ||
    process.env.VERCEL_ENV === 'production') {
  console.error('❌ SAFETY CHECK: Cannot run seed in production!');
  console.error('This script should only run in development.');
  process.exit(1);
}

console.log('✅ Running in development environment');

async function main() {
  console.log('🌱 Seeding partners...');

  // Clear existing partners
  await prisma.partner.deleteMany({});
  console.log('Cleared existing partners');

  // Create test partner for development (Free tier)
  const testPartner = await prisma.partner.create({
    data: {
      name: 'Test Blog',
      email: 'test@example.com',
      website: 'https://testblog.com',
      partnerType: 'blog',
      subscriptionTier: 'free',
      billingStatus: 'trial',
      primaryColor: '#2563eb',
      secondaryColor: '#ffffff',
      isActive: true,
    },
  });

  console.log(`✅ Created test partner: ${testPartner.name}`);
  console.log(`   Partner ID: ${testPartner.id}`);
  console.log(`   API Key: ${testPartner.apiKey}`);
  console.log(`   Subscription: ${testPartner.subscriptionTier} (${testPartner.billingStatus})`);

  // Create pro partner example (Pro tier with full features)
  const proPartner = await prisma.partner.create({
    data: {
      name: 'Pro Pickleball Blog',
      email: 'pro@example.com',
      website: 'https://propickleball.com',
      partnerType: 'blog',
      subscriptionTier: 'pro',
      billingStatus: 'active',
      subscriptionStartDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      primaryColor: '#10b981',
      secondaryColor: '#ffffff',
      logoUrl: '/images/partners/pro-pickleball-logo.png',
      isActive: true,
    },
  });

  console.log(`✅ Created pro partner: ${proPartner.name}`);
  console.log(`   Partner ID: ${proPartner.id}`);
  console.log(`   API Key: ${proPartner.apiKey}`);
  console.log(`   Subscription: ${proPartner.subscriptionTier} (${proPartner.billingStatus})`);

  console.log(`\n📊 Seed completed! Created 2 test partners.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
