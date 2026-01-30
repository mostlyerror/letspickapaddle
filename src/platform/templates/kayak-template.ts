/**
 * Kayak Finder Template
 *
 * Complete template for kayak recommendation quiz.
 * Covers water types, experience levels, use cases, and storage needs.
 */

import { QuizTemplate } from './types';
import { kayakScoringConfig } from '../adapters/kayak-scoring-config';

export const kayakTemplate: QuizTemplate = {
  metadata: {
    id: 'template_kayak_finder',
    name: 'Kayak Finder',
    slug: 'kayak-finder',
    description:
      'Help customers find the perfect kayak based on water type, experience level, intended use, and storage needs. Includes stability ratings, speed ratings, and material types.',
    category: 'outdoor_gear',
    productType: 'kayak',
    estimatedCompletionTime: 120, // 2 minutes
    typicalQuestionCount: 6,
    typicalProductCount: 30,
    previewImage: '/templates/kayak-finder-preview.png',
    version: '1.0.0',
    lastUpdated: '2026-01-29',
  },

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
        },
        {
          value: 'rivers_streams',
          label: 'Rivers & Streams',
          description: 'Flowing water, some current',
        },
        {
          value: 'ocean_coastal',
          label: 'Ocean & Coastal',
          description: 'Saltwater, waves, longer trips',
        },
        {
          value: 'whitewater',
          label: 'Whitewater Rapids',
          description: 'Fast-moving water, technical paddling',
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
        {
          value: 'flexible',
          label: 'Flexible',
          description: 'Both solo and tandem',
        },
      ],
    },

    {
      id: 'q6_budget',
      text: "What's your budget?",
      type: 'single_choice',
      responseKey: 'budget',
      required: true,
      options: [
        {
          value: 'budget',
          label: 'Under $400',
          description: 'Entry-level options',
        },
        {
          value: 'mid',
          label: '$400-$800',
          description: 'Good quality options',
        },
        {
          value: 'premium',
          label: '$800-$1,500',
          description: 'High-end features',
        },
        { value: 'luxury', label: '$1,500+', description: 'Best of the best' },
      ],
    },
  ],

  scoringConfig: kayakScoringConfig,

  productSchema: [
    {
      key: 'type',
      label: 'Kayak Type',
      type: 'enum',
      enum: [
        'recreational',
        'touring',
        'fishing',
        'whitewater',
        'inflatable',
      ],
      required: true,
      description: 'Primary kayak category',
    },
    {
      key: 'length',
      label: 'Length',
      type: 'number',
      required: true,
      min: 6,
      max: 18,
      unit: 'feet',
      description: 'Kayak length in feet',
    },
    {
      key: 'weight',
      label: 'Weight',
      type: 'number',
      required: true,
      min: 20,
      max: 100,
      unit: 'lbs',
      description: 'Kayak weight in pounds',
    },
    {
      key: 'capacity',
      label: 'Weight Capacity',
      type: 'number',
      required: false,
      min: 200,
      max: 500,
      unit: 'lbs',
      description: 'Maximum load capacity',
    },
    {
      key: 'width',
      label: 'Width',
      type: 'number',
      required: false,
      min: 20,
      max: 36,
      unit: 'inches',
      description: 'Kayak width in inches',
    },
    {
      key: 'stability',
      label: 'Stability Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      description: '1 = Tippy/Advanced, 10 = Very Stable/Beginner-friendly',
    },
    {
      key: 'speed',
      label: 'Speed Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      description: '1 = Slow, 10 = Fast',
    },
    {
      key: 'tracking',
      label: 'Tracking Rating',
      type: 'number',
      required: false,
      min: 1,
      max: 10,
      description: 'How well it goes straight (1-10)',
    },
    {
      key: 'material',
      label: 'Material',
      type: 'enum',
      required: false,
      enum: ['polyethylene', 'composite', 'inflatable', 'thermoform'],
      description: 'Construction material',
    },
    {
      key: 'seating',
      label: 'Seating Capacity',
      type: 'enum',
      required: true,
      enum: ['single', 'tandem', 'triple'],
      description: 'Number of paddlers',
    },
    {
      key: 'storage',
      label: 'Storage Type',
      type: 'string',
      required: false,
      description: 'e.g., "Bow and stern hatches", "Open cockpit"',
    },
  ],

  defaultTheme: {
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  sampleProducts: [
    {
      name: 'Intex Explorer K2',
      brand: 'Intex',
      priceCents: 8999,
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
      name: 'Perception Pescador Pro 12',
      brand: 'Perception',
      priceCents: 94999,
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
      name: 'Wilderness Systems Pungo 120',
      brand: 'Wilderness Systems',
      priceCents: 129999,
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
      name: 'Current Designs Solara 135',
      brand: 'Current Designs',
      priceCents: 249999,
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
  ],

  customizationGuide: {
    questionsToReview: ['q1_water_type', 'q6_budget'],
    requiredBrandingAssets: ['logo', 'primary_color', 'subdomain'],
    typicalSetupTime: 40, // minutes
  },
};
