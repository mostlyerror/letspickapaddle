# Sprint 1: Generic Platform Foundation

**Duration:** 2 weeks
**Goal:** Build core generic recommendation engine and migrate pickleball quiz to use it
**Team:** 2 engineers

## Sprint Objectives

1. ✅ Create generic recommendation engine (configuration-driven scoring)
2. ✅ Define platform type system and interfaces
3. 🔄 Migrate current paddle recommendation logic to generic engine
4. 🔄 Set up workspace/product multi-tenant data model
5. 🔄 Create migration script from current schema to generic schema
6. 🔄 Update API to use generic engine
7. 🔄 Validate with end-to-end tests

## Tasks Breakdown

### Week 1: Core Engine & Type System

#### Task 1.1: Platform Type Definitions ✅ DONE
**Priority:** P0 (Critical Path)
**Assignee:** Engineer 1
**Estimate:** 4 hours

**Description:** Define TypeScript interfaces for the generic platform

**Files:**
- ✅ `/src/platform/core/engine/types.ts`

**Acceptance Criteria:**
- [x] Product interface supports generic attributes
- [x] QuizConfig supports any product vertical
- [x] ScoringRule supports all rule types
- [x] WorkspaceConfig defines product schema
- [x] All types are well-documented

---

#### Task 1.2: Generic Recommendation Engine ✅ DONE
**Priority:** P0 (Critical Path)
**Assignee:** Engineer 1
**Estimate:** 8 hours

**Description:** Build the configuration-driven recommendation engine

**Files:**
- ✅ `/src/platform/core/engine/recommendation-engine.ts`

**Acceptance Criteria:**
- [x] Supports all rule types (exact_match, range, threshold, etc.)
- [x] Score() method evaluates rules against responses
- [x] Recommend() method returns sorted recommendations
- [x] ExplainScore() provides debugging breakdown
- [x] Handles edge cases (missing data, invalid rules)

---

#### Task 1.3: Example Configurations ✅ DONE
**Priority:** P1 (High)
**Assignee:** Engineer 2
**Estimate:** 6 hours

**Description:** Create example configurations for kayaks and laptops to validate design

**Files:**
- ✅ `/src/platform/examples/kayak-quiz-config.ts`
- ✅ `/src/platform/examples/laptop-quiz-config.ts`
- ✅ `/src/platform/examples/demo.ts`

**Acceptance Criteria:**
- [x] Kayak config with 6 questions and 20+ scoring rules
- [x] Laptop config with 6 questions and 20+ scoring rules
- [x] Sample products for each vertical (4-5 each)
- [x] Demo script shows engine working for both verticals

---

#### Task 1.4: Test Suite for Engine
**Priority:** P0 (Critical Path)
**Assignee:** Engineer 1
**Estimate:** 6 hours

**Description:** Comprehensive unit tests for recommendation engine

**Files:**
- `/src/platform/core/engine/__tests__/recommendation-engine.test.ts`

**Test Cases:**
- [ ] Exact match rules work correctly
- [ ] Range rules work correctly
- [ ] Threshold rules work correctly
- [ ] Inverse threshold rules work correctly
- [ ] Preference weight rules work correctly
- [ ] Multiple rules combine correctly
- [ ] Score capped at maxScore
- [ ] Missing data handled gracefully
- [ ] Empty products array handled
- [ ] ExplainScore returns detailed breakdown

**Acceptance Criteria:**
- [ ] All test cases pass
- [ ] 90%+ code coverage
- [ ] Edge cases covered

---

### Week 2: Schema Migration & Integration

#### Task 2.1: Multi-tenant Data Models
**Priority:** P0 (Critical Path)
**Assignee:** Engineer 2
**Estimate:** 6 hours

**Description:** Create Prisma schema for multi-tenant platform

**Files:**
- `/prisma/schema-platform.prisma` (new schema file)
- `/docs/SCHEMA_MIGRATION.md` (migration guide)

**Models to Create:**
- [ ] Workspace (multi-tenant root)
- [ ] Product (generic with attributes JSON)
- [ ] Quiz (with questions JSON, scoring config JSON)
- [ ] QuizResponse (generic responses)
- [ ] Partner (already exists, needs workspaceId)

