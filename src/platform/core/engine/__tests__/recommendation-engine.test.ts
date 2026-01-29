/**
 * Unit tests for Generic Recommendation Engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RecommendationEngine } from '../recommendation-engine';
import {
  Product,
  QuizResponses,
  ScoringConfig,
  ScoringRule,
} from '../types';

describe('RecommendationEngine', () => {
  // Sample products for testing
  const sampleProducts: Product[] = [
    {
      id: 'prod-1',
      workspaceId: 'test-workspace',
      name: 'Product A',
      brand: 'Brand A',
      priceCents: 10000,
      imageUrl: 'https://example.com/a.jpg',
      affiliateUrls: { amazon: 'https://amazon.com/a' },
      attributes: {
        power: 8,
        weight: 7.5,
        type: 'premium',
        features: ['feature1', 'feature2'],
        rating: 9,
        priceCents: 10000, // Also in attributes for rules to access
      },
    },
    {
      id: 'prod-2',
      workspaceId: 'test-workspace',
      name: 'Product B',
      brand: 'Brand B',
      priceCents: 5000,
      imageUrl: 'https://example.com/b.jpg',
      affiliateUrls: { amazon: 'https://amazon.com/b' },
      attributes: {
        power: 5,
        weight: 6.0,
        type: 'standard',
        features: ['feature1', 'feature3'],
        rating: 7,
        priceCents: 5000, // Also in attributes for rules to access
      },
    },
    {
      id: 'prod-3',
      workspaceId: 'test-workspace',
      name: 'Product C',
      brand: 'Brand C',
      priceCents: 15000,
      imageUrl: 'https://example.com/c.jpg',
      affiliateUrls: { amazon: 'https://amazon.com/c' },
      attributes: {
        power: 10,
        weight: 8.0,
        type: 'premium',
        features: ['feature2', 'feature4'],
        rating: 10,
        priceCents: 15000, // Also in attributes for rules to access
      },
    },
  ];

  describe('Exact Match Rules', () => {
    it('should match when response equals condition value', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'exact_match',
            responseKey: 'preference',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 50,
            },
            reasoning: 'Premium product matches your preference',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { preference: 'premium' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(50);
      expect(result.reasons).toContain('Premium product matches your preference');
    });

    it('should not match when response does not equal condition value', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'exact_match',
            responseKey: 'preference',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 50,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { preference: 'standard' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });
  });

  describe('Range Rules', () => {
    it('should match when product value is within range', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'range',
            responseKey: 'budget',
            productAttribute: 'priceCents',
            logic: {
              range: [8000, 12000],
              weight: 40,
            },
            reasoning: 'Within your budget',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { budget: 'mid' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(40);
      expect(result.reasons).toContain('Within your budget');
    });

    it('should not match when product value is outside range', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'range',
            responseKey: 'budget',
            productAttribute: 'priceCents',
            logic: {
              range: [20000, 30000],
              weight: 40,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { budget: 'luxury' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });
  });

  describe('Threshold Rules', () => {
    it('should match when product value meets threshold', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'threshold',
            responseKey: 'playStyle',
            productAttribute: 'power',
            logic: {
              condition: { value: 'aggressive' },
              threshold: 8,
              weight: 30,
            },
            reasoning: 'High power for aggressive play',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { playStyle: 'aggressive' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(30);
      expect(result.reasons).toContain('High power for aggressive play');
    });

    it('should not match when product value below threshold', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'threshold',
            responseKey: 'playStyle',
            productAttribute: 'power',
            logic: {
              condition: { value: 'aggressive' },
              threshold: 8,
              weight: 30,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { playStyle: 'aggressive' };
      const result = engine.score(sampleProducts[1], responses); // power: 5

      expect(result.score).toBe(0);
    });

    it('should not match when condition does not match response', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'threshold',
            responseKey: 'playStyle',
            productAttribute: 'power',
            logic: {
              condition: { value: 'aggressive' },
              threshold: 8,
              weight: 30,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { playStyle: 'defensive' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });
  });

  describe('Inverse Threshold Rules', () => {
    it('should match when product value is below threshold', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'inverse_threshold',
            responseKey: 'budget',
            productAttribute: 'priceCents',
            logic: {
              condition: { value: 'budget' },
              threshold: 7000,
              direction: 'below',
              weight: 25,
            },
            reasoning: 'Affordable option',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { budget: 'budget' };
      const result = engine.score(sampleProducts[1], responses); // priceCents: 5000

      expect(result.score).toBe(25);
      expect(result.reasons).toContain('Affordable option');
    });

    it('should not match when product value is above threshold', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'inverse_threshold',
            responseKey: 'budget',
            productAttribute: 'priceCents',
            logic: {
              condition: { value: 'budget' },
              threshold: 7000,
              direction: 'below',
              weight: 25,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { budget: 'budget' };
      const result = engine.score(sampleProducts[0], responses); // priceCents: 10000

      expect(result.score).toBe(0);
    });
  });

  describe('Preference Weight Rules', () => {
    it('should score based on proximity to preference', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'preference_weight',
            responseKey: 'desiredWeight',
            productAttribute: 'weight',
            logic: {
              maxDistance: 2,
              weight: 40,
            },
            reasoning: 'Close to your preferred weight',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { desiredWeight: 7.0 };

      // Product with weight 7.5 (distance: 0.5)
      const result = engine.score(sampleProducts[0], responses);

      // Expected: (1 - 0.5/2) * 40 = 0.75 * 40 = 30
      expect(result.score).toBe(30);
      expect(result.reasons).toContain('Close to your preferred weight');
    });

    it('should return 0 when distance exceeds maxDistance', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'preference_weight',
            responseKey: 'desiredWeight',
            productAttribute: 'weight',
            logic: {
              maxDistance: 1,
              weight: 40,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { desiredWeight: 5.0 };

      // Product with weight 7.5 (distance: 2.5, exceeds maxDistance of 1)
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });
  });

  describe('Contains Rules', () => {
    it('should match when array contains value', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'contains',
            responseKey: 'wantedFeature',
            productAttribute: 'features',
            logic: {
              weight: 20,
            },
            reasoning: 'Has your desired feature',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { wantedFeature: 'feature1' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(20);
      expect(result.reasons).toContain('Has your desired feature');
    });

    it('should not match when array does not contain value', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'contains',
            responseKey: 'wantedFeature',
            productAttribute: 'features',
            logic: {
              weight: 20,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { wantedFeature: 'feature5' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });
  });

  describe('Multi Match Rules', () => {
    it('should score based on percentage of matches', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'multi_match',
            responseKey: 'wantedFeatures',
            productAttribute: 'features',
            logic: {
              weight: 40,
            },
            reasoning: 'Matches multiple features',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = {
        wantedFeatures: ['feature1', 'feature2', 'feature5'],
      };

      // Product has feature1 and feature2, but not feature5
      // 2/3 matches = 0.667 * 40 = 27 (rounded)
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(27);
      expect(result.reasons).toContain('Matches multiple features');
    });

    it('should return 0 when no matches', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'multi_match',
            responseKey: 'wantedFeatures',
            productAttribute: 'features',
            logic: {
              weight: 40,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = {
        wantedFeatures: ['feature5', 'feature6'],
      };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });
  });

  describe('Multiple Rules Combination', () => {
    it('should combine scores from multiple matching rules', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'exact_match',
            responseKey: 'type',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 30,
            },
            reasoning: 'Premium type',
          },
          {
            type: 'threshold',
            responseKey: 'minPower',
            productAttribute: 'power',
            logic: {
              threshold: 7,
              weight: 20,
            },
            reasoning: 'High power',
          },
          {
            type: 'range',
            responseKey: 'budget',
            productAttribute: 'priceCents',
            logic: {
              range: [8000, 12000],
              weight: 25,
            },
            reasoning: 'In budget',
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = {
        type: 'premium',
        minPower: 7,
        budget: 'mid',
      };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(75); // 30 + 20 + 25
      expect(result.reasons.length).toBe(3);
    });

    it('should cap total score at maxScore', () => {
      const config: ScoringConfig = {
        maxScore: 50,
        rules: [
          {
            type: 'threshold',
            responseKey: 'power',
            productAttribute: 'power',
            logic: { threshold: 5, weight: 40 },
          },
          {
            type: 'threshold',
            responseKey: 'rating',
            productAttribute: 'rating',
            logic: { threshold: 7, weight: 30 },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { power: 5, rating: 7 };
      const result = engine.score(sampleProducts[0], responses);

      // Would be 70, but capped at maxScore
      expect(result.score).toBe(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing response value', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'exact_match',
            responseKey: 'nonexistent',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 50,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { other: 'value' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });

    it('should handle missing product attribute', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'threshold',
            responseKey: 'value',
            productAttribute: 'nonexistent',
            logic: {
              threshold: 5,
              weight: 30,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { value: 'test' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });

    it('should skip disabled rules', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'exact_match',
            responseKey: 'type',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 50,
            },
            enabled: false,
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { type: 'premium' };
      const result = engine.score(sampleProducts[0], responses);

      expect(result.score).toBe(0);
    });

    it('should handle empty products array', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            type: 'exact_match',
            responseKey: 'type',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 50,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { type: 'premium' };
      const recommendations = engine.recommend([], responses);

      expect(recommendations).toEqual([]);
    });
  });

  describe('recommend() method', () => {
    const config: ScoringConfig = {
      maxScore: 100,
      rules: [
        {
          type: 'threshold',
          responseKey: 'minPower',
          productAttribute: 'power',
          logic: {
            threshold: 6,
            weight: 40,
          },
          reasoning: 'Sufficient power',
        },
        {
          type: 'threshold',
          responseKey: 'minRating',
          productAttribute: 'rating',
          logic: {
            threshold: 8,
            weight: 30,
          },
          reasoning: 'Highly rated',
        },
      ],
    };

    it('should return sorted recommendations by score', () => {
      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { minPower: 6, minRating: 8 };
      const recommendations = engine.recommend(sampleProducts, responses);

      expect(recommendations.length).toBe(3);
      expect(recommendations[0].score).toBeGreaterThanOrEqual(recommendations[1].score);
      expect(recommendations[1].score).toBeGreaterThanOrEqual(recommendations[2].score);
    });

    it('should limit results based on limit parameter', () => {
      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { minPower: 6, minRating: 8 };
      const recommendations = engine.recommend(sampleProducts, responses, {
        limit: 2,
      });

      expect(recommendations.length).toBe(2);
    });

    it('should filter by minimum score', () => {
      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { minPower: 6, minRating: 8 };
      const recommendations = engine.recommend(sampleProducts, responses, {
        minScore: 60,
      });

      expect(recommendations.every((r) => r.score >= 60)).toBe(true);
    });

    it('should include score and matchReasons in results', () => {
      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { minPower: 6, minRating: 8 };
      const recommendations = engine.recommend(sampleProducts, responses);

      recommendations.forEach((rec) => {
        expect(rec).toHaveProperty('score');
        expect(rec).toHaveProperty('matchReasons');
        expect(Array.isArray(rec.matchReasons)).toBe(true);
      });
    });
  });

  describe('explainScore() method', () => {
    it('should return detailed scoring breakdown', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            id: 'rule-1',
            type: 'threshold',
            responseKey: 'minPower',
            productAttribute: 'power',
            logic: {
              threshold: 7,
              weight: 40,
            },
          },
          {
            id: 'rule-2',
            type: 'exact_match',
            responseKey: 'type',
            productAttribute: 'type',
            logic: {
              condition: { value: 'premium', operator: '==' },
              weight: 30,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { minPower: 7, type: 'premium' };
      const explanation = engine.explainScore(sampleProducts[0], responses);

      expect(explanation.totalScore).toBe(70);
      expect(explanation.maxScore).toBe(100);
      expect(explanation.percentage).toBe(70);
      expect(explanation.breakdown.length).toBe(2);

      expect(explanation.breakdown[0].matched).toBe(true);
      expect(explanation.breakdown[0].points).toBe(40);
      expect(explanation.breakdown[1].matched).toBe(true);
      expect(explanation.breakdown[1].points).toBe(30);
    });

    it('should show non-matching rules in breakdown', () => {
      const config: ScoringConfig = {
        maxScore: 100,
        rules: [
          {
            id: 'rule-1',
            type: 'threshold',
            responseKey: 'minPower',
            productAttribute: 'power',
            logic: {
              threshold: 7,
              weight: 40,
            },
          },
          {
            id: 'rule-2',
            type: 'threshold',
            responseKey: 'minRating',
            productAttribute: 'rating',
            logic: {
              threshold: 11, // Will not match
              weight: 30,
            },
          },
        ],
      };

      const engine = new RecommendationEngine(config);
      const responses: QuizResponses = { minPower: 7, minRating: 11 };
      const explanation = engine.explainScore(sampleProducts[0], responses);

      expect(explanation.breakdown.length).toBe(2);
      expect(explanation.breakdown[0].matched).toBe(true);
      expect(explanation.breakdown[1].matched).toBe(false);
      expect(explanation.breakdown[1].points).toBe(0);
    });
  });

  describe('Config Validation', () => {
    it('should throw error for config without rules', () => {
      expect(() => {
        new RecommendationEngine({
          maxScore: 100,
          rules: [],
        });
      }).toThrow('Scoring config must have at least one rule');
    });

    it('should throw error for config without maxScore', () => {
      expect(() => {
        new RecommendationEngine({
          maxScore: 0,
          rules: [
            {
              type: 'exact_match',
              responseKey: 'test',
              productAttribute: 'test',
              logic: { weight: 10 },
            },
          ],
        });
      }).toThrow('Scoring config must have a positive maxScore');
    });
  });
});
