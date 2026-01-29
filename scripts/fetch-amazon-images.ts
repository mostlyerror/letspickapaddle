#!/usr/bin/env tsx
/**
 * Fetch Paddle Images from Amazon
 *
 * This script extracts image URLs from Amazon product pages and updates the database.
 * Images are fetched directly from Amazon (no download needed).
 *
 * Usage:
 *   npx tsx scripts/fetch-amazon-images.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PaddleWithUrls {
  id: string;
  name: string;
  imageUrl: string | null;
  affiliateUrls: string | null;
}

async function extractAmazonImageUrl(amazonUrl: string): Promise<string | null> {
  try {
    // Fetch the Amazon page
    const response = await fetch(amazonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`  Failed to fetch: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Try multiple patterns to find the main product image
    const patterns = [
      // Main image in image block
      /"hiRes":"([^"]+)"/,
      /"large":"([^"]+)"/,
      // Landingimage
      /"landingImageUrl":"([^"]+)"/,
      // Regular image tag
      /<img[^>]+id="landingImage"[^>]+src="([^"]+)"/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        // Clean up the URL (remove escaping)
        let imageUrl = match[1].replace(/\\u002F/g, '/').replace(/\\/g, '');

        // Ensure it's a full URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = 'https:' + imageUrl;
        }

        return imageUrl;
      }
    }

    console.error('  No image found in page');
    return null;
  } catch (error) {
    console.error(`  Error fetching Amazon page: ${error}`);
    return null;
  }
}

async function fetchImages() {
  console.log('🖼️  Fetching paddle images from Amazon...\n');

  const forceUpdate = process.argv.includes('--force');
  if (forceUpdate) {
    console.log('⚠️  Force mode enabled - will update all images\n');
  }

  // Get all paddles with Amazon URLs
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

  console.log(`Found ${paddles.length} paddles with Amazon URLs\n`);

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const paddle of paddles as PaddleWithUrls[]) {
    try {
      // Skip if already has Amazon image URL (not placeholder)
      if (paddle.imageUrl && paddle.imageUrl.startsWith('https://') && !forceUpdate) {
        console.log(`⏭️  Skipped: ${paddle.name} (already has Amazon image)`);
        skipped++;
        continue;
      }

      console.log(`🔍 Fetching: ${paddle.name}`);

      // Extract Amazon URL
      const urls = paddle.affiliateUrls ? JSON.parse(paddle.affiliateUrls) : {};
      const amazonUrl = urls.amazon;

      if (!amazonUrl) {
        console.log(`  ⚠️  No Amazon URL found`);
        failed++;
        continue;
      }

      // Fetch image URL from Amazon page
      const imageUrl = await extractAmazonImageUrl(amazonUrl);

      if (imageUrl) {
        // Update database
        await prisma.paddle.update({
          where: { id: paddle.id },
          data: { imageUrl },
        });

        console.log(`  ✅ Updated with image: ${imageUrl.substring(0, 60)}...`);
        updated++;
      } else {
        console.log(`  ❌ Failed to extract image`);
        failed++;
      }

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ❌ Error: ${error}`);
      failed++;
    }
  }

  console.log('\n✅ Image fetch completed!');
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${paddles.length}`);

  await prisma.$disconnect();
}

fetchImages();
