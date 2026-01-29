/**
 * Example: Kayak Recommendation Quiz Configuration
 *
 * This demonstrates how the generic platform would be configured
 * for a kayak recommendation quiz.
 */

import { QuizConfig, WorkspaceConfig } from '../core/engine/types';

/**
 * Workspace configuration for kayak vertical
 */
export const kayakWorkspace: WorkspaceConfig = {
  id: 'wks_kayak',
  name: 'Kayak Finder',
  slug: 'kayak-finder',
  productType: 'kayak',

  // Define kayak-specific attributes
  productSchema: [
    {
      key: 'type',
      label: 'Kayak Type',
      type: 'enum',
      enum: ['recreational', 'touring', 'fishing', 'whitewater', 'inflatable'],
      required: true,
    },
    {
      key: 'length',
      label: 'Length',
      type: 'number',
      unit: 'feet',
      min: 6,
      max: 18,
    },
    {
      key: 'weight',
      label: 'Weight',
      type: 'number',
      unit: 'lbs',
      min: 20,
      max: 100,
    },
    {
      key: 'capacity',
      label: 'Weight Capacity',
      type: 'number',
      unit: 'lbs',
      min: 200,
      max: 500,
    },
    {
      key: 'width',
      label: 'Width',
      type: 'number',
      unit: 'inches',
      min: 20,
      max: 36,
    },
    {
      key: 'stability',
      label: 'Stability Rating',
      type: 'number',
      min: 1,
      max: 10,
      description: '1 = Tippy/Advanced, 10 = Very Stable/Beginner-friendly',
    },
    {
      key: 'speed',
      label: 'Speed Rating',
      type: 'number',
      min: 1,
      max: 10,
      description: '1 = Slow, 10 = Fast',
    },
    {
      key: 'tracking',
      label: 'Tracking',
      type: 'number',
      min: 1,
      max: 10,
      description: 'How well it goes straight',
    },
    {
      key: 'material',
      label: 'Material',
      type: 'enum',
      enum: ['polyethylene', 'composite', 'inflatable', 'thermoform'],
    },
    {
      key: 'seating',
      label: 'Seating Capacity',
      type: 'enum',
      enum: ['single', 'tandem', 'triple'],
    },
    {
      key: 'storage',
      label: 'Storage Type',
      type: 'string',
      description: 'e.g., "Bow and stern hatches", "Open cockpit"',
    },
  ],

  affiliateNetworks: ['amazon', 'rei', 'direct'],
};

/**
 * Kayak quiz configuration
 */
