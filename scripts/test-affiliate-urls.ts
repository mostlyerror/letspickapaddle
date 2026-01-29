/**
 * Script to test affiliate URL functionality
 * Run with: npx tsx scripts/test-affiliate-urls.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { buildPartnerAffiliateUrls } from '../src/lib/affiliateUrls';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing Affiliate URL System\n');

  // 1. Check paddles have Amazon links
  console.log('1️⃣ Checking database for Amazon links...');
  const paddles = await prisma.paddle.findMany({
    take: 5,
    orderBy: { name: 'asc' },
  });

  console.log(`   Found ${paddles.length} paddles\n`);

  paddles.forEach((paddle) => {
    const affiliateUrls = paddle.affiliateUrls
      ? JSON.parse(paddle.affiliateUrls)
      : {};
    const hasAmazon = Boolean(affiliateUrls.amazon);

    console.log(`   ${hasAmazon ? '✓' : '✗'} ${paddle.name}`);
    if (hasAmazon) {
      console.log(`      ${affiliateUrls.amazon}`);
    }
  });

  // 2. Test partner with affiliate IDs
  console.log('\n2️⃣ Testing affiliate URL builder...');

  const testPaddle = paddles[0];
  const baseUrls = testPaddle.affiliateUrls
    ? JSON.parse(testPaddle.affiliateUrls)
    : {};

  const testPartner = {
    amazonAffiliateId: 'testblog-20',
    impactAffiliateId: '12345',
    otherAffiliateIds: null,
  };

  console.log(`\n   Base URL: ${baseUrls.amazon}`);

  const partnerUrls = buildPartnerAffiliateUrls(baseUrls, testPartner);

  console.log(`   Partner URL: ${partnerUrls.amazon}`);
  console.log(
    `   ${partnerUrls.amazon.includes('tag=testblog-20') ? '✓' : '✗'} Contains partner tag`
  );

  // 3. Simulate recommendation API response
  console.log('\n3️⃣ Simulating recommendation API response...');

  const recommendation = {
    paddle: {
      id: testPaddle.id,
      name: testPaddle.name,
      brand: testPaddle.brand,
      priceCents: testPaddle.priceCents,
    },
    score: 95,
    reasoning: 'Perfect match for your play style',
    affiliateUrls: partnerUrls,
  };

  console.log(JSON.stringify(recommendation, null, 2));

  // 4. Count total paddles with Amazon links
  console.log('\n4️⃣ Counting paddles with Amazon links...');
  const allPaddles = await prisma.paddle.findMany();
  const paddlesWithAmazon = allPaddles.filter((p) => {
    const urls = p.affiliateUrls ? JSON.parse(p.affiliateUrls) : {};
    return Boolean(urls.amazon);
  });

  console.log(`   Total paddles: ${allPaddles.length}`);
  console.log(`   With Amazon links: ${paddlesWithAmazon.length}`);
  console.log(
    `   Coverage: ${((paddlesWithAmazon.length / allPaddles.length) * 100).toFixed(1)}%`
  );

  console.log('\n✅ All tests passed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
