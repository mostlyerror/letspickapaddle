#!/usr/bin/env tsx
/**
 * Paddle Data Validation Script
 *
 * Validates paddle JSON data without importing to database.
 * Useful for checking data before import.
 *
 * Usage:
 *   npx tsx scripts/validate-paddle-data.ts <json-file-path>
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

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

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    total: number;
    withRatings: number;
    withAmazonUrl: number;
    withAdvancedSpecs: number;
  };
}

const VALID_CORE_MATERIALS = ['polymer', 'nomex', 'aluminum'];
const VALID_FACE_MATERIALS = ['carbon fiber', 'graphite', 'fiberglass'];
const VALID_SHAPES = ['standard', 'elongated', 'wide-body'];
const VALID_SWEET_SPOT_SIZES = ['small', 'medium', 'large'];

function validatePaddle(paddle: PaddleData, index: number): { errors: string[], warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prefix = `Paddle ${index + 1} (${paddle.name || 'unnamed'})`;

  // Required fields
  if (!paddle.name || typeof paddle.name !== 'string' || paddle.name.trim() === '') {
    errors.push(`${prefix}: Missing or invalid name`);
  }

  if (!paddle.brand || typeof paddle.brand !== 'string' || paddle.brand.trim() === '') {
    errors.push(`${prefix}: Missing or invalid brand`);
  }

  if (!paddle.priceCents || typeof paddle.priceCents !== 'number' || paddle.priceCents <= 0) {
    errors.push(`${prefix}: Missing or invalid priceCents (must be a positive number)`);
  } else if (paddle.priceCents < 1000 || paddle.priceCents > 50000) {
    warnings.push(`${prefix}: Unusual price: $${(paddle.priceCents / 100).toFixed(2)}`);
  }

  // Optional but recommended fields
  if (!paddle.weightOz) {
    warnings.push(`${prefix}: Missing weightOz`);
  } else if (paddle.weightOz < 6 || paddle.weightOz > 10) {
    warnings.push(`${prefix}: Unusual weight: ${paddle.weightOz}oz (typical range: 7-8.5oz)`);
  }

  if (!paddle.amazonUrl) {
    warnings.push(`${prefix}: Missing Amazon URL`);
  } else if (!paddle.amazonUrl.match(/^https?:\/\/(www\.)?amazon\.com\//)) {
    errors.push(`${prefix}: Invalid Amazon URL format`);
  } else if (!paddle.amazonUrl.match(/\/dp\/[A-Z0-9]{10}/)) {
    warnings.push(`${prefix}: Amazon URL missing ASIN in standard format (/dp/ASIN)`);
  }

  // Validate ratings
  if (paddle.powerRating !== undefined) {
    if (paddle.powerRating < 1 || paddle.powerRating > 10) {
      errors.push(`${prefix}: powerRating must be between 1 and 10`);
    }
  } else {
    warnings.push(`${prefix}: Missing powerRating`);
  }

  if (paddle.controlRating !== undefined) {
    if (paddle.controlRating < 1 || paddle.controlRating > 10) {
      errors.push(`${prefix}: controlRating must be between 1 and 10`);
    }
  } else {
    warnings.push(`${prefix}: Missing controlRating`);
  }

  if (paddle.spinRating !== undefined) {
    if (paddle.spinRating < 1 || paddle.spinRating > 10) {
      errors.push(`${prefix}: spinRating must be between 1 and 10`);
    }
  } else {
    warnings.push(`${prefix}: Missing spinRating`);
  }

  // Validate materials
  if (paddle.coreMaterial && !VALID_CORE_MATERIALS.includes(paddle.coreMaterial)) {
    warnings.push(`${prefix}: Unusual coreMaterial: "${paddle.coreMaterial}" (expected: ${VALID_CORE_MATERIALS.join(', ')})`);
  }

  if (paddle.faceMaterial && !VALID_FACE_MATERIALS.includes(paddle.faceMaterial)) {
    warnings.push(`${prefix}: Unusual faceMaterial: "${paddle.faceMaterial}" (expected: ${VALID_FACE_MATERIALS.join(', ')})`);
  }

  // Validate shape
  if (paddle.shape && !VALID_SHAPES.includes(paddle.shape)) {
    warnings.push(`${prefix}: Unusual shape: "${paddle.shape}" (expected: ${VALID_SHAPES.join(', ')})`);
  }

  // Validate sweet spot size
  if (paddle.sweetSpotSize && !VALID_SWEET_SPOT_SIZES.includes(paddle.sweetSpotSize)) {
    warnings.push(`${prefix}: Invalid sweetSpotSize: "${paddle.sweetSpotSize}" (expected: ${VALID_SWEET_SPOT_SIZES.join(', ')})`);
  }

  // Validate numeric ranges
  if (paddle.gripCircumference !== undefined && (paddle.gripCircumference < 3.5 || paddle.gripCircumference > 5)) {
    warnings.push(`${prefix}: Unusual gripCircumference: ${paddle.gripCircumference}" (typical: 4-4.5")`);
  }

  if (paddle.balancePointMm !== undefined && (paddle.balancePointMm < 200 || paddle.balancePointMm > 300)) {
    warnings.push(`${prefix}: Unusual balancePointMm: ${paddle.balancePointMm}mm (typical: 240-270mm)`);
  }

  if (paddle.swingWeight !== undefined && (paddle.swingWeight < 80 || paddle.swingWeight > 150)) {
    warnings.push(`${prefix}: Unusual swingWeight: ${paddle.swingWeight} (typical: 100-125)`);
  }

  if (paddle.twistWeight !== undefined && (paddle.twistWeight < 4 || paddle.twistWeight > 10)) {
    warnings.push(`${prefix}: Unusual twistWeight: ${paddle.twistWeight} (typical: 5.5-7.5)`);
  }

  if (paddle.handleLengthIn !== undefined && (paddle.handleLengthIn < 4 || paddle.handleLengthIn > 7)) {
    warnings.push(`${prefix}: Unusual handleLengthIn: ${paddle.handleLengthIn}" (typical: 5-5.75")`);
  }

  return { errors, warnings };
}

function validateFile(filePath: string): ValidationResult {
  console.log('🔍 Validating file:', filePath, '\n');

  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    stats: {
      total: 0,
      withRatings: 0,
      withAmazonUrl: 0,
      withAdvancedSpecs: 0,
    }
  };

  try {
    const fileContent = readFileSync(resolve(filePath), 'utf-8');
    const data = JSON.parse(fileContent);

    // Handle both array format and object with paddles key
    const paddles: PaddleData[] = Array.isArray(data) ? data : (data.paddles || []);

    if (paddles.length === 0) {
      result.errors.push('No paddles found in file');
      result.errors.push('Expected format: Array of paddle objects or {paddles: [...]}');
      result.valid = false;
      return result;
    }

    result.stats.total = paddles.length;

    paddles.forEach((paddle, index) => {
      const { errors, warnings } = validatePaddle(paddle, index);
      result.errors.push(...errors);
      result.warnings.push(...warnings);

      // Update stats
      if (paddle.powerRating && paddle.controlRating && paddle.spinRating) {
        result.stats.withRatings++;
      }
      if (paddle.amazonUrl) {
        result.stats.withAmazonUrl++;
      }
      if (paddle.balancePointMm || paddle.swingWeight || paddle.twistWeight) {
        result.stats.withAdvancedSpecs++;
      }
    });

    result.valid = result.errors.length === 0;

  } catch (error) {
    result.valid = false;
    if (error instanceof SyntaxError) {
      result.errors.push(`Invalid JSON: ${error.message}`);
    } else if (error instanceof Error) {
      result.errors.push(error.message);
    } else {
      result.errors.push('Unknown error occurred');
    }
  }

  return result;
}

function printResults(result: ValidationResult) {
  console.log('📊 Statistics:');
  console.log(`  Total paddles: ${result.stats.total}`);
  console.log(`  With ratings: ${result.stats.withRatings} (${Math.round(result.stats.withRatings / result.stats.total * 100)}%)`);
  console.log(`  With Amazon URL: ${result.stats.withAmazonUrl} (${Math.round(result.stats.withAmazonUrl / result.stats.total * 100)}%)`);
  console.log(`  With advanced specs: ${result.stats.withAdvancedSpecs} (${Math.round(result.stats.withAdvancedSpecs / result.stats.total * 100)}%)`);
  console.log();

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
    console.log();
  }

  if (result.valid) {
    console.log('✅ Validation passed! Data is ready to import.');
    console.log('\nTo import this data, run:');
    console.log(`  npx tsx scripts/import-paddles.ts ${process.argv[2]}`);
  } else {
    console.log('❌ Validation failed. Please fix the errors above before importing.');
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: No file path provided');
  console.log('\nUsage: npx tsx scripts/validate-paddle-data.ts <json-file-path>');
  console.log('\nExample: npx tsx scripts/validate-paddle-data.ts data/new-paddles.json');
  process.exit(1);
}

const filePath = args[0];
const result = validateFile(filePath);
printResults(result);
