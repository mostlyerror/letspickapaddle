# Quiz + Affiliate Platform Extraction Plan

## Executive Summary

The current pickleball paddle quiz can be extracted into a **generic recommendation quiz platform** that supports:
- Multi-product vertical quizzes (paddles, kayaks, laptops, mattresses, etc.)
- B2B partner affiliate tracking
- Embeddable widgets
- Customizable recommendation algorithms

**Current System Analysis:**
- 60% generic (response collection, partner system, widget embedding)
- 40% domain-specific (scoring logic, product attributes, question content)

## Platform Architecture

### Core Components

```
┌─────────────────────────────────────────────────────┐
│           Quiz Platform (Generic Core)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Quiz       │  │ Recommendation│  │ Partner  │ │
│  │   Engine     │  │    Engine     │  │  System  │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Widget     │  │   Analytics   │  │  Admin   │ │
│  │  Embedding   │  │   Tracking    │  │   API    │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          │ Configuration API
                          ▼
┌─────────────────────────────────────────────────────┐
│        Tenant Configurations (Multi-tenant)         │
├─────────────────────────────────────────────────────┤
│  Pickleball Quiz  │  Kayak Quiz  │  Laptop Quiz     │
│  - Questions      │  - Questions  │  - Questions     │
│  - Product Schema │  - Product    │  - Product       │
│  - Scoring Rules  │    Schema     │    Schema        │
│  - UI Theme       │  - Scoring    │  - Scoring       │
│                   │  - UI Theme   │  - UI Theme      │
└─────────────────────────────────────────────────────┘
```

## Data Model Transformation

### Current (Pickleball-Specific)

```prisma
model Paddle {
  id              String   @id @default(cuid())
  name            String
  brand           String
  priceCents      Int
  powerRating     Int?
  controlRating   Int?
  spinRating      Int?
  weightOz        Float?
  shape           String?
  coreMaterial    String?
  faceMaterial    String?
  imageUrl        String?
  affiliateUrls   String?  // JSON
}

model QuizQuestion {
  id       String @id @default(cuid())
  text     String
  options  String // JSON array
}
```

### Generic Platform Model

```prisma
// Multi-tenant workspace
model Workspace {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  productType   String   // "paddle", "kayak", "laptop"
  createdAt     DateTime @default(now())

  quizzes       Quiz[]
  products      Product[]
  partners      Partner[]
}

// Generic product model
model Product {
  id            String   @id @default(cuid())
  workspaceId   String
  workspace     Workspace @relation(fields: [workspaceId], references: [id])

  name          String
  brand         String
  priceCents    Int
  imageUrl      String?
  affiliateUrls String?  // JSON: {"amazon": "...", "direct": "..."}

  // Generic attributes stored as JSON
  attributes    String   // JSON: {"power": 8, "weight": 7.9, "material": "polymer"}

  @@index([workspaceId])
}

// Quiz configuration
model Quiz {
  id            String   @id @default(cuid())
  workspaceId   String
  workspace     Workspace @relation(fields: [workspaceId], references: [id])

  name          String
  slug          String

  // Questions stored as JSON
  questions     String   // JSON array of question objects

  // Scoring algorithm stored as JSON or code reference
  scoringConfig String   // JSON: algorithm configuration

  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  responses     QuizResponse[]

  @@index([workspaceId])
  @@unique([workspaceId, slug])
}

// Quiz responses (generic)
model QuizResponse {
  id          String   @id @default(cuid())
  sessionId   String   @unique
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  partnerId   String?
  partner     Partner? @relation(fields: [partnerId], references: [id])

  responses   String   // JSON: {"playStyle": "power", "budget": "premium"}

  createdAt   DateTime @default(now())

  @@index([quizId])
  @@index([partnerId])
}

// Partner system (already generic)
model Partner {
  id              String   @id @default(cuid())
  workspaceId     String
  workspace       Workspace @relation(fields: [workspaceId], references: [id])

  name            String
  apiKey          String   @unique
  amazonTag       String?

  active          Boolean  @default(true)
  createdAt       DateTime @default(now())

  responses       QuizResponse[]
  clicks          AffiliateClick[]

  @@index([workspaceId])
}
```

## Recommendation Engine Abstraction

### Current Implementation (Paddle-Specific)

