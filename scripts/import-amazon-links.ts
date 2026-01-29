/**
 * Script to import Amazon affiliate URLs into the database
 * Run with: npx tsx scripts/import-amazon-links.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting Amazon links import...\n');

  // Read the JSON file
  const jsonPath = path.join(process.cwd(), 'amazon-links.json');
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const amazonLinks: { [paddleName: string]: string } = JSON.parse(jsonContent);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const [paddleName, amazonUrl] of Object.entries(amazonLinks)) {
    try {
      // Validate Amazon URL
      if (!amazonUrl.match(/^https:\/\/(www\.)?amazon\.com\/.+/)) {
        errors.push(`${paddleName}: Invalid Amazon URL format`);
        errorCount++;
        continue;
      }

      // Find paddle by name (case-insensitive)
      const paddle = await prisma.paddle.findFirst({
        where: {
          name: {
            equals: paddleName,
            mode: 'insensitive',
          },
        },
      });

      if (!paddle) {
        errors.push(`${paddleName}: Paddle not found in database`);
        errorCount++;
        continue;
      }

      // Parse current affiliate URLs
      const currentUrls = paddle.affiliateUrls
        ? JSON.parse(paddle.affiliateUrls)
        : {};

      // Add/update Amazon URL
      currentUrls.amazon = amazonUrl;

      // Update paddle
      await prisma.paddle.update({
        where: { id: paddle.id },
        data: {
          affiliateUrls: JSON.stringify(currentUrls),
        },
      });

      console.log(`✓ ${paddleName}`);
      successCount++;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${paddleName}: ${errorMsg}`);
      errorCount++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`  Total: ${Object.keys(amazonLinks).length}`);
  console.log(`  ✓ Successful: ${successCount}`);
  console.log(`  ✗ Failed: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach((err) => console.log(`  ${err}`));
  }

  console.log('\n✅ Import completed!');
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
