/**
 * Paddle Scoring Configuration
 *
 * This converts the current paddle recommendation logic into
 * a ScoringConfig for the generic recommendation engine.
 *
 * Note: The current system uses database-driven weightMappings
 * that aggregate from multiple quiz questions. This configuration
 * provides equivalent logic using the generic rule system.
 */

import { ScoringConfig, QuizConfig } from '../core/engine/types';

/**
 * Scoring configuration for paddle recommendations
 *
 * Replicates the logic from src/lib/recommendationEngine.ts
 */
export const paddleScoringConfig: ScoringConfig = {
  maxScore: 100,
  minScore: 20,

  rules: [
    // ==================================================================
    // POWER RATING RULES
    // ==================================================================

    // High power for aggressive/power players
    {
      id: 'power_aggressive',
      type: 'threshold',
      responseKey: 'playStyle',
      productAttribute: 'powerRating',
      logic: {
        condition: { value: 'power' },
        threshold: 8,
        weight: 25,
      },
      reasoning: 'High power rating matches your aggressive play style',
    },

    // Medium power for balanced players
    {
      id: 'power_balanced',
      type: 'range',
      responseKey: 'playStyle',
      productAttribute: 'powerRating',
      logic: {
        range: [6, 8],
        weight: 20,
      },
      reasoning: 'Balanced power for all-around play',
    },

    // Low power for control players
    {
      id: 'power_control',
      type: 'inverse_threshold',
      responseKey: 'playStyle',
      productAttribute: 'powerRating',
      logic: {
        condition: { value: 'control' },
        threshold: 6,
        direction: 'below',
        weight: 15,
      },
      reasoning: 'Lower power favors control-oriented play',
    },

    // ==================================================================
    // CONTROL RATING RULES
    // ==================================================================

    // High control for finesse players
    {
      id: 'control_finesse',
      type: 'threshold',
      responseKey: 'playStyle',
      productAttribute: 'controlRating',
      logic: {
        condition: { value: 'control' },
        threshold: 8,
        weight: 25,
      },
      reasoning: 'Excellent control for precise placement',
    },

    // Medium control for balanced players
    {
      id: 'control_balanced',
      type: 'range',
      responseKey: 'playStyle',
      productAttribute: 'controlRating',
      logic: {
        range: [6, 8],
        weight: 20,
      },
      reasoning: 'Good control for balanced play',
    },

    // ==================================================================
    // SPIN RATING RULES
    // ==================================================================

    // High spin for spin-focused players
    {
      id: 'spin_high',
      type: 'threshold',
      responseKey: 'spinPreference',
      productAttribute: 'spinRating',
      logic: {
        condition: { value: 'high' },
        threshold: 8,
        weight: 20,
      },
      reasoning: 'Great spin potential for advanced shots',
    },

    // Medium spin for general play
    {
      id: 'spin_medium',
      type: 'range',
      responseKey: 'spinPreference',
      productAttribute: 'spinRating',
      logic: {
        range: [6, 8],
        weight: 15,
      },
      reasoning: 'Adequate spin for most situations',
    },

    // ==================================================================
    // WEIGHT RULES
    // ==================================================================

    // Lightweight preference
    {
      id: 'weight_light',
      type: 'inverse_threshold',
      responseKey: 'weightPreference',
      productAttribute: 'weightOz',
      logic: {
        condition: { value: 'light' },
        threshold: 7.5,
        direction: 'below',
        weight: 18,
      },
      reasoning: 'Lightweight for quick reactions and maneuverability',
    },

    // Medium weight preference
    {
      id: 'weight_medium',
      type: 'range',
      responseKey: 'weightPreference',
      productAttribute: 'weightOz',
      logic: {
        range: [7.5, 8.5],
        weight: 18,
      },
      reasoning: 'Balanced weight for power and control',
    },

    // Heavyweight preference
    {
      id: 'weight_heavy',
      type: 'threshold',
      responseKey: 'weightPreference',
      productAttribute: 'weightOz',
      logic: {
        condition: { value: 'heavy' },
        threshold: 8.5,
        weight: 18,
      },
      reasoning: 'Heavier paddle for maximum power',
    },

    // ==================================================================
    // SHAPE RULES
    // ==================================================================

    {
      id: 'shape_standard',
      type: 'exact_match',
      responseKey: 'shapePreference',
      productAttribute: 'shape',
      logic: {
        condition: { value: 'standard', operator: '==' },
        weight: 15,
      },
      reasoning: 'Standard shape provides balanced sweet spot',
    },

    {
      id: 'shape_elongated',
      type: 'exact_match',
      responseKey: 'shapePreference',
      productAttribute: 'shape',
      logic: {
        condition: { value: 'elongated', operator: '==' },
        weight: 15,
      },
      reasoning: 'Elongated shape for extended reach',
    },

    {
      id: 'shape_widebody',
      type: 'exact_match',
      responseKey: 'shapePreference',
      productAttribute: 'shape',
      logic: {
        condition: { value: 'widebody', operator: '==' },
        weight: 15,
      },
      reasoning: 'Widebody shape for larger sweet spot',
    },

    // ==================================================================
    // SWEET SPOT SIZE RULES
    // ==================================================================

    {
      id: 'sweetspot_large',
      type: 'exact_match',
      responseKey: 'sweetSpotPreference',
      productAttribute: 'sweetSpotSize',
      logic: {
        condition: { value: 'large', operator: '==' },
        weight: 12,
      },
      reasoning: 'Large sweet spot for forgiving play',
    },

    {
      id: 'sweetspot_medium',
      type: 'exact_match',
      responseKey: 'sweetSpotPreference',
      productAttribute: 'sweetSpotSize',
      logic: {
        condition: { value: 'medium', operator: '==' },
        weight: 12,
      },
      reasoning: 'Medium sweet spot balances control and forgiveness',
    },

    {
      id: 'sweetspot_small',
      type: 'exact_match',
      responseKey: 'sweetSpotPreference',
      productAttribute: 'sweetSpotSize',
      logic: {
        condition: { value: 'small', operator: '==' },
        weight: 12,
      },
      reasoning: 'Smaller sweet spot for precise shots',
    },

    // ==================================================================
    // BUDGET/PRICE RULES
    // ==================================================================

    // Budget-friendly (under $100)
    {
      id: 'price_budget',
      type: 'inverse_threshold',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        condition: { value: 'budget' },
        threshold: 10000,
        direction: 'below',
        weight: 20,
      },
      reasoning: 'Affordable option for beginners',
    },

    // Mid-range ($100-$150)
    {
      id: 'price_mid',
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [10000, 15000],
        weight: 20,
      },
      reasoning: 'Great value in mid-range',
    },

    // Premium ($150+)
    {
      id: 'price_premium',
      type: 'threshold',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        condition: { value: 'premium' },
        threshold: 15000,
        weight: 20,
      },
      reasoning: 'Premium paddle with advanced features',
    },

    // ==================================================================
    // MATERIAL PREFERENCE RULES
    // ==================================================================

    {
      id: 'core_polymer',
      type: 'contains',
      responseKey: 'coreMaterialPreference',
      productAttribute: 'coreMaterial',
      logic: {
        weight: 8,
      },
      reasoning: 'Preferred core material',
    },

    {
      id: 'face_carbon',
      type: 'contains',
      responseKey: 'faceMaterialPreference',
      productAttribute: 'faceMaterial',
      logic: {
        weight: 8,
      },
      reasoning: 'Preferred face material',
    },

    // ==================================================================
    // EXPERIENCE LEVEL ADJUSTMENTS
    // ==================================================================

    // Beginners benefit from larger sweet spots and stability
    {
      id: 'beginner_sweetspot',
      type: 'exact_match',
      responseKey: 'experience',
      productAttribute: 'sweetSpotSize',
      logic: {
        condition: { value: 'beginner', operator: '==' },
        weight: 15,
      },
      reasoning: 'Forgiving sweet spot great for learning',
    },

    // Beginners prefer lighter paddles
    {
      id: 'beginner_weight',
      type: 'inverse_threshold',
      responseKey: 'experience',
      productAttribute: 'weightOz',
      logic: {
        condition: { value: 'beginner' },
        threshold: 8.0,
        direction: 'below',
        weight: 12,
      },
      reasoning: 'Lighter paddle easier for beginners to maneuver',
    },

    // Advanced players can handle more demanding paddles
    {
      id: 'advanced_control',
      type: 'threshold',
      responseKey: 'experience',
      productAttribute: 'controlRating',
      logic: {
        condition: { value: 'advanced' },
        threshold: 7,
        weight: 15,
      },
      reasoning: 'High-performance paddle for experienced players',
    },
  ],
};

/**
 * Full quiz configuration for paddle finder
 * (This would eventually be stored in the database as JSON)
 */
export const paddleQuizConfig: QuizConfig = {
  id: 'quiz_paddle_finder',
  workspaceId: 'pickleball',
  name: 'Find Your Perfect Paddle',
  slug: 'paddle-finder',

  // NOTE: Questions would come from the database in production
  // This is just for documentation/reference
  questions: [],

  scoringConfig: paddleScoringConfig,

  theme: {
    primaryColor: '#0ea5e9',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  resultsConfig: {
    showScores: true,
    maxResults: 5,
    ctaText: 'Buy on Amazon',
  },
};
