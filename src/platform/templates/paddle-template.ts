/**
 * Pickleball Paddle Finder Template
 *
 * Complete template for paddle recommendation quiz.
 * Based on the proven paddle quiz that's been validated with live testing.
 */

import { QuizTemplate } from './types';
import { paddleScoringConfig } from '../adapters/paddle-scoring-config';

export const paddleTemplate: QuizTemplate = {
  metadata: {
    id: 'template_paddle_finder',
    name: 'Pickleball Paddle Finder',
    slug: 'paddle-finder',
    description:
      'Help customers find the perfect pickleball paddle based on their play style, experience level, and preferences. Includes power/control ratings, weight preferences, and budget matching.',
    category: 'sports_equipment',
    productType: 'paddle',
    estimatedCompletionTime: 120, // 2 minutes
    typicalQuestionCount: 7,
    typicalProductCount: 50,
    previewImage: '/templates/paddle-finder-preview.png',
    version: '1.0.0',
    lastUpdated: '2026-01-29',
  },

  questions: [
    {
      id: 'q1_experience',
      text: 'What is your skill level?',
      type: 'single_choice',
      responseKey: 'experience',
      required: true,
      options: [
        {
          value: 'beginner',
          label: 'Beginner',
          description: 'Just starting out, learning the basics',
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
          description: 'Comfortable with fundamentals, developing strategy',
        },
        {
          value: 'advanced',
          label: 'Advanced',
          description: 'Competitive player with refined technique',
        },
      ],
    },

    {
      id: 'q2_play_style',
      text: 'What is your preferred play style?',
      type: 'single_choice',
      responseKey: 'playStyle',
      required: true,
      options: [
        {
          value: 'power',
          label: 'Power',
          description: 'Aggressive drives and serves, hard hits',
        },
        {
          value: 'control',
          label: 'Control',
          description: 'Precise placement, dinks, and finesse',
        },
        {
          value: 'balanced',
          label: 'Balanced',
          description: 'Mix of power and control',
        },
      ],
    },

    {
      id: 'q3_shot_preference',
      text: 'Which shots do you focus on most?',
      type: 'multiple_choice',
      responseKey: 'shot_preference',
      required: false,
      options: [
        {
          value: 'drives',
          label: 'Drives',
          description: 'Hard groundstrokes from the baseline',
        },
        {
          value: 'serves',
          label: 'Serves',
          description: 'Powerful serves',
        },
        {
          value: 'dinks',
          label: 'Dinks',
          description: 'Soft shots at the net',
        },
        {
          value: 'volleys',
          label: 'Volleys',
          description: 'Quick exchanges at the net',
        },
        {
          value: 'lobs',
          label: 'Lobs',
          description: 'High arcing shots',
        },
      ],
    },

    {
      id: 'q4_weight',
      text: 'What paddle weight do you prefer?',
      type: 'single_choice',
      responseKey: 'weightPreference',
      required: true,
      options: [
        {
          value: 'light',
          label: 'Lightweight',
          description: '7.0-7.5 oz - Quick reactions, less power',
        },
        {
          value: 'medium',
          label: 'Medium',
          description: '7.5-8.5 oz - Balanced feel',
        },
        {
          value: 'heavy',
          label: 'Heavyweight',
          description: '8.5+ oz - More power, more control',
        },
      ],
    },

    {
      id: 'q5_shape',
      text: 'What paddle shape interests you?',
      type: 'single_choice',
      responseKey: 'shapePreference',
      required: false,
      options: [
        {
          value: 'standard',
          label: 'Standard',
          description: 'Traditional shape, balanced sweet spot',
        },
        {
          value: 'elongated',
          label: 'Elongated',
          description: 'Extended reach and more power',
        },
        {
          value: 'widebody',
          label: 'Wide Body',
          description: 'Larger sweet spot, more forgiving',
        },
      ],
    },

    {
      id: 'q6_spin',
      text: 'How important is spin to your game?',
      type: 'single_choice',
      responseKey: 'spinPreference',
      required: false,
      options: [
        {
          value: 'low',
          label: 'Not Important',
          description: 'I focus on other aspects',
        },
        {
          value: 'medium',
          label: 'Somewhat Important',
          description: 'Nice to have, but not critical',
        },
        {
          value: 'high',
          label: 'Very Important',
          description: 'I rely on spin for my game',
        },
      ],
    },

    {
      id: 'q7_budget',
      text: 'What is your budget?',
      type: 'single_choice',
      responseKey: 'budget',
      required: true,
      options: [
        {
          value: 'budget',
          label: 'Under $100',
          description: 'Entry-level options',
        },
        {
          value: 'mid_range',
          label: '$100-$150',
          description: 'Solid mid-range quality',
        },
        {
          value: 'premium',
          label: '$150+',
          description: 'Premium, high-performance paddles',
        },
      ],
    },
  ],

  scoringConfig: paddleScoringConfig,

  productSchema: [
    {
      key: 'powerRating',
      label: 'Power Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      description: 'How much power the paddle generates (1-10)',
    },
    {
      key: 'controlRating',
      label: 'Control Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      description: 'How much control the paddle provides (1-10)',
    },
    {
      key: 'spinRating',
      label: 'Spin Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      description: 'How much spin the paddle can generate (1-10)',
    },
    {
      key: 'weightOz',
      label: 'Weight',
      type: 'number',
      required: true,
      min: 6.0,
      max: 10.0,
      unit: 'oz',
      description: 'Paddle weight in ounces',
    },
    {
      key: 'shape',
      label: 'Shape',
      type: 'enum',
      required: false,
      enum: ['standard', 'elongated', 'widebody'],
      description: 'Paddle shape type',
    },
    {
      key: 'sweetSpotSize',
      label: 'Sweet Spot Size',
      type: 'enum',
      required: false,
      enum: ['small', 'medium', 'large'],
      description: 'Size of the optimal hitting area',
    },
    {
      key: 'coreMaterial',
      label: 'Core Material',
      type: 'string',
      required: false,
      description: 'Material used for paddle core (e.g., Polymer, Nomex)',
    },
    {
      key: 'faceMaterial',
      label: 'Face Material',
      type: 'string',
      required: false,
      description: 'Material used for paddle face (e.g., Carbon Fiber, Fiberglass)',
    },
    {
      key: 'gripLength',
      label: 'Grip Length',
      type: 'number',
      required: false,
      min: 4.0,
      max: 6.0,
      unit: 'inches',
      description: 'Length of the paddle handle',
    },
  ],

  defaultTheme: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#06b6d4',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  sampleProducts: [
    {
      name: 'Selkirk Vanguard Power Air Invikta',
      brand: 'Selkirk',
      priceCents: 16995,
      attributes: {
        powerRating: 9,
        controlRating: 7,
        spinRating: 8,
        weightOz: 8.0,
        shape: 'elongated',
        sweetSpotSize: 'medium',
        coreMaterial: 'Polymer',
        faceMaterial: 'Carbon Fiber',
        gripLength: 5.25,
      },
    },
    {
      name: 'JOOLA Ben Johns Hyperion CFS 16',
      brand: 'JOOLA',
      priceCents: 21995,
      attributes: {
        powerRating: 8,
        controlRating: 9,
        spinRating: 10,
        weightOz: 8.3,
        shape: 'standard',
        sweetSpotSize: 'large',
        coreMaterial: 'Reactive Polymer',
        faceMaterial: 'Carbon Friction Surface',
        gripLength: 5.5,
      },
    },
    {
      name: 'Paddletek Tempest Wave Pro',
      brand: 'Paddletek',
      priceCents: 13995,
      attributes: {
        powerRating: 7,
        controlRating: 8,
        spinRating: 7,
        weightOz: 7.8,
        shape: 'widebody',
        sweetSpotSize: 'large',
        coreMaterial: 'Polymer',
        faceMaterial: 'Graphite',
        gripLength: 4.25,
      },
    },
  ],

  customizationGuide: {
    questionsToReview: [
      'q2_play_style',
      'q7_budget',
    ],
    requiredBrandingAssets: [
      'logo',
      'primary_color',
      'subdomain',
    ],
    typicalSetupTime: 45, // minutes
  },
};
