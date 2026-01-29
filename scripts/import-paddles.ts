#!/usr/bin/env tsx
/**
 * Paddle Import Script
 *
 * This script imports paddle data from a JSON file into the database.
 *
 * Usage:
 *   npx tsx scripts/import-paddles.ts <json-file-path>
 *
 * Example:
 *   npx tsx scripts/import-paddles.ts data/new-paddles.json
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

interface PaddleData {
  name: string;
  brand: string;
  priceCents: number;
  weightOz?: number;
  gripCircumference?: number;
  coreMaterial?: string;
  faceMaterial?: string;
  shape?: string;
  balancePointMm?: number;
  powerRating?: number;
  controlRating?: number;
  spinRating?: number;
  sweetSpotSize?: string;
  swingWeight?: number;
  twistWeight?: number;
  handleLengthIn?: number;
  usapaApproved?: boolean;
  imageUrl?: string;
  amazonUrl?: string;
}

interface ImportFile {
  paddles?: PaddleData[];
  [key: string]: any;
}

function validatePaddle(paddle: PaddleData, index: number): string[] {
  const errors: string[] = [];

  if (!paddle.name || typeof paddle.name !== 'string') {
    errors.push(`Paddle ${index + 1}: Missing or invalid name`);
  }

  if (!paddle.brand || typeof paddle.brand !== 'string') {
    errors.push(`Paddle ${index + 1}: Missing or invalid brand`);
  }

  if (!paddle.priceCents || typeof paddle.priceCents !== 'number' || paddle.priceCents <= 0) {
    errors.push(`Paddle ${index + 1}: Missing or invalid priceCents (must be a positive number)`);
  }

  // Validate optional numeric fields
  if (paddle.weightOz !== undefined && (typeof paddle.weightOz !== 'number' || paddle.weightOz <= 0)) {
    errors.push(`Paddle ${index + 1}: Invalid weightOz`);
  }

  if (paddle.powerRating !== undefined && (paddle.powerRating < 1 || paddle.powerRating > 10)) {
    errors.push(`Paddle ${index + 1}: powerRating must be between 1 and 10`);
  }

  if (paddle.controlRating !== undefined && (paddle.controlRating < 1 || paddle.controlRating > 10)) {
    errors.push(`Paddle ${index + 1}: controlRating must be between 1 and 10`);
  }

  if (paddle.spinRating !== undefined && (paddle.spinRating < 1 || paddle.spinRating > 10)) {
    errors.push(`Paddle ${index + 1}: spinRating must be between 1 and 10`);
  }

  // Validate Amazon URL format
  if (paddle.amazonUrl && !paddle.amazonUrl.match(/^https?:\/\/(www\.)?amazon\.com\//)) {
    errors.push(`Paddle ${index + 1}: Invalid Amazon URL format`);
  }

  return errors;
}

function extractAsinFromUrl(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

async function importPaddles(filePath: string) {
  console.log('🔍 Reading file:', filePath);

  try {
    const fileContent = readFileSync(resolve(filePath), 'utf-8');
    const data: ImportFile = JSON.parse(fileContent);

    // Handle both array format and object with paddles key
    const paddles: PaddleData[] = Array.isArray(data) ? data : (data.paddles || []);

    if (paddles.length === 0) {
      console.error('❌ No paddles found in file');
      console.log('Expected format: Array of paddle objects or {paddles: [...]}');
      process.exit(1);
    }

    console.log(`📊 Found ${paddles.length} paddles to import\n`);

    // Validate all paddles first
    console.log('✅ Validating data...');
    const allErrors: string[] = [];
    paddles.forEach((paddle, index) => {
      const errors = validatePaddle(paddle, index);
      allErrors.push(...errors);
    });

    if (allErrors.length > 0) {
      console.error('❌ Validation errors:');
      allErrors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }

    console.log('✅ All data validated successfully\n');

    // Import paddles
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const paddleData of paddles) {
      try {
        // Convert Amazon URL to affiliate URL format if provided
        let affiliateUrls: string | null = null;
        if (paddleData.amazonUrl) {
          const asin = extractAsinFromUrl(paddleData.amazonUrl);
          if (asin) {
            affiliateUrls = JSON.stringify({
              amazon: paddleData.amazonUrl,
              asin: asin
            });
          }
        }

        // Check if paddle already exists
        const existing = await prisma.paddle.findFirst({
          where: { name: paddleData.name }
        });

        const paddleDbData = {
          name: paddleData.name,
          brand: paddleData.brand,
          priceCents: paddleData.priceCents,
          weightOz: paddleData.weightOz,
          gripCircumference: paddleData.gripCircumference,
          coreMaterial: paddleData.coreMaterial,
          faceMaterial: paddleData.faceMaterial,
          shape: paddleData.shape,
          balancePointMm: paddleData.balancePointMm,
          powerRating: paddleData.powerRating,
          controlRating: paddleData.controlRating,
          spinRating: paddleData.spinRating,
          sweetSpotSize: paddleData.sweetSpotSize,
          swingWeight: paddleData.swingWeight,
          twistWeight: paddleData.twistWeight,
          handleLengthIn: paddleData.handleLengthIn,
          usapaApproved: paddleData.usapaApproved ?? true,
          imageUrl: paddleData.imageUrl,
          affiliateUrls: affiliateUrls,
        };

        if (existing) {
          await prisma.paddle.update({
            where: { id: existing.id },
            data: paddleDbData
          });
          updated++;
          console.log(`  ✏️  Updated: ${paddleData.name}`);
        } else {
          await prisma.paddle.create({
            data: paddleDbData
          });
          created++;
          console.log(`  ➕ Created: ${paddleData.name}`);
        }
      } catch (error) {
        failed++;
        console.error(`  ❌ Failed: ${paddleData.name}`, error);
      }
    }

    console.log('\n✅ Import completed!');
    console.log(`  Created: ${created}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Total: ${paddles.length}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error:', error.message);
    } else {
      console.error('❌ Unknown error:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: No file path provided');
  console.log('\nUsage: npx tsx scripts/import-paddles.ts <json-file-path>');
  console.log('\nExample: npx tsx scripts/import-paddles.ts data/new-paddles.json');
  process.exit(1);
}

const filePath = args[0];
importPaddles(filePath);