```typescript
// src/lib/recommend.ts
function scoreMatch(paddle: Paddle, responses: QuizResponses): number {
  let score = 0;

  // Hardcoded paddle-specific logic
  if (responses.playStyle === 'power' && paddle.powerRating >= 8) {
    score += 30;
  }
  if (responses.budget === 'premium' && paddle.priceCents > 15000) {
    score += 20;
  }
  // ... more hardcoded rules

  return score;
}
```

### Generic Platform Approach

```typescript
// Platform-agnostic recommendation engine

interface ScoringRule {
  type: 'exact_match' | 'range' | 'threshold' | 'preference_weight';
  responseKey: string;      // "playStyle"
  productAttribute: string; // "powerRating"
  logic: {
    condition?: any;        // {"value": "power"}
    threshold?: number;     // 8
    range?: [number, number];
    weight: number;         // 30 points
  };
  reasoning?: string;       // "High power rating matches your aggressive play style"
}

interface ScoringConfig {
  rules: ScoringRule[];
  maxScore: number;
  weights?: {
    [key: string]: number;  // Global weights for attribute categories
  };
}

// Generic scoring engine
class RecommendationEngine {
  constructor(private config: ScoringConfig) {}

  score(product: Product, responses: Record<string, any>): {
    score: number;
    reasons: string[];
  } {
    let totalScore = 0;
    const reasons: string[] = [];

    for (const rule of this.config.rules) {
      const responseValue = responses[rule.responseKey];
      const productValue = product.attributes[rule.productAttribute];

      const { matched, points } = this.evaluateRule(
        rule,
        responseValue,
        productValue
      );

      if (matched) {
        totalScore += points;
        if (rule.reasoning) {
          reasons.push(rule.reasoning);
        }
      }
    }

    return {
      score: Math.min(totalScore, this.config.maxScore),
      reasons
    };
  }

  private evaluateRule(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): { matched: boolean; points: number } {
    switch (rule.type) {
      case 'exact_match':
        return {
          matched: responseValue === rule.logic.condition?.value,
          points: rule.logic.weight
        };

      case 'threshold':
        return {
          matched: productValue >= (rule.logic.threshold || 0),
          points: rule.logic.weight
        };

      case 'range':
        const [min, max] = rule.logic.range || [0, Infinity];
        return {
          matched: productValue >= min && productValue <= max,
          points: rule.logic.weight
        };

      case 'preference_weight':
        // Linear scoring based on how close product is to preference
        const distance = Math.abs(productValue - responseValue);
        const maxDistance = rule.logic.threshold || 10;
        const normalizedScore = Math.max(0, 1 - distance / maxDistance);
        return {
          matched: normalizedScore > 0,
          points: Math.round(normalizedScore * rule.logic.weight)
        };

      default:
        return { matched: false, points: 0 };
    }
  }

  recommend(
    products: Product[],
    responses: Record<string, any>,
    limit: number = 5
  ): Array<Product & { score: number; matchReasons: string[] }> {
    const scored = products.map(product => {
      const { score, reasons } = this.score(product, responses);
      return {
        ...product,
        score,
        matchReasons: reasons
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

// Usage example for pickleball quiz
const pickleballScoringConfig: ScoringConfig = {
  maxScore: 100,
  rules: [
    {
      type: 'threshold',
      responseKey: 'playStyle',
      productAttribute: 'powerRating',
      logic: {
        condition: { value: 'power' },
        threshold: 8,
        weight: 30
      },
      reasoning: 'High power rating matches your aggressive play style'
    },
    {
      type: 'range',
      responseKey: 'budget',
      productAttribute: 'priceCents',
      logic: {
        range: [15000, 25000],
        weight: 20
      },
      reasoning: 'Premium paddle in your budget range'
    },
    // ... more rules
  ]
};

const engine = new RecommendationEngine(pickleballScoringConfig);
const recommendations = engine.recommend(paddles, responses, 5);
```

## API Layer Design

### Platform API Structure

