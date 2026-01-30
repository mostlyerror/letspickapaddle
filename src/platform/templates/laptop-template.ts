/**
 * Laptop Finder Template
 *
 * Complete template for laptop recommendation quiz.
 * Covers use cases, portability, battery, screen size, and performance.
 */

import { QuizTemplate } from './types';
import { laptopScoringConfig } from '../adapters/laptop-scoring-config';

export const laptopTemplate: QuizTemplate = {
  metadata: {
    id: 'template_laptop_finder',
    name: 'Laptop Finder',
    slug: 'laptop-finder',
    description:
      'Help customers find the perfect laptop based on use case (work, gaming, creative, programming), portability needs, battery life requirements, and budget. Includes RAM, storage, screen size, and GPU matching.',
    category: 'electronics',
    productType: 'laptop',
    estimatedCompletionTime: 120, // 2 minutes
    typicalQuestionCount: 6,
    typicalProductCount: 40,
    previewImage: '/templates/laptop-finder-preview.png',
    version: '1.0.0',
    lastUpdated: '2026-01-29',
  },

  questions: [
    {
      id: 'q1_use_case',
      text: 'What will you primarily use this laptop for?',
      type: 'single_choice',
      responseKey: 'useCase',
      required: true,
      options: [
        {
          value: 'everyday',
          label: 'Everyday Use',
          description: 'Web, email, videos, documents',
        },
        {
          value: 'work',
          label: 'Business/Work',
          description: 'Office apps, video calls, multitasking',
        },
        {
          value: 'creative',
          label: 'Creative Work',
          description: 'Photo/video editing, design, 3D',
        },
        {
          value: 'gaming',
          label: 'Gaming',
          description: 'Play modern games at high settings',
        },
        {
          value: 'programming',
          label: 'Programming/Development',
          description: 'Coding, VMs, compile large projects',
        },
      ],
    },

    {
      id: 'q2_portability',
      text: 'How important is portability?',
      type: 'single_choice',
      responseKey: 'portability',
      required: true,
      options: [
        {
          value: 'very',
          label: 'Very Important',
          description: 'Travel often, carry daily (under 3 lbs)',
        },
        {
          value: 'somewhat',
          label: 'Somewhat Important',
          description: 'Occasional travel (3-5 lbs)',
        },
        {
          value: 'not',
          label: 'Not Important',
          description: 'Mostly stationary, performance matters more',
        },
      ],
    },

    {
      id: 'q3_battery',
      text: 'How long do you need the battery to last?',
      type: 'single_choice',
      responseKey: 'batteryNeeds',
      required: true,
      options: [
        {
          value: 'all_day',
          label: 'All Day (10+ hours)',
          description: 'Need to work unplugged all day',
        },
        {
          value: 'half_day',
          label: 'Half Day (6-10 hours)',
          description: 'A few hours between charges',
        },
        {
          value: 'plugged_in',
          label: 'Usually Plugged In',
          description: 'Battery life not critical',
        },
      ],
    },

    {
      id: 'q4_screen',
      text: 'What screen size do you prefer?',
      type: 'single_choice',
      responseKey: 'screenSize',
      required: true,
      options: [
        {
          value: 'compact',
          label: '13" or smaller',
          description: 'Ultra-portable, easy to carry',
        },
        {
          value: 'balanced',
          label: '14-15"',
          description: 'Good balance of size and portability',
        },
        {
          value: 'large',
          label: '16" or larger',
          description: 'More screen real estate, less portable',
        },
      ],
    },

    {
      id: 'q5_performance',
      text: 'How much performance do you need?',
      type: 'single_choice',
      responseKey: 'performance',
      required: true,
      options: [
        {
          value: 'basic',
          label: 'Basic',
          description: 'Web browsing, streaming, documents',
        },
        {
          value: 'medium',
          label: 'Medium',
          description: 'Multitasking, some photo editing',
        },
        {
          value: 'high',
          label: 'High',
          description: 'Video editing, CAD, intensive apps',
        },
        {
          value: 'extreme',
          label: 'Extreme',
          description: 'Gaming, 3D rendering, AI/ML',
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
        { value: 'budget', label: 'Under $500', description: 'Budget options' },
        {
          value: 'mid_low',
          label: '$500-$800',
          description: 'Good value',
        },
        {
          value: 'mid',
          label: '$800-$1,200',
          description: 'Solid performance',
        },
        {
          value: 'premium',
          label: '$1,200-$2,000',
          description: 'High-end features',
        },
        { value: 'luxury', label: '$2,000+', description: 'Best available' },
      ],
    },
  ],

  scoringConfig: laptopScoringConfig,

  productSchema: [
    {
      key: 'category',
      label: 'Category',
      type: 'enum',
      enum: [
        'ultraportable',
        'business',
        'gaming',
        'workstation',
        'chromebook',
        '2-in-1',
      ],
      required: true,
      description: 'Laptop category',
    },
    {
      key: 'processor',
      label: 'Processor',
      type: 'string',
      required: false,
      description: 'e.g., "Intel Core i7-13700H", "AMD Ryzen 7 7840U"',
    },
    {
      key: 'ram',
      label: 'RAM',
      type: 'number',
      required: true,
      min: 4,
      max: 128,
      unit: 'GB',
      description: 'System memory',
    },
    {
      key: 'storage',
      label: 'Storage',
      type: 'number',
      required: true,
      min: 128,
      max: 4096,
      unit: 'GB',
      description: 'Storage capacity',
    },
    {
      key: 'storageType',
      label: 'Storage Type',
      type: 'enum',
      required: false,
      enum: ['ssd', 'nvme', 'hdd', 'hybrid'],
      description: 'Storage technology',
    },
    {
      key: 'screenSize',
      label: 'Screen Size',
      type: 'number',
      required: true,
      min: 11,
      max: 18,
      unit: 'inches',
      description: 'Display size in inches',
    },
    {
      key: 'resolution',
      label: 'Resolution',
      type: 'enum',
      required: false,
      enum: ['1080p', '1440p', '4K', '1200p'],
      description: 'Display resolution',
    },
    {
      key: 'refreshRate',
      label: 'Refresh Rate',
      type: 'number',
      required: false,
      min: 60,
      max: 360,
      unit: 'Hz',
      description: 'Display refresh rate',
    },
    {
      key: 'gpuTier',
      label: 'GPU Tier',
      type: 'enum',
      required: false,
      enum: ['integrated', 'entry', 'mid', 'high', 'ultra'],
      description: 'Graphics performance tier',
    },
    {
      key: 'batteryLife',
      label: 'Battery Life',
      type: 'number',
      required: true,
      min: 3,
      max: 20,
      unit: 'hours',
      description: 'Typical battery life',
    },
    {
      key: 'weight',
      label: 'Weight',
      type: 'number',
      required: true,
      min: 2,
      max: 8,
      unit: 'lbs',
      description: 'Laptop weight in pounds',
    },
    {
      key: 'portability',
      label: 'Portability Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      description: '1 = Desktop replacement, 10 = Ultra-portable',
    },
    {
      key: 'os',
      label: 'Operating System',
      type: 'enum',
      required: false,
      enum: ['windows', 'macos', 'chromeos', 'linux'],
      description: 'Operating system',
    },
  ],

  defaultTheme: {
    primaryColor: '#6366f1',
    secondaryColor: '#818cf8',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  sampleProducts: [
    {
      name: 'Acer Chromebook 314',
      brand: 'Acer',
      priceCents: 29999,
      attributes: {
        category: 'chromebook',
        processor: 'Intel Celeron N4020',
        ram: 4,
        storage: 64,
        storageType: 'nvme',
        screenSize: 14,
        resolution: '1080p',
        refreshRate: 60,
        gpuTier: 'integrated',
        batteryLife: 12,
        weight: 3.2,
        portability: 8,
        os: 'chromeos',
      },
    },
    {
      name: 'Dell XPS 13 Plus',
      brand: 'Dell',
      priceCents: 139999,
      attributes: {
        category: 'ultraportable',
        processor: 'Intel Core i7-1360P',
        ram: 16,
        storage: 512,
        storageType: 'nvme',
        screenSize: 13.4,
        resolution: '1200p',
        refreshRate: 60,
        gpuTier: 'integrated',
        batteryLife: 10,
        weight: 2.7,
        portability: 9,
        os: 'windows',
      },
    },
    {
      name: 'ASUS ROG Strix G16',
      brand: 'ASUS',
      priceCents: 179999,
      attributes: {
        category: 'gaming',
        processor: 'Intel Core i7-13650HX',
        ram: 16,
        storage: 1024,
        storageType: 'nvme',
        screenSize: 16,
        resolution: '1080p',
        refreshRate: 165,
        gpuTier: 'high',
        batteryLife: 5,
        weight: 5.5,
        portability: 4,
        os: 'windows',
      },
    },
    {
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      priceCents: 249999,
      attributes: {
        category: 'workstation',
        processor: 'Apple M3 Pro',
        ram: 18,
        storage: 512,
        storageType: 'nvme',
        screenSize: 14.2,
        resolution: '1440p',
        refreshRate: 120,
        gpuTier: 'high',
        batteryLife: 18,
        weight: 3.5,
        portability: 7,
        os: 'macos',
      },
    },
  ],

  customizationGuide: {
    questionsToReview: ['q1_use_case', 'q6_budget'],
    requiredBrandingAssets: ['logo', 'primary_color', 'subdomain'],
    typicalSetupTime: 50, // minutes
  },
};
