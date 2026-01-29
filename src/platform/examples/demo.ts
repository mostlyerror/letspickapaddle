/**
 * Demo: Generic Recommendation Engine
 *
 * This demonstrates the recommendation engine working with different product verticals
 */

import { RecommendationEngine } from '../core/engine/recommendation-engine';
import { kayakQuiz, exampleKayaks } from './kayak-quiz-config';
import { laptopQuiz, exampleLaptops } from './laptop-quiz-config';

console.log('='.repeat(80));
console.log('GENERIC RECOMMENDATION ENGINE DEMO');
console.log('='.repeat(80));
console.log();

// ============================================================================
// DEMO 1: Kayak Recommendations
// ============================================================================

console.log('📍 DEMO 1: Kayak Finder Quiz');
console.log('-'.repeat(80));

const kayakEngine = new RecommendationEngine(kayakQuiz.scoringConfig);

// Simulate a user who wants a fishing kayak
const kayakResponses = {
  waterType: 'calm_lakes',
  experience: 'intermediate',
  useCase: 'fishing',
  storage: 'car_roof',
  seating: 'single',
  budget: 'mid',
};

console.log('\nUser Responses:');
console.log(JSON.stringify(kayakResponses, null, 2));

const kayakRecommendations = kayakEngine.recommend(exampleKayaks, kayakResponses, {
  limit: 3,
});

console.log(`\n🎯 Top ${kayakRecommendations.length} Kayak Recommendations:\n`);

kayakRecommendations.forEach((kayak, index) => {
  console.log(`${index + 1}. ${kayak.name} by ${kayak.brand}`);
  console.log(`   Score: ${kayak.score}/100 (${Math.round((kayak.score / 100) * 100)}% match)`);
  console.log(`   Price: $${(kayak.priceCents / 100).toFixed(2)}`);
  console.log(`   Type: ${kayak.attributes.type}`);
  console.log(`   Match Reasons:`);
  kayak.matchReasons.forEach((reason) => {
    console.log(`   ✓ ${reason}`);
  });
  console.log();
});

// Show detailed scoring breakdown
console.log('📊 Detailed Scoring Breakdown:');
const kayakExplanation = kayakEngine.explainScore(exampleKayaks[1], kayakResponses);
console.log(`Product: ${exampleKayaks[1].name}`);
console.log(`Total Score: ${kayakExplanation.totalScore}/${kayakExplanation.maxScore} (${kayakExplanation.percentage}%)`);
console.log('\nRule-by-Rule Breakdown:');
kayakExplanation.breakdown.forEach((item) => {
  if (item.matched) {
    console.log(
      `  ✓ ${item.rule.id}: +${item.points} points (${item.responseValue} → ${item.productValue})`
    );
  }
});
console.log();

// ============================================================================
// DEMO 2: Laptop Recommendations
// ============================================================================

console.log('='.repeat(80));
console.log('📍 DEMO 2: Laptop Finder Quiz');
console.log('-'.repeat(80));

const laptopEngine = new RecommendationEngine(laptopQuiz.scoringConfig);

// Simulate a user who wants a laptop for creative work
const laptopResponses = {
  useCase: 'creative',
  portability: 'somewhat',
  batteryNeeds: 'half_day',
  screenSize: 'balanced',
  performance: 'high',
  budget: 'premium',
};

console.log('\nUser Responses:');
console.log(JSON.stringify(laptopResponses, null, 2));

const laptopRecommendations = laptopEngine.recommend(exampleLaptops, laptopResponses, {
  limit: 3,
});

console.log(`\n🎯 Top ${laptopRecommendations.length} Laptop Recommendations:\n`);

laptopRecommendations.forEach((laptop, index) => {
  console.log(`${index + 1}. ${laptop.name} by ${laptop.brand}`);
  console.log(`   Score: ${laptop.score}/100 (${Math.round((laptop.score / 100) * 100)}% match)`);
  console.log(`   Price: $${(laptop.priceCents / 100).toFixed(2)}`);
  console.log(`   Category: ${laptop.attributes.category}`);
  console.log(`   RAM: ${laptop.attributes.ram}GB | Storage: ${laptop.attributes.storage}GB`);
  console.log(`   Match Reasons:`);
  laptop.matchReasons.forEach((reason) => {
    console.log(`   ✓ ${reason}`);
  });
  console.log();
});

// Show detailed scoring breakdown
console.log('📊 Detailed Scoring Breakdown:');
const laptopExplanation = laptopEngine.explainScore(exampleLaptops[3], laptopResponses);
console.log(`Product: ${exampleLaptops[3].name}`);
console.log(`Total Score: ${laptopExplanation.totalScore}/${laptopExplanation.maxScore} (${laptopExplanation.percentage}%)`);
console.log('\nRule-by-Rule Breakdown:');
laptopExplanation.breakdown.forEach((item) => {
  if (item.matched) {
    console.log(
      `  ✓ ${item.rule.id}: +${item.points} points (${item.responseValue} → ${item.productValue})`
    );
  }
});
console.log();

// ============================================================================
// DEMO 3: Show Platform Flexibility
// ============================================================================

console.log('='.repeat(80));
console.log('📍 DEMO 3: Platform Flexibility');
console.log('-'.repeat(80));
console.log();
console.log('The same RecommendationEngine handles different product types:');
console.log();
console.log('✓ Kayaks - with attributes like stability, length, type');
console.log('✓ Laptops - with attributes like RAM, processor, GPU');
console.log('✓ Paddles - with attributes like power, control, weight (current implementation)');
console.log();
console.log('All use the same scoring engine with different configurations!');
console.log('No code changes needed to add new product verticals.');
console.log();
console.log('='.repeat(80));