```
/api/v1/
  /workspaces/
    POST /                          # Create workspace
    GET /:workspaceId               # Get workspace config

  /workspaces/:workspaceId/
    /products/
      GET /                         # List products
      POST /                        # Create product
      PUT /:productId               # Update product
      DELETE /:productId            # Delete product
      POST /import                  # Bulk import

    /quizzes/
      GET /                         # List quizzes
      POST /                        # Create quiz
      GET /:quizId                  # Get quiz config
      PUT /:quizId                  # Update quiz
      DELETE /:quizId               # Delete quiz

    /quizzes/:quizId/
      POST /responses               # Submit quiz response
      GET /responses/:sessionId     # Get user's response
      POST /recommend               # Get recommendations

    /partners/
      GET /                         # List partners
      POST /                        # Create partner
      PUT /:partnerId               # Update partner
      DELETE /:partnerId            # Delete/deactivate

    /analytics/
      GET /overview                 # Workspace analytics
      GET /products/:productId      # Product performance
      GET /partners/:partnerId      # Partner performance
```

### Widget Embedding API

```typescript
// Embeddable widget script
// <script src="https://quizplatform.com/widget.js"></script>

window.QuizPlatform.init({
  workspaceId: 'your-workspace-id',
  quizId: 'pickleball-finder',
  partnerId: 'partner-123',
  container: '#quiz-container',
  theme: {
    primaryColor: '#0ea5e9',
    fontFamily: 'Inter, sans-serif'
  },
  onComplete: (recommendations) => {
    console.log('User completed quiz', recommendations);
  }
});
```

## Migration Strategy

### Phase 1: Dual-Mode Operation (Weeks 1-2)

Keep existing pickleball implementation while building generic platform alongside:

```
/src/
  /app/                          # Current pickleball-specific app
    /quiz/
    /results/
    /admin/

  /platform/                     # New generic platform code
    /core/
      /engine/
        recommendation-engine.ts
        scoring-types.ts
      /models/
        workspace.ts
        product.ts
        quiz.ts
    /api/
      /v1/
        /workspaces/
        /products/
        /quizzes/
```

### Phase 2: Extract Core (Weeks 3-4)

1. Create generic `Product` model with JSON attributes
2. Migrate `Paddle` data to `Product` with workspace "pickleball"
3. Create scoring configuration for pickleball quiz
4. Update recommendation API to use generic engine

### Phase 3: Multi-tenant Admin (Weeks 5-6)

1. Build workspace management UI
2. Build quiz builder interface
3. Build scoring rule configurator
4. Build product import/management for any product type

### Phase 4: Self-Service Platform (Weeks 7-8)

1. User authentication and workspace creation
2. Billing/subscription system
3. Widget customization UI
4. Documentation and onboarding

## Configuration Example: Pickleball Quiz

```json
{
  "workspace": {
    "id": "wks_pickleball",
    "name": "Pickleball Paddle Finder",
    "productType": "paddle"
  },
  "quiz": {
    "id": "quiz_paddle_finder",
    "name": "Find Your Perfect Paddle",
    "questions": [
      {
        "id": "q1",
        "text": "What's your play style?",
        "type": "single_choice",
        "options": [
          {"value": "power", "label": "Power - Aggressive drives and put-aways"},
          {"value": "control", "label": "Control - Precise placement and finesse"},
          {"value": "balanced", "label": "Balanced - Mix of both"}
        ],
        "responseKey": "playStyle"
      },
      {
        "id": "q2",
        "text": "What's your budget?",
        "type": "single_choice",
        "options": [
          {"value": "budget", "label": "Under $100"},
          {"value": "mid", "label": "$100-$150"},
          {"value": "premium", "label": "$150+"}
        ],
        "responseKey": "budget"
      }
    ]
  },
  "productSchema": {
    "attributes": [
      {"key": "powerRating", "type": "number", "min": 1, "max": 10},
      {"key": "controlRating", "type": "number", "min": 1, "max": 10},
      {"key": "spinRating", "type": "number", "min": 1, "max": 10},
      {"key": "weightOz", "type": "number"},
      {"key": "shape", "type": "string", "enum": ["standard", "elongated", "widebody"]},
      {"key": "coreMaterial", "type": "string"},
      {"key": "faceMaterial", "type": "string"}
    ]
  },
  "scoring": {
    "maxScore": 100,
    "rules": [
      {
        "type": "threshold",
        "responseKey": "playStyle",
        "productAttribute": "powerRating",
        "logic": {
          "condition": {"value": "power"},
          "threshold": 8,
          "weight": 30
        },
        "reasoning": "High power rating matches your aggressive play style"
      },
      {
        "type": "exact_match",
        "responseKey": "budget",
        "productAttribute": "priceCents",
        "logic": {
          "condition": {"value": "premium"},
          "range": [15000, null],
          "weight": 20
        },
        "reasoning": "Premium paddle in your budget range"
      }
    ]
  }
}
```