**Acceptance Criteria:**
- [ ] Schema supports multiple workspaces
- [ ] Product model stores attributes as JSON
- [ ] Quiz model stores configuration as JSON
- [ ] All foreign keys and indexes defined
- [ ] Migration guide documents changes

---

#### Task 2.2: Paddle-to-Generic Converter
**Priority:** P0 (Critical Path)
**Assignee:** Engineer 1
**Estimate:** 8 hours

**Description:** Create conversion layer from current Paddle schema to generic Product

**Files:**
- `/src/platform/adapters/paddle-adapter.ts`
- `/src/platform/adapters/paddle-scoring-config.ts`

**Functionality:**
```typescript
// Convert Paddle to Product
function paddleToProduct(paddle: Paddle): Product {
  return {
    id: paddle.id,
    workspaceId: 'wks_pickleball',
    name: paddle.name,
    brand: paddle.brand,
    priceCents: paddle.priceCents,
    imageUrl: paddle.imageUrl,
    affiliateUrls: paddle.affiliateUrls ? JSON.parse(paddle.affiliateUrls) : {},
    attributes: {
      powerRating: paddle.powerRating,
      controlRating: paddle.controlRating,
      spinRating: paddle.spinRating,
      weightOz: paddle.weightOz,
      shape: paddle.shape,
      coreMaterial: paddle.coreMaterial,
      faceMaterial: paddle.faceMaterial,
      sweetSpotSize: paddle.sweetSpotSize,
    },
  };
}

// Convert current scoring logic to ScoringConfig
const paddleScoringConfig: ScoringConfig = {
  maxScore: 100,
  rules: [
    // Translate hardcoded logic to rules
    {
      type: 'threshold',
      responseKey: 'playStyle',
      productAttribute: 'powerRating',
      logic: {
        condition: { value: 'power' },
        threshold: 8,
        weight: 30,
      },
      reasoning: 'High power rating matches your aggressive play style',
    },
    // ... all other rules
  ],
};
```

**Acceptance Criteria:**
- [ ] Adapter converts all Paddle fields to Product.attributes
- [ ] Scoring config replicates current recommendation logic
- [ ] Unit tests verify conversion is correct
- [ ] Integration test shows same results as current system

---

#### Task 2.3: Update Recommendation API
**Priority:** P0 (Critical Path)
**Assignee:** Engineer 2
**Estimate:** 4 hours

**Description:** Update `/api/recommend` to use generic engine

**Files:**
- `/src/app/api/recommend/route.ts`
- `/src/lib/recommend.ts` (refactor or deprecate)

**Changes:**
```typescript
// Before
import { generateRecommendations } from '@/lib/recommend';
const recommendations = generateRecommendations(paddles, responses);

// After
import { RecommendationEngine } from '@/platform/core/engine/recommendation-engine';
import { paddleToProduct } from '@/platform/adapters/paddle-adapter';
import { paddleScoringConfig } from '@/platform/adapters/paddle-scoring-config';

const engine = new RecommendationEngine(paddleScoringConfig);
const products = paddles.map(paddleToProduct);
const recommendations = engine.recommend(products, responses);
```

**Acceptance Criteria:**
- [ ] API uses generic engine
- [ ] Response format unchanged (backward compatible)
- [ ] All existing tests pass
- [ ] Performance is similar or better

---

#### Task 2.4: Integration Testing
**Priority:** P0 (Critical Path)
**Assignee:** Both
**Estimate:** 4 hours

**Description:** End-to-end testing of migrated system

**Files:**
- `/src/__tests__/generic-engine-integration.test.ts`

**Test Scenarios:**
- [ ] Complete quiz flow works with generic engine
- [ ] Recommendations match previous system
- [ ] Partner affiliate URLs still injected correctly
- [ ] Image URLs returned correctly
- [ ] Results page displays correctly

**Acceptance Criteria:**
- [ ] All integration tests pass
- [ ] Manual testing confirms UI works
- [ ] No regression in functionality
- [ ] Performance benchmarks met

