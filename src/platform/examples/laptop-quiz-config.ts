/**
 * Example: Laptop Recommendation Quiz Configuration
 *
 * This demonstrates how the generic platform would be configured
 * for a laptop recommendation quiz.
 */

import { QuizConfig, WorkspaceConfig } from '../core/engine/types';

/**
 * Workspace configuration for laptop vertical
 */
export const laptopWorkspace: WorkspaceConfig = {
  id: 'wks_laptop',
  name: 'Laptop Finder',
  slug: 'laptop-finder',
  productType: 'laptop',

  // Define laptop-specific attributes
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
    },
    {
      key: 'processor',
      label: 'Processor',
      type: 'string',
      description: 'e.g., "Intel Core i7-13700H", "AMD Ryzen 7 7840U"',
    },
    {
      key: 'processorGeneration',
      label: 'Processor Generation',
      type: 'number',
      description: 'Intel 13th gen, AMD 7000 series, etc.',
    },
    {
      key: 'ram',
      label: 'RAM',
      type: 'number',
      unit: 'GB',
      min: 4,
      max: 128,
    },
    {
      key: 'storage',
      label: 'Storage',
      type: 'number',
      unit: 'GB',
      min: 128,
      max: 4096,
    },
    {
      key: 'storageType',
      label: 'Storage Type',
      type: 'enum',
      enum: ['ssd', 'nvme', 'hdd', 'hybrid'],
    },
    {
      key: 'screenSize',
      label: 'Screen Size',
      type: 'number',
      unit: 'inches',
      min: 11,
      max: 18,
    },
    {
      key: 'resolution',
      label: 'Resolution',
      type: 'enum',
      enum: ['1080p', '1440p', '4K', '1200p'],
    },
    {
      key: 'refreshRate',
      label: 'Refresh Rate',
      type: 'number',
      unit: 'Hz',
      min: 60,
      max: 360,
    },
    {
      key: 'gpu',
      label: 'GPU',
      type: 'string',
      description: 'e.g., "NVIDIA RTX 4060", "Integrated"',
    },
    {
      key: 'gpuTier',
      label: 'GPU Tier',
      type: 'enum',
      enum: ['integrated', 'entry', 'mid', 'high', 'ultra'],
    },
    {
      key: 'batteryLife',
      label: 'Battery Life',
      type: 'number',
      unit: 'hours',
      min: 3,
      max: 20,
    },
    {
      key: 'weight',
      label: 'Weight',
      type: 'number',
      unit: 'lbs',
      min: 2,
      max: 8,
    },
    {
      key: 'portability',
      label: 'Portability Rating',
      type: 'number',
      min: 1,
      max: 10,
      description: '1 = Desktop replacement, 10 = Ultra-portable',
    },
    {
      key: 'build',
      label: 'Build Quality',
      type: 'enum',
      enum: ['plastic', 'aluminum', 'magnesium', 'carbon-fiber'],
    },
    {
      key: 'os',
      label: 'Operating System',
      type: 'enum',
      enum: ['windows', 'macos', 'chromeos', 'linux'],
    },
  ],

  affiliateNetworks: ['amazon', 'bestbuy', 'newegg', 'direct'],
};

/**
 * Laptop quiz configuration
 */
