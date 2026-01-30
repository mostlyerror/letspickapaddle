/**
 * Kayak Scoring Configuration
 *
 * Scoring rules for kayak recommendation engine.
 * Covers water type, experience, use case, storage, seating, and budget.
 */

import { ScoringConfig } from '../core/engine/types';

export const kayakScoringConfig: ScoringConfig = {
  maxScore: 100,
  minScore: 30,

  rules: [
    // ==================================================================
    // WATER TYPE RULES
    // ==================================================================

    // Calm water needs stability
    {
      id: 'calm_water_stability',
      type: 'threshold',
      responseKey: 'waterType',
      productAttribute: 'stability',
      logic: {
        condition: { value: 'calm_lakes' },
        threshold: 7,
        weight: 20,
      },
      reasoning: 'High stability perfect for calm lake paddling',
    },

    // Calm water → recreational type
    {
      id: 'calm_water_type',
      type: 'exact_match',
      responseKey: 'waterType',
      productAttribute: 'type',
      logic: {
        condition: { value: 'calm_lakes', operator: '==' },
        weight: 15,
      },
      reasoning: 'Recreational kayak ideal for calm water',
    },

    // Ocean → touring type
    {
      id: 'ocean_touring',
      type: 'exact_match',
      responseKey: 'waterType',
      productAttribute: 'type',
      logic: {
        condition: { value: 'ocean_coastal', operator: '==' },
        weight: 25,
      },
      reasoning: 'Touring kayak designed for ocean and coastal paddling',
    },

    // Ocean needs longer kayak
    {
      id: 'ocean_length',
      type: 'threshold',
      responseKey: 'waterType',
      productAttribute: 'length',
      logic: {
        condition: { value: 'ocean_coastal' },
        threshold: 12,
        weight: 15,
      },
      reasoning: 'Longer kayak handles ocean waves and wind better',
    },

    // Whitewater → whitewater type
    {
      id: 'whitewater_type',
      type: 'exact_match',
      responseKey: 'waterType',
      productAttribute: 'type',
      logic: {
        condition: { value: 'whitewater', operator: '==' },
        weight: 30,
      },
      reasoning: 'Specialized whitewater kayak for rapids',
    },

    // ==================================================================
    // EXPERIENCE LEVEL RULES
    // ==================================================================

    // Beginners need high stability
    {
      id: 'beginner_stability',
      type: 'threshold',
      responseKey: 'experience',
      productAttribute: 'stability',
      logic: {
        condition: { value: 'beginner' },
        threshold: 8,
        weight: 20,
      },
      reasoning: 'Very stable kayak great for beginners',
    },

    // Advanced paddlers want speed
    {
      id: 'advanced_speed',
      type: 'threshold',
      responseKey: 'experience',
      productAttribute: 'speed',
      logic: {
        condition: { value: 'advanced' },
        threshold: 7,
        weight: 15,
      },
      reasoning: 'Fast kayak for experienced paddlers',
    },

    // ==================================================================
    // USE CASE RULES
    // ==================================================================

    // Fishing → fishing type
    {
      id: 'fishing_type',
      type: 'exact_match',
      responseKey: 'useCase',
      productAttribute: 'type',
      logic: {
        condition: { value: 'fishing', operator: '==' },
        weight: 25,
      },
      reasoning: 'Fishing kayak with rod holders and storage',
    },

    // Fishing needs stability for standing
    {
      id: 'fishing_stability',
      type: 'threshold',
      responseKey: 'useCase',
      productAttribute: 'stability',
      logic: {
        condition: { value: 'fishing' },
        threshold: 8,
        weight: 15,
      },
      reasoning: 'High stability for standing and casting',
    },

    // Touring needs length for efficiency
    {
      id: 'touring_length',
      type: 'threshold',
      responseKey: 'useCase',
      productAttribute: 'length',
      logic: {
        condition: { value: 'touring' },
        threshold: 13,
        weight: 15,
      },
      reasoning: 'Long kayak for multi-day touring efficiency',
    },

    // Fitness needs speed
    {
      id: 'fitness_speed',
      type: 'threshold',
      responseKey: 'useCase',
      productAttribute: 'speed',
      logic: {
        condition: { value: 'fitness' },
        threshold: 8,
        weight: 20,
      },
      reasoning: 'Fast kayak perfect for fitness paddling',
    },

    // ==================================================================
    // STORAGE RULES
    // ==================================================================

    // Limited space → inflatable
    {
      id: 'limited_space_inflatable',
      type: 'exact_match',
      responseKey: 'storage',
      productAttribute: 'type',
      logic: {
        condition: { value: 'limited_space', operator: '==' },
        weight: 20,
      },
      reasoning: 'Inflatable kayak perfect for limited storage space',
    },

    // Car roof → lightweight
    {
      id: 'car_roof_weight',
      type: 'inverse_threshold',
      responseKey: 'storage',
      productAttribute: 'weight',
      logic: {
        condition: { value: 'car_roof' },
        threshold: 60,
        direction: 'below',
        weight: 10,
      },
      reasoning: 'Lightweight enough to load on roof rack',
    },

    // ==================================================================
    // SEATING RULES
    // ==================================================================

    // Tandem seating match
    {
      id: 'tandem_seating',
      type: 'exact_match',
      responseKey: 'seating',
      productAttribute: 'seating',
      logic: {
        condition: { value: 'tandem', operator: '==' },
        weight: 25,
      },
      reasoning: 'Tandem kayak for two paddlers',
    },

    // Single seating match
    {
      id: 'single_seating',
      type: 'exact_match',
      responseKey: 'seating',
      productAttribute: 'seating',
      logic: {
        condition: { value: 'single', operator: '==' },
        weight: 15,
      },
      reasoning: 'Solo kayak optimized for one paddler',
    },

    // ==================================================================
    // BUDGET RULES
    // ==================================================================

    // Budget: under $400
    {
      id: 'budget_under_400',
      type: 'inverse_threshold',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        condition: { value: 'budget' },
        threshold: 40000,
        direction: 'below',
        weight: 15,
      },
      reasoning: 'Affordable option within your budget',
    },

    // Mid-range: $400-$800
    {
      id: 'mid_400_800',
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [40000, 80000],
        weight: 15,
      },
      reasoning: 'Great value in your price range',
    },

    // Premium: $800-$1,500
    {
      id: 'premium_800_1500',
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [80000, 150000],
        weight: 15,
      },
      reasoning: 'Premium features in your budget',
    },

    // Luxury: $1,500+
    {
      id: 'luxury_1500_plus',
      type: 'threshold',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        condition: { value: 'luxury' },
        threshold: 150000,
        weight: 10,
      },
      reasoning: 'Top-tier kayak with best features',
    },
  ],
};
