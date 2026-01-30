/**
 * Test the generic engine integration with paddle adapter
 * (Unit test - doesn't require running server)
 */

import { describe, it, expect } from 'vitest';
import { RecommendationEngine } from '@/platform/core/engine/recommendation-engine';
import { paddlesToProducts, productToPaddleResponse } from '@/platform/adapters/paddle-adapter';
import { paddleScoringConfig } from '@/platform/adapters/paddle-scoring-config';

describe('Generic Engine API Integration', () => {
  // Sample paddle data (mimics what comes from database)
  const samplePaddles = [
    {
      id: 'paddle-1',
      name: 'Power Paddle Pro',
      brand: 'PowerBrand',
      priceCents: 15999,
      weightOz: 8.2,
      gripCircumference: 4.25,
      coreMaterial: 'Polymer',
      faceMaterial: 'Carbon Fiber',
      shape: 'standard',
      powerRating: 9,
      controlRating: 6,
      spinRating: 7,
      sweetSpotSize: 'medium',
      imageUrl: 'https://example.com/power-paddle.jpg',
      affiliateUrls: JSON.stringify({ amazon: 'https://amazon.com/dp/ABC123' }),
    },
    {
      id: 'paddle-2',
      name: 'Control Master',
      brand: 'ControlBrand',
      priceCents: 12999,
      weightOz: 7.8,
      gripCircumference: 4.125,
      coreMaterial: 'Nomex',
      faceMaterial: 'Fiberglass',
      shape: 'elongated',
      powerRating: 5,
      controlRating: 9,
      spinRating: 6,
      sweetSpotSize: 'large',
      imageUrl: 'https://example.com/control-master.jpg',
      affiliateUrls: JSON.stringify({ amazon: 'https://amazon.com/dp/DEF456' }),
    },
    {
      id: 'paddle-3',
      name: 'All-Rounder',
      brand: 'BalancedBrand',
      priceCents: 9999,
      weightOz: 7.5,
      gripCircumference: 4.0,
      coreMaterial: 'Polymer',
      faceMaterial: 'Composite',
      shape: 'standard',
      powerRating: 7,
      controlRating: 7,
      spinRating: 7,
      sweetSpotSize: 'medium',
      imageUrl: 'https://example.com/all-rounder.jpg',
      affiliateUrls: JSON.stringify({ amazon: 'https://amazon.com/dp/GHI789' }),
    },
  ];

  it('should convert paddles to products correctly', () => {
    const products = paddlesToProducts(samplePaddles);

    expect(products).toHaveLength(3);
    expect(products[0].id).toBe('paddle-1');
    expect(products[0].name).toBe('Power Paddle Pro');
    expect(products[0].attributes.powerRating).toBe(9);
    expect(products[0].attributes.priceCents).toBe(15999);
    expect(products[0].affiliateUrls).toEqual({ amazon: 'https://amazon.com/dp/ABC123' });
  });

  it('should generate recommendations using generic engine', () => {
    // Convert paddles to products
    const products = paddlesToProducts(samplePaddles);

    // Create engine with paddle scoring config
    const engine = new RecommendationEngine(paddleScoringConfig);

    // Sample quiz responses (power player with premium budget)
    const responses = {
      playStyle: 'power',
      budget: 'premium',
      weightPreference: 'heavy',
      shapePreference: 'standard',
    };

    // Get recommendations
    const recommendations = engine.recommend(products, responses, { limit: 3 });

    // Should return recommendations
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.length).toBeLessThanOrEqual(3);

    // Each recommendation should have required fields
    recommendations.forEach((rec) => {
      expect(rec).toHaveProperty('id');
      expect(rec).toHaveProperty('name');
      expect(rec).toHaveProperty('score');
      expect(rec).toHaveProperty('matchReasons');
      expect(Array.isArray(rec.matchReasons)).toBe(true);
    });

    // Power paddle should score higher for power player
    const powerPaddle = recommendations.find((r) => r.name === 'Power Paddle Pro');
    expect(powerPaddle).toBeDefined();
    if (powerPaddle) {
      expect(powerPaddle.score).toBeGreaterThan(0);
      expect(powerPaddle.matchReasons.length).toBeGreaterThan(0);
    }
  });

  it('should convert products back to paddle response format', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);
    const responses = { playStyle: 'control', budget: 'mid' };
    const recommendations = engine.recommend(products, responses, { limit: 1 });

    expect(recommendations.length).toBeGreaterThan(0);

    const product = recommendations[0];
    const paddleResponse = productToPaddleResponse(
      product,
      product.score,
      product.matchReasons
    );

    // Check all expected fields are present
    expect(paddleResponse).toHaveProperty('id');
    expect(paddleResponse).toHaveProperty('name');
    expect(paddleResponse).toHaveProperty('brand');
    expect(paddleResponse).toHaveProperty('priceCents');
    expect(paddleResponse).toHaveProperty('powerRating');
    expect(paddleResponse).toHaveProperty('controlRating');
    expect(paddleResponse).toHaveProperty('spinRating');
    expect(paddleResponse).toHaveProperty('weightOz');
    expect(paddleResponse).toHaveProperty('imageUrl');
    expect(paddleResponse).toHaveProperty('score');
    expect(paddleResponse).toHaveProperty('matchReasons');
    expect(paddleResponse).toHaveProperty('affiliateUrls');
  });

  it('should prioritize based on different play styles', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);

    // Test 1: Power player
    const powerResponses = { playStyle: 'power', budget: 'premium' };
    const powerRecs = engine.recommend(products, powerResponses, { limit: 3 });

    // Power Paddle Pro should score highest
    expect(powerRecs[0].name).toBe('Power Paddle Pro');
    expect(powerRecs[0].attributes.powerRating).toBe(9);

    // Test 2: Control player
    const controlResponses = { playStyle: 'control', budget: 'mid' };
    const controlRecs = engine.recommend(products, controlResponses, { limit: 3 });

    // Control Master should score highest
    expect(controlRecs[0].name).toBe('Control Master');
    expect(controlRecs[0].attributes.controlRating).toBe(9);
  });

  it('should handle budget preferences correctly', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);

    // Budget-conscious player
    const budgetResponses = { budget: 'budget', playStyle: 'control' };
    const budgetRecs = engine.recommend(products, budgetResponses, { limit: 3 });

    // All-Rounder (cheapest at $99.99) should score well for budget
    const budgetPaddle = budgetRecs.find((r) => r.name === 'All-Rounder');
    expect(budgetPaddle).toBeDefined();
    expect(budgetPaddle?.priceCents).toBe(9999);
  });

  it('should include match reasons for debugging', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);
    const responses = { playStyle: 'power', budget: 'premium' };
    const recommendations = engine.recommend(products, responses, { limit: 1 });

    expect(recommendations.length).toBeGreaterThan(0);

    const topRec = recommendations[0];
    expect(topRec.matchReasons.length).toBeGreaterThan(0);

    // Should have string reasons
    topRec.matchReasons.forEach((reason) => {
      expect(typeof reason).toBe('string');
      expect(reason.length).toBeGreaterThan(0);
    });
  });

  it('should preserve affiliate URLs through conversion', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);
    const responses = { playStyle: 'power' };
    const recommendations = engine.recommend(products, responses, { limit: 3 });

    recommendations.forEach((rec) => {
      expect(rec.affiliateUrls).toBeDefined();
      expect(typeof rec.affiliateUrls).toBe('object');

      if (Object.keys(rec.affiliateUrls).length > 0) {
        expect(rec.affiliateUrls.amazon).toBeDefined();
        expect(rec.affiliateUrls.amazon).toMatch(/^https:\/\/amazon\.com/);
      }
    });
  });

  it('should handle responses with missing optional fields', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);

    // Minimal responses
    const minimalResponses = { playStyle: 'power' };
    const recommendations = engine.recommend(products, minimalResponses, { limit: 3 });

    // Should still work
    expect(recommendations.length).toBeGreaterThan(0);
    recommendations.forEach((rec) => {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(100);
    });
  });

  it('should score within 0-100 range', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);
    const responses = {
      playStyle: 'power',
      budget: 'premium',
      weightPreference: 'heavy',
      shapePreference: 'standard',
    };
    const recommendations = engine.recommend(products, responses, { limit: 10 });

    recommendations.forEach((rec) => {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(100);
    });
  });

  it('should return recommendations sorted by score descending', () => {
    const products = paddlesToProducts(samplePaddles);
    const engine = new RecommendationEngine(paddleScoringConfig);
    const responses = { playStyle: 'control', budget: 'mid' };
    const recommendations = engine.recommend(products, responses, { limit: 3 });

    // Check sorted
    for (let i = 0; i < recommendations.length - 1; i++) {
      expect(recommendations[i].score).toBeGreaterThanOrEqual(
        recommendations[i + 1].score
      );
    }
  });
});
