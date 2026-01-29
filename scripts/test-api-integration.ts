/**
 * Script to test the recommendation API with affiliate URLs
 * This simulates the actual API flow
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { calculatePaddleScore } from '../src/lib/recommendationEngine';
import { buildPartnerAffiliateUrls } from '../src/lib/affiliateUrls';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing Recommendation API Integration\n');

  // Create a test partner with affiliate IDs
  console.log('1️⃣ Setting up test partner...');
  let testPartner = await prisma.partner.findFirst({
    where: { email: 'test@example.com' },
  });

  if (!testPartner) {
    testPartner = await prisma.partner.create({
      data: {
        name: 'Test Partner',
        email: 'test@example.com',
        partnerType: 'blog',
        amazonAffiliateId: 'testblog-20',
        impactAffiliateId: '12345',
      },
    });
    console.log('   ✓ Created test partner');
  } else {
    // Update to ensure affiliate IDs are set
    testPartner = await prisma.partner.update({
      where: { id: testPartner.id },
      data: {
        amazonAffiliateId: 'testblog-20',
        impactAffiliateId: '12345',
      },
    });
    console.log('   ✓ Using existing test partner');
  }

  console.log(`   Partner ID: ${testPartner.id}`);
  console.log(`   Amazon Affiliate ID: ${testPartner.amazonAffiliateId}\n`);

  // Simulate quiz responses
  const responses = {
    play_style: 'control',
    skill_level: 'intermediate',
    current_paddle: 'upgrading',
    budget: 'mid_range',
    swing_speed: 'moderate',
    spin_preference: 'high',
    sweet_spot: 'large',
    weight: 'medium',
  };

  console.log('2️⃣ Running recommendation engine...');

  // Fetch quiz questions to get weight mappings
  const questions = await prisma.quizQuestion.findMany({
    where: { isActive: true },
  });

  const weightMappings: Record<string, any> = {};
  questions.forEach((q) => {
    weightMappings[q.questionKey] = JSON.parse(q.weightMappings);
  });

  // Fetch all paddles
  const paddles = await prisma.paddle.findMany();

  // Calculate scores
  const scoredPaddles = paddles.map((paddle) => {
    const { score, matchReasons } = calculatePaddleScore(
      paddle,
      responses,
      weightMappings
    );

    // Build affiliate URLs with partner's IDs
    let affiliateUrls = paddle.affiliateUrls ? JSON.parse(paddle.affiliateUrls) : {};

    if (Object.keys(affiliateUrls).length > 0) {
      affiliateUrls = buildPartnerAffiliateUrls(affiliateUrls, {
        amazonAffiliateId: testPartner.amazonAffiliateId,
        impactAffiliateId: testPartner.impactAffiliateId,
        otherAffiliateIds: testPartner.otherAffiliateIds,
      });
    }

    return {
      paddle: {
        id: paddle.id,
        name: paddle.name,
        brand: paddle.brand,
        priceCents: paddle.priceCents,
      },
      score,
      reasoning: matchReasons.join('. '),
      affiliateUrls,
    };
  });

  // Get top 5
  const recommendations = scoredPaddles.sort((a, b) => b.score - a.score).slice(0, 5);

  console.log(`   ✓ Calculated scores for ${paddles.length} paddles\n`);

  console.log('3️⃣ Top 5 Recommendations:\n');

  recommendations.forEach((rec, idx) => {
    console.log(`   ${idx + 1}. ${rec.paddle.name} (Score: ${rec.score})`);
    console.log(`      Brand: ${rec.paddle.brand}`);
    console.log(`      Price: $${(rec.paddle.priceCents / 100).toFixed(2)}`);

    if (rec.affiliateUrls.amazon) {
      const hasTag = rec.affiliateUrls.amazon.includes('tag=testblog-20');
      console.log(`      ${hasTag ? '✓' : '✗'} Amazon URL: ${rec.affiliateUrls.amazon}`);
    } else {
      console.log('      ✗ No Amazon URL');
    }

    console.log('');
  });

  // Verify all have affiliate tags
  const allHaveTags = recommendations.every(
    (rec) => rec.affiliateUrls.amazon && rec.affiliateUrls.amazon.includes('tag=testblog-20')
  );

  console.log('4️⃣ Verification:');
  console.log(
    `   ${allHaveTags ? '✓' : '✗'} All recommendations have partner affiliate tags`
  );

  if (allHaveTags) {
    console.log('\n✅ API Integration Test PASSED!');
    console.log('\nThe affiliate URL system is working correctly:');
    console.log('  • All paddles have Amazon product URLs');
    console.log('  • Partner affiliate IDs are being injected correctly');
    console.log('  • Recommendations include trackable affiliate links');
  } else {
    console.log('\n❌ API Integration Test FAILED!');
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
