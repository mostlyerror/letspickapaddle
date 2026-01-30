# Quiz Template System

Complete template system for rapid quiz creation and deployment.

## Overview

The template system allows you to:
- Package quiz configurations as reusable templates
- Rapidly deploy quizzes for new clients
- Customize quizzes with client branding
- Maintain consistency across deployments
- Estimate setup effort and costs

## Architecture

```
templates/
├── types.ts                     # TypeScript interfaces
├── registry.ts                  # Template registry and management
├── instantiation-service.ts     # Template instantiation logic
├── paddle-template.ts           # Example: Paddle finder template
├── demo.ts                      # Demo and testing
├── index.ts                     # Public exports
└── README.md                    # This file
```

## Template Structure

Each template includes:

1. **Metadata** - Name, description, category, version
2. **Questions** - Quiz questions with default text
3. **Scoring Config** - Pre-configured scoring rules
4. **Product Schema** - Required product attributes
5. **Default Theme** - Colors, fonts, button styles
6. **Sample Products** - Example products for testing
7. **Customization Guide** - Setup hints and requirements

## Usage

### 1. List Available Templates

```typescript
import { templateRegistry } from '@/platform/templates';

const templates = templateRegistry.getRegistryEntries();
templates.forEach(template => {
  console.log(`${template.name} - ${template.estimatedSetupTime} min`);
});
```

### 2. Get Template Details

```typescript
const template = templateRegistry.getTemplate('template_paddle_finder');
console.log(template.metadata.name);
console.log(template.questions.length);
console.log(template.scoringConfig.rules.length);
```

### 3. Validate Template

```typescript
const validation = templateRegistry.validateTemplate('template_paddle_finder');
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

### 4. Instantiate for Client

```typescript
import { templateInstantiationService } from '@/platform/templates';

const result = await templateInstantiationService.instantiate({
  templateId: 'template_paddle_finder',
  clientId: 'client_acme',
  customQuizName: 'ACME Paddle Finder',
  themeOverrides: {
    primaryColor: '#FF6B35',
  },
  subdomain: 'acme-sports',
});

console.log(result.quizUrl);        // https://acme-sports.quizplatform.com
console.log(result.embedCode);      // <script>...</script>
```

### 5. Estimate Setup Effort

```typescript
const effort = templateInstantiationService.estimateSetupEffort(
  'template_paddle_finder',
  50  // number of products
);

console.log(`Total setup time: ${effort.total} minutes`);
// Output: Total setup time: 135 minutes (2.3 hours)
```

### 6. Generate Onboarding Checklist

```typescript
const checklist = templateInstantiationService.generateOnboardingChecklist(
  'template_paddle_finder'
);