## Business Model

### Platform Tiers

**Starter (Free)**
- 1 quiz
- 50 products
- 5,000 quiz completions/month
- Basic analytics
- Community support

**Professional ($99/month)**
- Unlimited quizzes
- 500 products
- 50,000 quiz completions/month
- Advanced analytics
- Custom branding
- Email support

**Enterprise ($499/month)**
- Unlimited everything
- White-label
- Priority support
- Custom integrations
- SLA

### Revenue Streams

1. **SaaS Subscriptions** - Monthly recurring from quiz operators
2. **Affiliate Commissions** - Optional revenue share on affiliate clicks
3. **Professional Services** - Custom quiz development, integrations
4. **Enterprise Licensing** - Self-hosted deployments

## Technical Implementation Roadmap

### Month 1: Foundation
- [ ] Design and implement generic data models
- [ ] Build recommendation engine abstraction
- [ ] Create multi-tenant workspace system
- [ ] Migrate pickleball quiz to use generic engine

### Month 2: Platform Features
- [ ] Build quiz builder UI
- [ ] Create product import system
- [ ] Implement scoring rule configurator
- [ ] Add partner management for all workspaces

### Month 3: Self-Service
- [ ] User authentication and onboarding
- [ ] Workspace creation flow
- [ ] Billing integration (Stripe)
- [ ] Widget customization UI

### Month 4: Polish & Launch
- [ ] Documentation site
- [ ] Example quizzes (kayak, laptop, mattress)
- [ ] Marketing site
- [ ] Beta launch with 10 customers

## Key Decisions

### 1. Scoring Algorithm Approach

**Option A: JSON Configuration (Recommended)**
- Pros: No-code, user-friendly, portable
- Cons: Limited to predefined rule types

**Option B: Code Snippets**
- Pros: Maximum flexibility, any logic possible
- Cons: Security risk, requires dev knowledge

**Decision**: Start with JSON configuration, add sandboxed code evaluation later

### 2. Product Attribute Storage

**Option A: Generic JSON field (Recommended)**
- Pros: Flexible, no migrations for new products
- Cons: Less type-safe, harder to query

**Option B: EAV (Entity-Attribute-Value)**
- Pros: Queryable, structured
- Cons: Complex schema, slower queries

**Decision**: Use JSON with workspace-level schema validation

### 3. Widget Deployment

**Option A: Hosted iframe**
- Pros: Full isolation, easy updates
- Cons: SEO issues, slower load

**Option B: JavaScript library (Recommended)**
- Pros: Fast, SEO-friendly, customizable
- Cons: Version compatibility

**Decision**: JavaScript library with iframe fallback

## Success Metrics

### Platform Health
- Active workspaces
- Quiz completions per workspace
- Average products per workspace
- Partner integrations

### User Engagement
- Quiz completion rate
- Time to complete quiz
- Click-through rate on recommendations
- Return visitor rate

### Business Metrics
- MRR (Monthly Recurring Revenue)
- Customer acquisition cost
- Churn rate
- Affiliate revenue per workspace

## Next Steps

1. **Validate concept** - Build MVP with 2-3 product verticals
2. **Get feedback** - Beta with 5-10 early customers
3. **Iterate** - Refine based on real usage
4. **Scale** - Marketing and growth

## Questions to Answer

1. Should we support multiple recommendation algorithms per quiz (A/B testing)?
2. How do we handle product data freshness (prices, availability)?
3. Should partners be workspace-specific or platform-wide?
4. Do we need version control for quiz configurations?
5. How do we handle GDPR/privacy for quiz responses?

---

**Estimated Effort**: 4 months to MVP, 6 months to production-ready platform
**Team Size**: 2 engineers + 1 designer
**Infrastructure Cost**: ~$200-500/month initially (Vercel, Supabase, CDN)
