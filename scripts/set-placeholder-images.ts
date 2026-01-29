#!/usr/bin/env tsx
/**
 * Set Placeholder Images
 *
 * Uses placeholder.com to generate paddle images with the paddle name.
 * These will work immediately and look professional.
 *
 * Later you can replace with real images using the Amazon Product API
 * or by manually uploading images.
 *
 * Usage:
 *   npx tsx scripts/set-placeholder-images.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generatePlaceholderUrl(name: string): string {
  // Use placeholder.com with paddle name
  // 400x400 size, gray background, white text
  const text = encodeURIComponent(name);
  return `https://via.placeholder.com/400x400/0ea5e9/ffffff?text=${text}`;
}

async function setPlaceholderImages() {
  console.log('🖼️  Setting placeholder images...\n');

  const paddles = await prisma.paddle.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });

  console.log(`Found ${paddles.length} paddles\n`);

  let updated = 0;

  for (const paddle of paddles) {
    const imageUrl = generatePlaceholderUrl(paddle.name);

    await prisma.paddle.update({
      where: { id: paddle.id },
      data: { imageUrl },
    });

    console.log(`✅ ${paddle.name}`);
    console.log(`   ${imageUrl.substring(0, 80)}...`);
    updated++;
  }

  console.log('\n✅ Placeholder images set!');
  console.log(`  Updated: ${updated}`);
  console.log('\nNote: These are temporary placeholders.');
  console.log('Replace with real images later using:');
  console.log('  - Amazon Product Advertising API');
  console.log('  - Manual image upload');
  console.log('  - Web scraping (with permission)');

  await prisma.$disconnect();
}

setPlaceholderImages();
