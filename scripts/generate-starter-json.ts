#!/usr/bin/env tsx
/**
 * Generate Starter Paddle JSON
 *
 * This script converts the existing amazon-links.json into a full paddle
 * import template, using data from the current database seed.
 *
 * Usage:
 *   npx tsx scripts/generate-starter-json.ts
 *
 * Output:
 *   scripts/starter-paddles.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Read amazon-links.json
const amazonLinksPath = resolve(process.cwd(), 'amazon-links.json');
const amazonLinks = JSON.parse(readFileSync(amazonLinksPath, 'utf-8'));

// Seed data from prisma/seed.ts (subset for matching)
const seedData: Record<string, any> = {
  'Selkirk Vanguard Power Air Invikta': {
    brand: 'Selkirk',
    priceCents: 17995,
    weightOz: 8.0,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'elongated',
    balancePointMm: 260,
    powerRating: 9,
    controlRating: 7,
    spinRating: 8,
    sweetSpotSize: 'large',
    swingWeight: 115,
    twistWeight: 6.8,
    handleLengthIn: 5.5,
    usapaApproved: true,
  },
  'JOOLA Ben Johns Hyperion CFS 16': {
    brand: 'JOOLA',
    priceCents: 24995,
    weightOz: 8.3,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 255,
    powerRating: 8,
    controlRating: 9,
    spinRating: 9,
    sweetSpotSize: 'large',
    swingWeight: 118,
    twistWeight: 7.2,
    handleLengthIn: 5.5,
    usapaApproved: true,
  },
  'Engage Pursuit Pro MX 6.0': {
    brand: 'Engage',
    priceCents: 18995,
    weightOz: 7.9,
    gripCircumference: 4.125,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 252,
    powerRating: 7,
    controlRating: 9,
    spinRating: 8,
    sweetSpotSize: 'medium',
    swingWeight: 112,
    twistWeight: 6.5,
    handleLengthIn: 5.25,
    usapaApproved: true,
  },
  'Paddletek Tempest Wave Pro': {
    brand: 'Paddletek',
    priceCents: 13995,
    weightOz: 7.8,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'graphite',
    shape: 'wide-body',
    balancePointMm: 248,
    powerRating: 7,
    controlRating: 8,
    spinRating: 7,
    sweetSpotSize: 'large',
    swingWeight: 108,
    twistWeight: 6.2,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'ProKennex Ovation Speed': {
    brand: 'ProKennex',
    priceCents: 16995,
    weightOz: 7.5,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'elongated',
    balancePointMm: 265,
    powerRating: 9,
    controlRating: 6,
    spinRating: 7,
    sweetSpotSize: 'medium',
    swingWeight: 120,
    twistWeight: 6.9,
    handleLengthIn: 5.75,
    usapaApproved: true,
  },
  'Gamma NeuCore Compass': {
    brand: 'Gamma',
    priceCents: 9995,
    weightOz: 7.7,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'fiberglass',
    shape: 'standard',
    balancePointMm: 250,
    powerRating: 6,
    controlRating: 7,
    spinRating: 6,
    sweetSpotSize: 'medium',
    swingWeight: 105,
    twistWeight: 6.0,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'Diadem Warrior Edge 18K': {
    brand: 'Diadem',
    priceCents: 21995,
    weightOz: 8.2,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 257,
    powerRating: 8,
    controlRating: 8,
    spinRating: 9,
    sweetSpotSize: 'large',
    swingWeight: 116,
    twistWeight: 7.0,
    handleLengthIn: 5.5,
    usapaApproved: true,
  },
  'Onix Z5 Graphite': {
    brand: 'Onix',
    priceCents: 7995,
    weightOz: 7.5,
    gripCircumference: 4.25,
    coreMaterial: 'nomex',
    faceMaterial: 'graphite',
    shape: 'wide-body',
    balancePointMm: 245,
    powerRating: 7,
    controlRating: 6,
    spinRating: 5,
    sweetSpotSize: 'large',
    swingWeight: 102,
    twistWeight: 5.8,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'HEAD Radical Elite': {
    brand: 'HEAD',
    priceCents: 15995,
    weightOz: 8.1,
    gripCircumference: 4.125,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'elongated',
    balancePointMm: 262,
    powerRating: 8,
    controlRating: 7,
    spinRating: 8,
    sweetSpotSize: 'medium',
    swingWeight: 117,
    twistWeight: 6.7,
    handleLengthIn: 5.5,
    usapaApproved: true,
  },
  'Franklin Ben Johns Signature': {
    brand: 'Franklin',
    priceCents: 19995,
    weightOz: 8.0,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 254,
    powerRating: 7,
    controlRating: 9,
    spinRating: 8,
    sweetSpotSize: 'large',
    swingWeight: 113,
    twistWeight: 6.6,
    handleLengthIn: 5.25,
    usapaApproved: true,
  },
  'Wilson Energy Pro': {
    brand: 'Wilson',
    priceCents: 8995,
    weightOz: 7.6,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'fiberglass',
    shape: 'standard',
    balancePointMm: 248,
    powerRating: 6,
    controlRating: 6,
    spinRating: 5,
    sweetSpotSize: 'medium',
    swingWeight: 100,
    twistWeight: 5.5,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'Electrum Pro II': {
    brand: 'Electrum',
    priceCents: 20995,
    weightOz: 8.3,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'elongated',
    balancePointMm: 268,
    powerRating: 9,
    controlRating: 7,
    spinRating: 8,
    sweetSpotSize: 'medium',
    swingWeight: 122,
    twistWeight: 7.1,
    handleLengthIn: 5.75,
    usapaApproved: true,
  },
  'Vulcan V730 Pro': {
    brand: 'Vulcan',
    priceCents: 12995,
    weightOz: 7.9,
    gripCircumference: 4.125,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 251,
    powerRating: 7,
    controlRating: 8,
    spinRating: 7,
    sweetSpotSize: 'large',
    swingWeight: 110,
    twistWeight: 6.4,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'Six Zero Double Black Diamond': {
    brand: 'Six Zero',
    priceCents: 22995,
    weightOz: 8.4,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'elongated',
    balancePointMm: 270,
    powerRating: 10,
    controlRating: 6,
    spinRating: 7,
    sweetSpotSize: 'small',
    swingWeight: 125,
    twistWeight: 7.3,
    handleLengthIn: 5.75,
    usapaApproved: true,
  },
  'Crbn 1X Power Series': {
    brand: 'CRBN',
    priceCents: 23995,
    weightOz: 8.1,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 256,
    powerRating: 8,
    controlRating: 8,
    spinRating: 9,
    sweetSpotSize: 'large',
    swingWeight: 114,
    twistWeight: 6.8,
    handleLengthIn: 5.25,
    usapaApproved: true,
  },
  'Bread & Butter Filth': {
    brand: 'Bread & Butter',
    priceCents: 17995,
    weightOz: 8.0,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 253,
    powerRating: 7,
    controlRating: 8,
    spinRating: 8,
    sweetSpotSize: 'medium',
    swingWeight: 111,
    twistWeight: 6.5,
    handleLengthIn: 5.25,
    usapaApproved: true,
  },
  'ProLite Titan Pro': {
    brand: 'ProLite',
    priceCents: 11995,
    weightOz: 7.8,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'graphite',
    shape: 'wide-body',
    balancePointMm: 247,
    powerRating: 6,
    controlRating: 8,
    spinRating: 6,
    sweetSpotSize: 'large',
    swingWeight: 106,
    twistWeight: 6.1,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'Niupipo Explorer Pro': {
    brand: 'Niupipo',
    priceCents: 6995,
    weightOz: 7.6,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'fiberglass',
    shape: 'standard',
    balancePointMm: 249,
    powerRating: 6,
    controlRating: 6,
    spinRating: 5,
    sweetSpotSize: 'medium',
    swingWeight: 98,
    twistWeight: 5.4,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'Vatic Pro Flash': {
    brand: 'Vatic',
    priceCents: 8995,
    weightOz: 7.7,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'standard',
    balancePointMm: 250,
    powerRating: 7,
    controlRating: 7,
    spinRating: 7,
    sweetSpotSize: 'medium',
    swingWeight: 107,
    twistWeight: 6.3,
    handleLengthIn: 5.0,
    usapaApproved: true,
  },
  'Gearbox CX14E Ultimate Power': {
    brand: 'Gearbox',
    priceCents: 19995,
    weightOz: 8.5,
    gripCircumference: 4.25,
    coreMaterial: 'polymer',
    faceMaterial: 'carbon fiber',
    shape: 'elongated',
    balancePointMm: 272,
    powerRating: 10,
    controlRating: 6,
    spinRating: 7,
    sweetSpotSize: 'small',
    swingWeight: 127,
    twistWeight: 7.5,
    handleLengthIn: 5.75,
    usapaApproved: true,
  },
};

// Generate paddles array
const paddles = Object.entries(amazonLinks).map(([name, amazonUrl]) => {
  const seedPaddle = seedData[name];

  if (seedPaddle) {
    // Use seed data if available
    return {
      name,
      ...seedPaddle,
      amazonUrl,
    };
  } else {
    // Create template for paddles not in seed
    return {
      name,
      brand: 'UNKNOWN', // TODO: Fill in brand
      priceCents: 0, // TODO: Fill in price (in cents)
      weightOz: 8.0, // TODO: Update if known
      gripCircumference: 4.25, // TODO: Update if known
      coreMaterial: 'polymer', // TODO: Update if known
      faceMaterial: 'carbon fiber', // TODO: Update if known
      shape: 'standard', // TODO: Update if known
      powerRating: 7, // TODO: Update from reviews
      controlRating: 7, // TODO: Update from reviews
      spinRating: 7, // TODO: Update from reviews
      usapaApproved: true,
      amazonUrl,
    };
  }
});

// Write to file
const outputPath = resolve(process.cwd(), 'scripts/starter-paddles.json');
const output = {
  _note:
    'This file was auto-generated from amazon-links.json and seed data. Review and update missing/TODO fields before importing.',
  paddles,
};

writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('✅ Generated starter paddles file!');
console.log(`   Output: ${outputPath}`);
console.log(`   Total paddles: ${paddles.length}`);
console.log(
  `   With complete data: ${paddles.filter((p) => p.brand !== 'UNKNOWN').length}`
);
console.log(
  `   Need data: ${paddles.filter((p) => p.brand === 'UNKNOWN').length}`
);
console.log('\nNext steps:');
console.log('1. Review scripts/starter-paddles.json');
console.log('2. Fill in any TODO fields');
console.log('3. Validate: npx tsx scripts/validate-paddle-data.ts scripts/starter-paddles.json');
console.log('4. Import: npx tsx scripts/import-paddles.ts scripts/starter-paddles.json');
