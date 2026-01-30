/**
 * Laptop Scoring Configuration
 *
 * Scoring rules for laptop recommendation engine.
 * Covers use case, portability, battery, screen size, performance, and budget.
 */

import { ScoringConfig } from '../core/engine/types';

export const laptopScoringConfig: ScoringConfig = {
  maxScore: 100,
  minScore: 25,

  rules: [
    // ==================================================================
    // USE CASE RULES
    // ==================================================================

    // Everyday use → Chromebook
    {
      id: 'everyday_chromebook',
      type: 'exact_match',
      responseKey: 'useCase',
      productAttribute: 'category',
      logic: {
        condition: { value: 'everyday', operator: '==' },
        weight: 15,
      },
      reasoning: 'Chromebook perfect for everyday web and productivity',
    },

    // Business → Business laptop
    {
      id: 'work_business',
      type: 'exact_match',
      responseKey: 'useCase',
      productAttribute: 'category',
      logic: {
        condition: { value: 'work', operator: '==' },
        weight: 20,
      },
      reasoning: 'Business laptop with professional features',
    },

    // Creative → Workstation
    {
      id: 'creative_workstation',
      type: 'exact_match',
      responseKey: 'useCase',
      productAttribute: 'category',
      logic: {
        condition: { value: 'creative', operator: '==' },
        weight: 25,
      },
      reasoning: 'Workstation laptop for creative professionals',
    },

    // Creative needs RAM
    {
      id: 'creative_ram',
      type: 'threshold',
      responseKey: 'useCase',
      productAttribute: 'ram',
      logic: {
        condition: { value: 'creative' },
        threshold: 16,
        weight: 15,
      },
      reasoning: 'Ample RAM for photo/video editing',
    },

    // Gaming → Gaming laptop
    {
      id: 'gaming_category',
      type: 'exact_match',
      responseKey: 'useCase',
      productAttribute: 'category',
      logic: {
        condition: { value: 'gaming', operator: '==' },
        weight: 30,
      },
      reasoning: 'Gaming laptop with dedicated GPU',
    },

    // Gaming needs high refresh rate
    {
      id: 'gaming_gpu',
      type: 'threshold',
      responseKey: 'useCase',
      productAttribute: 'refreshRate',
      logic: {
        condition: { value: 'gaming' },
        threshold: 120,
        weight: 15,
      },
      reasoning: 'High refresh rate display for smooth gaming',
    },

    // Programming needs RAM
    {
      id: 'programming_ram',
      type: 'threshold',
      responseKey: 'useCase',
      productAttribute: 'ram',
      logic: {
        condition: { value: 'programming' },
        threshold: 16,
        weight: 15,
      },
      reasoning: 'Plenty of RAM for VMs and development',
    },

    // ==================================================================
    // PORTABILITY RULES
    // ==================================================================

    // Very portable → lightweight
    {
      id: 'very_portable_weight',
      type: 'inverse_threshold',
      responseKey: 'portability',
      productAttribute: 'weight',
      logic: {
        condition: { value: 'very' },
        threshold: 3,
        direction: 'below',
        weight: 20,
      },
      reasoning: 'Lightweight design perfect for travel',
    },

    // Very portable → high portability rating
    {
      id: 'very_portable_rating',
      type: 'threshold',
      responseKey: 'portability',
      productAttribute: 'portability',
      logic: {
        condition: { value: 'very' },
        threshold: 8,
        weight: 15,
      },
      reasoning: 'Ultra-portable for on-the-go use',
    },

    // Somewhat portable → mid-weight
    {
      id: 'somewhat_portable_weight',
      type: 'range',
      responseKey: 'portability',
      productAttribute: 'weight',
      logic: {
        range: [3, 5],
        weight: 10,
      },
      reasoning: 'Good balance of portability and performance',
    },

    // Not portable → heavier is fine
    {
      id: 'not_portable',
      type: 'threshold',
      responseKey: 'portability',
      productAttribute: 'weight',
      logic: {
        condition: { value: 'not' },
        threshold: 5,
        weight: 5,
      },
      reasoning: 'Powerful desktop replacement',
    },

    // ==================================================================
    // BATTERY LIFE RULES
    // ==================================================================

    // All day battery
    {
      id: 'all_day_battery',
      type: 'threshold',
      responseKey: 'batteryNeeds',
      productAttribute: 'batteryLife',
      logic: {
        condition: { value: 'all_day' },
        threshold: 10,
        weight: 20,
      },
      reasoning: 'Long battery life for all-day productivity',
    },

    // Half day battery
    {
      id: 'half_day_battery',
      type: 'range',
      responseKey: 'batteryNeeds',
      productAttribute: 'batteryLife',
      logic: {
        range: [6, 10],
        weight: 15,
      },
      reasoning: 'Good battery life for mobile work',
    },

    // ==================================================================
    // SCREEN SIZE RULES
    // ==================================================================

    // Compact screen (13" or smaller)
    {
      id: 'compact_screen',
      type: 'inverse_threshold',
      responseKey: 'screenSize',
      productAttribute: 'screenSize',
      logic: {
        condition: { value: 'compact' },
        threshold: 13.5,
        direction: 'below',
        weight: 15,
      },
      reasoning: 'Compact screen for maximum portability',
    },

    // Balanced screen (14-15")
    {
      id: 'balanced_screen',
      type: 'range',
      responseKey: 'screenSize',
      productAttribute: 'screenSize',
      logic: {
        range: [14, 15.6],
        weight: 15,
      },
      reasoning: 'Perfect screen size balance',
    },

    // Large screen (16"+)
    {
      id: 'large_screen',
      type: 'threshold',
      responseKey: 'screenSize',
      productAttribute: 'screenSize',
      logic: {
        condition: { value: 'large' },
        threshold: 16,
        weight: 15,
      },
      reasoning: 'Large screen for productivity and entertainment',
    },

    // ==================================================================
    // PERFORMANCE RULES
    // ==================================================================

    // Basic performance
    {
      id: 'basic_performance_ram',
      type: 'threshold',
      responseKey: 'performance',
      productAttribute: 'ram',
      logic: {
        condition: { value: 'basic' },
        threshold: 8,
        weight: 10,
      },
      reasoning: 'Sufficient RAM for everyday tasks',
    },

    // Medium performance
    {
      id: 'medium_performance_ram',
      type: 'threshold',
      responseKey: 'performance',
      productAttribute: 'ram',
      logic: {
        condition: { value: 'medium' },
        threshold: 16,
        weight: 15,
      },
      reasoning: 'Good RAM for multitasking',
    },

    // High performance RAM
    {
      id: 'high_performance_ram',
      type: 'threshold',
      responseKey: 'performance',
      productAttribute: 'ram',
      logic: {
        condition: { value: 'high' },
        threshold: 16,
        weight: 15,
      },
      reasoning: 'Plenty of RAM for intensive work',
    },

    // Extreme performance RAM
    {
      id: 'extreme_performance_ram',
      type: 'threshold',
      responseKey: 'performance',
      productAttribute: 'ram',
      logic: {
        condition: { value: 'extreme' },
        threshold: 32,
        weight: 20,
      },
      reasoning: 'High RAM for extreme workloads',
    },

    // High performance storage
    {
      id: 'high_performance_storage',
      type: 'threshold',
      responseKey: 'performance',
      productAttribute: 'storage',
      logic: {
        condition: { value: 'high' },
        threshold: 512,
        weight: 10,
      },
      reasoning: 'Fast SSD storage for quick load times',
    },

    // ==================================================================
    // BUDGET RULES
    // ==================================================================

    // Budget: under $500
    {
      id: 'budget_under_500',
      type: 'inverse_threshold',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        condition: { value: 'budget' },
        threshold: 50000,
        direction: 'below',
        weight: 15,
      },
      reasoning: 'Budget-friendly option',
    },

    // Mid-low: $500-$800
    {
      id: 'mid_low_500_800',
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [50000, 80000],
        weight: 15,
      },
      reasoning: 'Great value in your price range',
    },

    // Mid: $800-$1,200
    {
      id: 'mid_800_1200',
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [80000, 120000],
        weight: 15,
      },
      reasoning: 'Quality laptop in your budget',
    },

    // Premium: $1,200-$2,000
    {
      id: 'premium_1200_2000',
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [120000, 200000],
        weight: 15,
      },
      reasoning: 'Premium features and performance',
    },

    // Luxury: $2,000+
    {
      id: 'luxury_2000_plus',
      type: 'threshold',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        condition: { value: 'luxury' },
        threshold: 200000,
        weight: 10,
      },
      reasoning: 'Top-tier laptop with best specs',
    },
  ],
};