---

#### Task 2.5: Database Migration Script
**Priority:** P1 (High, but not blocking)
**Assignee:** Engineer 2
**Estimate:** 4 hours

**Description:** Optional script to migrate data to new schema

**Files:**
- `/scripts/migrate-to-platform-schema.ts`

**Functionality:**
- [ ] Create 'pickleball' workspace
- [ ] Migrate Paddle → Product with attributes
- [ ] Create Quiz record with current questions
- [ ] Migrate QuizResponse records
- [ ] Link Partners to workspace
- [ ] Dry-run mode for safety

**Acceptance Criteria:**
- [ ] Script runs without errors
- [ ] Dry-run shows planned changes
- [ ] All data preserved after migration
- [ ] Rollback script available

---

#### Task 2.6: Documentation
**Priority:** P1 (High)
**Assignee:** Engineer 1
**Estimate:** 3 hours

**Description:** Document the generic platform architecture

**Files:**
- `/docs/PLATFORM_ARCHITECTURE.md`
- `/docs/ADDING_NEW_VERTICAL.md`
- `/docs/SCORING_CONFIG_GUIDE.md`

**Content:**
- [ ] Architecture diagrams
- [ ] How to add a new product vertical
- [ ] Scoring rule types explained
- [ ] Configuration examples
- [ ] API documentation

**Acceptance Criteria:**
- [ ] Clear diagrams of system architecture
- [ ] Step-by-step guide to add new vertical
- [ ] All rule types documented with examples
- [ ] Code examples are tested and work

---

## Definition of Done (Sprint 1)

A task is considered done when:

1. ✅ Code is written and follows project conventions
2. ✅ Unit tests written and passing
3. ✅ Integration tests passing
4. ✅ Code reviewed by another engineer
5. ✅ Documentation updated
6. ✅ No regressions in existing functionality
7. ✅ Performance is acceptable
8. ✅ Merged to main branch

## Sprint Success Criteria

Sprint 1 is successful if:

1. ✅ Generic recommendation engine is built and tested
2. 🔄 Pickleball quiz uses generic engine with no change in user experience
3. 🔄 Example configs for kayaks and laptops validate the design
4. 🔄 All existing tests pass
5. 🔄 Documentation explains how to add new verticals
6. 🔄 Foundation is ready for Sprint 2 (multi-tenant admin UI)

## Risks & Mitigations

**Risk 1: Performance degradation from generic engine**
- *Likelihood:* Low
- *Impact:* Medium
- *Mitigation:* Benchmark current system, optimize JSON parsing, cache scoring configs

**Risk 2: Scoring rules don't capture all existing logic**
- *Likelihood:* Medium
- *Impact:* High
- *Mitigation:* Comprehensive A/B testing, side-by-side comparison, gradual rollout

**Risk 3: Schema migration too complex**
- *Likelihood:* Low
- *Impact:* Medium
- *Mitigation:* Keep both schemas running in parallel initially, feature flag

## Sprint 2 Preview

Next sprint will focus on:

1. Multi-tenant admin UI (workspace management)
2. Quiz builder interface
3. Product import system for any vertical
4. Scoring rule configurator UI
5. Partner management per workspace

## Progress Tracking

### Completed Tasks (✅)
- [x] Task 1.1: Platform Type Definitions
- [x] Task 1.2: Generic Recommendation Engine
- [x] Task 1.3: Example Configurations (Kayak, Laptop)

### In Progress (🔄)
- [ ] Task 1.4: Test Suite for Engine
- [ ] Task 2.1: Multi-tenant Data Models
- [ ] Task 2.2: Paddle-to-Generic Converter
- [ ] Task 2.3: Update Recommendation API
- [ ] Task 2.4: Integration Testing
- [ ] Task 2.5: Database Migration Script
- [ ] Task 2.6: Documentation

### Not Started (⏳)
- None yet

---

**Last Updated:** 2026-01-29
**Sprint Start:** TBD
**Sprint End:** TBD
**Daily Standup:** TBD
