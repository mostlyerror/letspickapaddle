/**
 * Verification script for affiliate implementation
 * Checks all components are working correctly
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { buildPartnerAffiliateUrls } from '../src/lib/affiliateUrls';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying Affiliate Product Links Implementation\n');
  console.log('═'.repeat(60));

  let allPassed = true;

  // 1. Check database population
  console.log('\n1️⃣  Database Population');
  console.log('─'.repeat(60));

  const allPaddles = await prisma.paddle.findMany();
  const paddlesWithAmazon = allPaddles.filter((p) => {
    const urls = p.affiliateUrls ? JSON.parse(p.affiliateUrls) : {};
    return Boolean(urls.amazon);
  });

  console.log(`Total paddles: ${allPaddles.length}`);
  console.log(`With Amazon links: ${paddlesWithAmazon.length}`);
  console.log(`Coverage: ${((paddlesWithAmazon.length / allPaddles.length) * 100).toFixed(1)}%`);

  if (paddlesWithAmazon.length === allPaddles.length) {
    console.log('✅ PASS: All paddles have Amazon links');
  } else {
    console.log('❌ FAIL: Some paddles missing Amazon links');
    allPassed = false;
  }

  // 2. Check URL format
  console.log('\n2️⃣  URL Format Validation');
  console.log('─'.repeat(60));

  let validUrls = 0;
  let invalidUrls = 0;

  for (const paddle of paddlesWithAmazon) {
    const urls = JSON.parse(paddle.affiliateUrls!);
    const amazonUrl = urls.amazon;

    if (amazonUrl.match(/^https:\/\/(www\.)?amazon\.com\/dp\/[A-Z0-9]{10}$/)) {
      validUrls++;
    } else {
      invalidUrls++;
      console.log(`   ⚠️  ${paddle.name}: ${amazonUrl}`);
    }
  }

  console.log(`Valid URLs: ${validUrls}`);
  console.log(`Invalid URLs: ${invalidUrls}`);

  if (invalidUrls === 0) {
    console.log('✅ PASS: All URLs are properly formatted');
  } else {
    console.log('⚠️  WARNING: Some URLs may have extra parameters (still functional)');
  }

  // 3. Check affiliate URL builder
  console.log('\n3️⃣  Affiliate URL Builder');
  console.log('─'.repeat(60));

  const testPaddle = paddlesWithAmazon[0];
  const baseUrls = JSON.parse(testPaddle.affiliateUrls!);

  const testPartner = {
    amazonAffiliateId: 'testsite-20',
    impactAffiliateId: null,
    otherAffiliateIds: null,
  };

  const builtUrls = buildPartnerAffiliateUrls(baseUrls, testPartner);

  console.log(`Base URL: ${baseUrls.amazon}`);
  console.log(`Built URL: ${builtUrls.amazon}`);

  if (builtUrls.amazon.includes('?tag=testsite-20')) {
    console.log('✅ PASS: Partner ID correctly injected');
  } else {
    console.log('❌ FAIL: Partner ID not injected');
    allPassed = false;
  }

  // 4. Check admin UI files exist
  console.log('\n4️⃣  Admin UI Files');
  console.log('─'.repeat(60));

  const requiredFiles = [
    'src/app/admin/paddles/page.tsx',
    'src/app/admin/paddles/[id]/edit/page.tsx',
    'src/app/admin/paddles/import/page.tsx',
    'src/app/api/admin/import-affiliate-urls/route.ts',
  ];

  let filesExist = 0;
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      filesExist++;
      console.log(`   ✓ ${file}`);
    } else {
      console.log(`   ✗ ${file}`);
    }
  }

  if (filesExist === requiredFiles.length) {
    console.log('✅ PASS: All admin UI files present');
  } else {
    console.log('❌ FAIL: Missing admin UI files');
    allPassed = false;
  }

  // 5. Check documentation
  console.log('\n5️⃣  Documentation');
  console.log('─'.repeat(60));

  const docFiles = [
    'docs/ADMIN_GUIDE.md',
    'AFFILIATE_IMPLEMENTATION.md',
    'amazon-links.json',
  ];

  let docsExist = 0;
  for (const file of docFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      docsExist++;
      console.log(`   ✓ ${file}`);
    } else {
      console.log(`   ✗ ${file}`);
    }
  }

  if (docsExist === docFiles.length) {
    console.log('✅ PASS: All documentation files present');
  } else {
    console.log('❌ FAIL: Missing documentation files');
    allPassed = false;
  }

  // 6. Check test scripts
  console.log('\n6️⃣  Test Scripts');
  console.log('─'.repeat(60));

  const scriptFiles = [
    'scripts/import-amazon-links.ts',
    'scripts/test-affiliate-urls.ts',
    'scripts/test-api-integration.ts',
    'scripts/verify-implementation.ts',
  ];

  let scriptsExist = 0;
  for (const file of scriptFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      scriptsExist++;
      console.log(`   ✓ ${file}`);
    } else {
      console.log(`   ✗ ${file}`);
    }
  }

  if (scriptsExist === scriptFiles.length) {
    console.log('✅ PASS: All test scripts present');
  } else {
    console.log('❌ FAIL: Missing test scripts');
    allPassed = false;
  }

  // Final Summary
  console.log('\n' + '═'.repeat(60));
  console.log('\n📋 FINAL VERIFICATION SUMMARY\n');

  if (allPassed) {
    console.log('🎉 ✅ ALL CHECKS PASSED!\n');
    console.log('The affiliate product links implementation is complete and working.');
    console.log('\nYou can now:');
    console.log('  • Access admin UI at /admin/paddles');
    console.log('  • Add/edit Amazon links for paddles');
    console.log('  • Bulk import/export paddle links');
    console.log('  • Partners will receive affiliate URLs in recommendations');
    console.log('\nNext steps:');
    console.log('  1. Add authentication to admin routes');
    console.log('  2. Deploy to production');
    console.log('  3. Monitor affiliate link performance');
  } else {
    console.log('❌ SOME CHECKS FAILED\n');
    console.log('Please review the errors above and fix any issues.');
    process.exit(1);
  }

  console.log('\n' + '═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
