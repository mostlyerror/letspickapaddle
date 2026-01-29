#!/usr/bin/env tsx
/**
 * Set Amazon Image URLs
 *
 * Constructs Amazon image URLs directly from ASINs.
 * Amazon provides public image URLs in the format:
 * https://images-na.ssl-images-amazon.com/images/I/{IMAGE_ID}._SL500_.jpg
 *
 * Or we can use the product page screenshot approach:
 * https://m.media-amazon.com/images/P/{ASIN}.jpg
 *
 * Usage:
 *   npx tsx scripts/set-amazon-image-urls.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function extractAsinFromUrl(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

function constructAmazonImageUrl(asin: string): string {
  // Amazon's public image URL format
  return `https://m.media-amazon.com/images/I/${asin}._AC_SL1500_.jpg`;
}

async function setImageUrls() {
  console.log('🖼️  Setting Amazon image URLs...\n');

  const paddles = await prisma.paddle.findMany({
    where: {
      affiliateUrls: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      affiliateUrls: true,
    },
  });

  console.log(`Found ${paddles.length} paddles\n`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const paddle of paddles) {
    try {
      // Skip if already has an Amazon CDN image
      if (paddle.imageUrl && paddle.imageUrl.includes('amazon.com')) {
        console.log(`⏭️  Skipped: ${paddle.name} (already has Amazon image)`);
        skipped++;
        continue;
      }

      const urls = paddle.affiliateUrls ? JSON.parse(paddle.affiliateUrls) : {};
      const asin = urls.asin;

      if (!asin) {
        console.log(`❌ ${paddle.name}: No ASIN found`);
        failed++;
        continue;
      }

      // Construct Amazon image URL
      const imageUrl = constructAmazonImageUrl(asin);

      // Update database
      await prisma.paddle.update({
        where: { id: paddle.id },
        data: { imageUrl },
      });

      console.log(`✅ ${paddle.name}`);
      console.log(`   ASIN: ${asin}`);
      console.log(`   Image: ${imageUrl}`);
      updated++;

    } catch (error) {
      console.error(`❌ ${paddle.name}: ${error}`);
      failed++;
    }
  }

  console.log('\n✅ Image URL update completed!');
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${paddles.length}`);

  await prisma.$disconnect();
}

setImageUrls();