checklist.steps.forEach(step => {
  console.log(`${step.step} - ${step.estimatedTime} min`);
});
```

## Running the Demo

```bash
npx tsx src/platform/templates/demo.ts
```

The demo shows:
- Available templates
- Template details and structure
- Validation process
- Setup effort estimation
- Onboarding checklist generation
- Template instantiation

## Creating New Templates

### Step 1: Define Scoring Config

Create scoring configuration with rules that match your product attributes:

```typescript
// src/platform/adapters/kayak-scoring-config.ts
export const kayakScoringConfig: ScoringConfig = {
  maxScore: 100,
  minScore: 20,
  rules: [
    {
      id: 'stability_beginner',
      type: 'threshold',
      responseKey: 'experience',
      productAttribute: 'stabilityRating',
      logic: {
        condition: { value: 'beginner' },
        threshold: 8,
        weight: 25,
      },
      reasoning: 'High stability great for beginners',
    },
    // ... more rules
  ],
};
```

### Step 2: Create Template

```typescript
// src/platform/templates/kayak-template.ts
export const kayakTemplate: QuizTemplate = {
  metadata: {
    id: 'template_kayak_finder',
    name: 'Kayak Finder',
    slug: 'kayak-finder',
    description: 'Help customers find the perfect kayak...',
    category: 'outdoor_gear',
    productType: 'kayak',
    estimatedCompletionTime: 120,
    typicalQuestionCount: 6,
    typicalProductCount: 30,
    version: '1.0.0',
    lastUpdated: '2026-01-29',
  },

  questions: [
    {
      id: 'q1_water_type',
      text: 'What type of water will you paddle?',
      type: 'single_choice',
      responseKey: 'waterType',
      required: true,
      options: [
        { value: 'calm', label: 'Calm lakes/ponds' },
        { value: 'river', label: 'Rivers with current' },
        { value: 'ocean', label: 'Ocean/coastal waters' },
      ],
    },
    // ... more questions
  ],

  scoringConfig: kayakScoringConfig,

  productSchema: [
    {
      key: 'stabilityRating',
      label: 'Stability Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
    },
    // ... more attributes
  ],

  defaultTheme: {
    primaryColor: '#10b981',
    fontFamily: 'Inter, sans-serif',
    buttonStyle: 'rounded',
  },

  sampleProducts: [
    {
      name: 'Perception Pescador Pro',
      brand: 'Perception',
      priceCents: 89900,
      attributes: {
        stabilityRating: 9,
        length: 12,
        type: 'sit-on-top',
      },
    },
  ],

  customizationGuide: {
    questionsToReview: ['q1_water_type', 'q6_budget'],
    requiredBrandingAssets: ['logo', 'primary_color', 'subdomain'],
    typicalSetupTime: 40,
  },
};
```

### Step 3: Register Template

Add to registry:

```typescript
// src/platform/templates/registry.ts
import { kayakTemplate } from './kayak-template';

const templates: QuizTemplate[] = [
  paddleTemplate,
  kayakTemplate,  // Add new template here
];
```

### Step 4: Validate

```bash
npx tsx src/platform/templates/demo.ts
```

Check for validation errors and fix any issues.

## Template Categories

- `sports_equipment` - Paddles, rackets, clubs, etc.
- `outdoor_gear` - Kayaks, tents, backpacks, etc.
- `electronics` - Laptops, phones, headphones, etc.
- `health_wellness` - Supplements, fitness equipment, etc.
- `home_goods` - Appliances, furniture, decor, etc.
- `fashion` - Clothing, shoes, accessories, etc.
- `services` - Software, subscriptions, services, etc.

## Best Practices

### 1. Keep Questions Focused

- 5-7 questions is optimal
- Each question should be clear and specific
- Use descriptions to help users understand options

### 2. Balance Scoring Rules

- Total weight should add up to 100 across all rules
- Critical attributes (e.g., budget, experience) get higher weights (20-25)
- Nice-to-have attributes get lower weights (8-12)

### 3. Product Schema

- Mark critical attributes as `required: true`
- Use enums for categorical data
- Include units for numeric attributes
- Add descriptions for clarity

### 4. Sample Products

- Include 3-5 diverse products
- Cover different price points
- Show range of attributes
- Use real product examples

### 5. Customization Guide

- List questions that commonly need tweaking
- Specify required branding assets
- Estimate realistic setup times

## Template Versioning

Templates use semantic versioning:

- **Major** (1.x.x) - Breaking changes to schema or scoring logic
- **Minor** (x.1.x) - New questions or rules added
- **Patch** (x.x.1) - Bug fixes, text updates

Track version in `metadata.version` and `metadata.lastUpdated`.

## Service Model Integration

Templates are designed for the quiz generation service model:

1. **Client Discovery Call** - Understand needs
2. **Template Selection** - Choose best-fit template
3. **Customization** - Apply branding, tweak questions
4. **Product Import** - Upload product catalog
5. **Testing** - Validate recommendations
6. **Deployment** - Go live on subdomain
7. **Ongoing** - Product updates, optimization

## Roadmap

### Completed (Week 1 Day 1-2)
- ✅ Template type system
- ✅ Template registry
- ✅ Instantiation service
- ✅ Paddle template
- ✅ Demo and validation

### Next Steps (Week 1 Day 3-5)
- Create kayak template
- Create laptop template
- Create 7 more templates
- Build template selector UI
- Create CSV product import tool

## Questions?

See main project documentation in `/docs/SERVICE_LAUNCH_PLAN.md`