export const kayakQuiz: QuizConfig = {
  id: 'quiz_kayak_finder',
  workspaceId: 'wks_kayak',
  name: 'Find Your Perfect Kayak',
  slug: 'find-your-kayak',

  questions: [
    {
      id: 'q1_water_type',
      text: 'Where will you primarily paddle?',
      type: 'single_choice',
      responseKey: 'waterType',
      required: true,
      options: [
        {
          value: 'calm_lakes',
          label: 'Calm Lakes & Ponds',
          description: 'Smooth water, relaxed paddling',
          icon: '🏞️',
        },
        {
          value: 'rivers_streams',
          label: 'Rivers & Streams',
          description: 'Flowing water, some current',
          icon: '🌊',
        },
        {
          value: 'ocean_coastal',
          label: 'Ocean & Coastal',
          description: 'Saltwater, waves, longer trips',
          icon: '🌅',
        },
        {
          value: 'whitewater',
          label: 'Whitewater Rapids',
          description: 'Fast-moving water, technical paddling',
          icon: '⚡',
        },
      ],
    },
    {
      id: 'q2_experience',
      text: "What's your paddling experience level?",
      type: 'single_choice',
      responseKey: 'experience',
      required: true,
      options: [
        {
          value: 'beginner',
          label: 'Beginner',
          description: 'New to kayaking or less than 5 trips',
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
          description: 'Comfortable paddling, 5-20 trips',
        },
        {
          value: 'advanced',
          label: 'Advanced',
          description: 'Experienced, 20+ trips',
        },
      ],
    },
    {
      id: 'q3_use_case',
      text: 'What will you use the kayak for?',
      type: 'single_choice',
      responseKey: 'useCase',
      required: true,
      options: [
        {
          value: 'recreation',
          label: 'Recreational Paddling',
          description: 'Short trips, relaxing on the water',
        },
        {
          value: 'fishing',
          label: 'Fishing',
          description: 'Need stability and gear storage',
        },
        {
          value: 'touring',
          label: 'Touring/Camping',
          description: 'Long trips, multi-day adventures',
        },
        {
          value: 'fitness',
          label: 'Fitness & Speed',
          description: 'Exercise, covering distance quickly',
        },
      ],
    },
    {
      id: 'q4_storage',
      text: 'How will you transport and store it?',
      type: 'single_choice',
      responseKey: 'storage',
      required: true,
      options: [
        {
          value: 'car_roof',
          label: 'Car Roof Rack',
          description: 'Have roof rack, can lift 40-70 lbs',
        },
        {
          value: 'garage',
          label: 'Garage/Shed',
          description: 'Space for full-size kayak',
        },
        {
          value: 'limited_space',
          label: 'Limited Space',
          description: 'Apartment, need compact/inflatable',
        },
      ],
    },
    {
      id: 'q5_seating',
      text: 'How many people will paddle?',
      type: 'single_choice',
      responseKey: 'seating',
      required: true,
      options: [
        { value: 'single', label: 'Just Me', description: 'Solo paddling' },
        {
          value: 'tandem',
          label: '2 People',
          description: 'Paddle with partner/friend',
        },
        { value: 'flexible', label: 'Flexible', description: 'Both solo and tandem' },
      ],
    },
    {
      id: 'q6_budget',
      text: "What's your budget?",
      type: 'single_choice',
      responseKey: 'budget',
      required: true,
      options: [
        { value: 'budget', label: 'Under $400', description: 'Entry-level options' },
        { value: 'mid', label: '$400-$800', description: 'Good quality options' },
        { value: 'premium', label: '$800-$1,500', description: 'High-end features' },
        { value: 'luxury', label: '$1,500+', description: 'Best of the best' },
      ],
    },
  ],

  scoringConfig: {
    maxScore: 100,
    minScore: 30,

    rules: [
      // Water Type Matching
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

      // Experience Level Matching
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

      // Use Case Matching
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

      // Storage Matching
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

      // Seating Matching
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

      // Budget Matching
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
  },

  theme: {
    primaryColor: '#2563eb',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  resultsConfig: {
    showScores: true,
    maxResults: 5,
    ctaText: 'View on Amazon',
  },
};

/**
 * Example kayak products
 */
export const exampleKayaks = [
  {
    id: 'kayak-1',
    workspaceId: 'wks_kayak',
    name: 'Intex Explorer K2',
    brand: 'Intex',
    priceCents: 8999,
    imageUrl: 'https://via.placeholder.com/400?text=Intex+Explorer+K2',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B00177J4JS',
    },
    attributes: {
      type: 'inflatable',
      length: 10.3,
      weight: 30,
      capacity: 400,
      width: 36,
      stability: 9,
      speed: 4,
      tracking: 5,
      material: 'inflatable',
      seating: 'tandem',
      storage: 'Limited',
    },
  },
  {
    id: 'kayak-2',
    workspaceId: 'wks_kayak',
    name: 'Perception Pescador Pro 12',
    brand: 'Perception',
    priceCents: 94999,
    imageUrl: 'https://via.placeholder.com/400?text=Perception+Pescador+Pro',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B08KFCR9XL',
    },
    attributes: {
      type: 'fishing',
      length: 12,
      weight: 57,
      capacity: 375,
      width: 33,
      stability: 9,
      speed: 6,
      tracking: 7,
      material: 'polyethylene',
      seating: 'single',
      storage: 'Bow and stern tankwells',
    },
  },
  {
    id: 'kayak-3',
    workspaceId: 'wks_kayak',
    name: 'Wilderness Systems Pungo 120',
    brand: 'Wilderness Systems',
    priceCents: 129999,
    imageUrl: 'https://via.placeholder.com/400?text=Pungo+120',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B00MQX0YYE',
    },
    attributes: {
      type: 'recreational',
      length: 12,
      weight: 50,
      capacity: 325,
      width: 28,
      stability: 8,
      speed: 7,
      tracking: 8,
      material: 'polyethylene',
      seating: 'single',
      storage: 'Bow hatch',
    },
  },
  {
    id: 'kayak-4',
    workspaceId: 'wks_kayak',
    name: 'Current Designs Solara 135',
    brand: 'Current Designs',
    priceCents: 249999,
    imageUrl: 'https://via.placeholder.com/400?text=Solara+135',
    affiliateUrls: {
      rei: 'https://www.rei.com/product/...',
    },
    attributes: {
      type: 'touring',
      length: 13.5,
      weight: 48,
      capacity: 350,
      width: 24,
      stability: 6,
      speed: 9,
      tracking: 9,
      material: 'thermoform',
      seating: 'single',
      storage: 'Bow and stern hatches',
    },
  },
];