export const laptopQuiz: QuizConfig = {
  id: 'quiz_laptop_finder',
  workspaceId: 'wks_laptop',
  name: 'Find Your Perfect Laptop',
  slug: 'find-your-laptop',

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
          icon: '💻',
        },
        {
          value: 'work',
          label: 'Business/Work',
          description: 'Office apps, video calls, multitasking',
          icon: '💼',
        },
        {
          value: 'creative',
          label: 'Creative Work',
          description: 'Photo/video editing, design, 3D',
          icon: '🎨',
        },
        {
          value: 'gaming',
          label: 'Gaming',
          description: 'Play modern games at high settings',
          icon: '🎮',
        },
        {
          value: 'programming',
          label: 'Programming/Development',
          description: 'Coding, VMs, compile large projects',
          icon: '👨‍💻',
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
        { value: 'balanced', label: '14-15"', description: 'Good balance of size and portability' },
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
        { value: 'mid_low', label: '$500-$800', description: 'Good value' },
        { value: 'mid', label: '$800-$1,200', description: 'Solid performance' },
        { value: 'premium', label: '$1,200-$2,000', description: 'High-end features' },
        { value: 'luxury', label: '$2,000+', description: 'Best available' },
      ],
    },
  ],

  scoringConfig: {
    maxScore: 100,
    minScore: 25,

    rules: [
      // Use Case Matching
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

      // Portability Matching
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

      // Battery Life Matching
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

      // Screen Size Matching
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

      // Performance Matching
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

      // Budget Matching
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
  },

  theme: {
    primaryColor: '#6366f1',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  resultsConfig: {
    showScores: true,
    maxResults: 5,
    ctaText: 'Check Price',
  },
};

/**
 * Example laptop products
 */
export const exampleLaptops = [
  {
    id: 'laptop-1',
    workspaceId: 'wks_laptop',
    name: 'Acer Chromebook 314',
    brand: 'Acer',
    priceCents: 29999,
    imageUrl: 'https://via.placeholder.com/400?text=Acer+Chromebook+314',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B0858MBN2V',
    },
    attributes: {
      category: 'chromebook',
      processor: 'Intel Celeron N4020',
      processorGeneration: 10,
      ram: 4,
      storage: 64,
      storageType: 'nvme',
      screenSize: 14,
      resolution: '1080p',
      refreshRate: 60,
      gpu: 'Integrated',
      gpuTier: 'integrated',
      batteryLife: 12,
      weight: 3.2,
      portability: 8,
      build: 'plastic',
      os: 'chromeos',
    },
  },
  {
    id: 'laptop-2',
    workspaceId: 'wks_laptop',
    name: 'Dell XPS 13 Plus',
    brand: 'Dell',
    priceCents: 139999,
    imageUrl: 'https://via.placeholder.com/400?text=Dell+XPS+13+Plus',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B0BRJM7W2F',
    },
    attributes: {
      category: 'ultraportable',
      processor: 'Intel Core i7-1360P',
      processorGeneration: 13,
      ram: 16,
      storage: 512,
      storageType: 'nvme',
      screenSize: 13.4,
      resolution: '1200p',
      refreshRate: 60,
      gpu: 'Intel Iris Xe',
      gpuTier: 'integrated',
      batteryLife: 10,
      weight: 2.7,
      portability: 9,
      build: 'aluminum',
      os: 'windows',
    },
  },
  {
    id: 'laptop-3',
    workspaceId: 'wks_laptop',
    name: 'ASUS ROG Strix G16',
    brand: 'ASUS',
    priceCents: 179999,
    imageUrl: 'https://via.placeholder.com/400?text=ASUS+ROG+Strix',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B0BW7BXC9B',
    },
    attributes: {
      category: 'gaming',
      processor: 'Intel Core i7-13650HX',
      processorGeneration: 13,
      ram: 16,
      storage: 1024,
      storageType: 'nvme',
      screenSize: 16,
      resolution: '1080p',
      refreshRate: 165,
      gpu: 'NVIDIA RTX 4060',
      gpuTier: 'high',
      batteryLife: 5,
      weight: 5.5,
      portability: 4,
      build: 'plastic',
      os: 'windows',
    },
  },
  {
    id: 'laptop-4',
    workspaceId: 'wks_laptop',
    name: 'MacBook Pro 14"',
    brand: 'Apple',
    priceCents: 249999,
    imageUrl: 'https://via.placeholder.com/400?text=MacBook+Pro+14',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B0CM5M8PF7',
    },
    attributes: {
      category: 'workstation',
      processor: 'Apple M3 Pro',
      processorGeneration: 3,
      ram: 18,
      storage: 512,
      storageType: 'nvme',
      screenSize: 14.2,
      resolution: '1440p',
      refreshRate: 120,
      gpu: 'Apple M3 Pro GPU',
      gpuTier: 'high',
      batteryLife: 18,
      weight: 3.5,
      portability: 7,
      build: 'aluminum',
      os: 'macos',
    },
  },
  {
    id: 'laptop-5',
    workspaceId: 'wks_laptop',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    priceCents: 159999,
    imageUrl: 'https://via.placeholder.com/400?text=ThinkPad+X1',
    affiliateUrls: {
      amazon: 'https://www.amazon.com/dp/B0C1PX63JC',
    },
    attributes: {
      category: 'business',
      processor: 'Intel Core i7-1365U',
      processorGeneration: 13,
      ram: 16,
      storage: 512,
      storageType: 'nvme',
      screenSize: 14,
      resolution: '1200p',
      refreshRate: 60,
      gpu: 'Intel Iris Xe',
      gpuTier: 'integrated',
      batteryLife: 12,
      weight: 2.48,
      portability: 9,
      build: 'carbon-fiber',
      os: 'windows',
    },
  },
];
