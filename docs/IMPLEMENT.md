# Pickleball Paddle Recommendation Engine - Implementation Plan

## 1. Technical Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React/Next.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │   Quiz   │  │ Results  │  │ Compare  │  │ Advanced Sliders │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
└───────┼─────────────┼────────────┼──────────────────┼───────────┘
        │             │            │                  │
        ▼             ▼            ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer (REST)                         │
│  /quiz  │  /recommend  │  /paddles  │  /compare  │  /results   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐
│   Postgres   │   │    Redis     │   │   External Services      │
│ (paddles,    │   │  (sessions,  │   │  - Affiliate APIs        │
│  users,      │   │   cache)     │   │  - Analytics             │
│  results)    │   └──────────────┘   └──────────────────────────┘
└──────────────┘
```

**Stack**: Next.js (App Router), PostgreSQL, Redis, Vercel/Railway

---

## 2. Data Models / Schema Design

### Core Tables

```sql
-- Paddles: Central product catalog
CREATE TABLE paddles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  price_cents INTEGER NOT NULL,
  weight_oz DECIMAL(4,2),           -- 7.3-8.5 typical
  grip_circumference DECIMAL(3,2),  -- 4.0-4.5 inches
  core_material VARCHAR(50),        -- polymer, nomex, aluminum
  face_material VARCHAR(50),        -- carbon fiber, fiberglass, graphite
  shape VARCHAR(30),                -- standard, elongated, wide-body
  balance_point_mm INTEGER,         -- distance from handle
  power_rating INTEGER CHECK (1-10),
  control_rating INTEGER CHECK (1-10),
  spin_rating INTEGER CHECK (1-10),
  sweet_spot_size VARCHAR(20),      -- small, medium, large
  swing_weight INTEGER,             -- g·cm² (advanced)
  twist_weight INTEGER,             -- g·cm² (advanced)
  handle_length_in DECIMAL(3,2),
  usapa_approved BOOLEAN DEFAULT true,
  image_url TEXT,
  affiliate_urls JSONB,             -- {retailer: {url, commission}}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions: Config-driven, no code changes needed
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_key VARCHAR(50) UNIQUE NOT NULL,  -- skill_level, play_style, etc.
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL,        -- single, multi, slider
  options JSONB NOT NULL,                    -- [{value, label, icon?}]
  display_order INTEGER NOT NULL,
  conditions JSONB,                          -- show if previous answers match
  weight_mappings JSONB NOT NULL,            -- how answers affect paddle scoring
  is_active BOOLEAN DEFAULT true
);

-- Quiz responses: Ephemeral, stored for recommendation
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id),         -- nullable for anonymous
  responses JSONB NOT NULL,                  -- {question_key: answer_value}
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommendation results: Shareable
CREATE TABLE recommendation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_token VARCHAR(20) UNIQUE NOT NULL,   -- short shareable ID
  quiz_response_id UUID REFERENCES quiz_responses(id),
  recommendations JSONB NOT NULL,            -- [{paddle_id, score, explanation}]
  price_filter JSONB,                        -- {min, max}
  expires_at TIMESTAMPTZ,                    -- 90 days for anonymous
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users: Optional account creation
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate clicks: Tracking
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID REFERENCES recommendation_results(id),
  paddle_id UUID REFERENCES paddles(id),
  retailer VARCHAR(50),
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. API Endpoints

### Quiz & Recommendations (MVP)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz/questions` | Get active questions (respects conditions) |
| POST | `/api/quiz/responses` | Submit quiz answers, get session ID |
| POST | `/api/recommend` | Generate recommendations from responses |
| GET | `/api/recommend/:shareToken` | Fetch saved results by share token |
| GET | `/api/paddles` | List paddles (supports filtering) |
| GET | `/api/paddles/:id` | Single paddle details |

### Comparison & Sharing (V1.1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/compare` | Compare 2-4 paddles with user profile context |
| POST | `/api/results/save` | Save results, generate share token |
| POST | `/api/affiliate/click` | Track affiliate click |

### Users (V1.1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get session token |
| GET | `/api/users/me/results` | List user's saved results |

---

## 4. Task Breakdown

### MVP (P0)

| Task | Complexity | Est. Hours |
|------|------------|------------|
| DB schema + migrations | S | 4 |
| Paddle CRUD + admin seeding | M | 8 |
| Quiz question config system | M | 6 |
| Quiz UI (adaptive flow) | M | 12 |
| **Recommendation algorithm** | L | 16 |
| Recommendation explanation generator | M | 6 |
| Results page UI | M | 8 |
| Price filter | S | 3 |
| Local storage quiz progress | S | 2 |
| Responsive styling + accessibility | M | 10 |
| **Total MVP** | | **~75 hrs** |

### V1.1 (P1)

| Task | Complexity | Est. Hours |
|------|------------|------------|
| Side-by-side comparison UI | M | 8 |
| Share token generation + page | S | 4 |
| User auth (register/login) | M | 8 |
| Save results to account | S | 3 |
| Advanced mode sliders | M | 8 |
| Real-time slider → recommendation | M | 6 |
| Affiliate link integration | M | 6 |
| Click tracking | S | 3 |
| **Total V1.1** | | **~46 hrs** |

### Future (P2)

| Task | Complexity |
|------|------------|
| User feedback/ratings system | M |
| Profile evolution + history | M |
| Demo locator (geolocation) | L |
| Admin dashboard | L |

---

## 5. Suggested Build Order

```
Phase 1: Foundation (Week 1)
├── 1.1 DB schema + Postgres setup
├── 1.2 Paddle model + seed 100 paddles
└── 1.3 Basic paddle list/detail API + UI

Phase 2: Quiz System (Week 2)
├── 2.1 Quiz question config schema
├── 2.2 Quiz question API (conditional logic)
├── 2.3 Quiz UI with progress indicator
└── 2.4 Local storage for quiz progress
    └── depends on: 2.3

Phase 3: Core Algorithm (Week 3)
├── 3.1 Recommendation scoring engine
│   └── depends on: 1.2, 2.1
├── 3.2 Explanation text generator
│   └── depends on: 3.1
└── 3.3 Price filtering
    └── depends on: 3.1

Phase 4: Results Experience (Week 4)
├── 4.1 Results page UI
│   └── depends on: 3.1, 3.2
├── 4.2 Share token + public results page
│   └── depends on: 4.1
└── 4.3 Accessibility pass (WCAG 2.1 AA)

Phase 5: V1.1 Features (Week 5-6)
├── 5.1 Comparison table UI
├── 5.2 Advanced mode sliders
├── 5.3 User auth
├── 5.4 Affiliate integration
└── 5.5 Click tracking
```

---

## 6. Key Technical Decisions / Tradeoffs

### Algorithm Approach
**Decision**: Weighted scoring with configurable weights per question
- **Pro**: Deterministic, explainable, easy to tune
- **Con**: May miss nuanced correlations
- **Alternative considered**: ML model — overkill for MVP, needs training data we don't have

### Quiz Adaptivity
**Decision**: JSON-based conditions stored in DB (`show_if: {skill_level: ['advanced', 'pro']}`)
- **Pro**: No code deploys to adjust quiz flow
- **Con**: Complex conditions harder to debug
- **Tradeoff**: Keep conditions simple (AND only, no nesting)

### Session Handling (Anonymous Users)
**Decision**: UUID session in localStorage + Redis for 7-day persistence
- **Pro**: No forced account creation
- **Con**: Cross-device continuity requires account
- **Note**: PRD explicitly allows anonymous save/share

### Paddle Data Management
**Decision**: Manual data entry via admin, no scraping
- **Pro**: Accuracy, legal compliance (per PRD constraint)
- **Con**: Labor-intensive, data freshness risk
- **Mitigation**: Build simple admin UI, partner with brands for updates

### Real-Time Sliders (Advanced Mode)
**Decision**: Debounced client-side scoring, not API calls
- **Pro**: Instant feedback, no server load
- **Con**: Algorithm logic duplicated client-side
- **Tradeoff**: Accept duplication; wrap scoring in shared util

---

## 7. MVP Scope vs. Future Phases

### MVP (Launch)
- ✅ 8-12 adaptive quiz questions
- ✅ Top 3-5 recommendations with match %
- ✅ 100+ paddles from 15 brands
- ✅ Explanation per recommendation
- ✅ Price filtering
- ✅ Mobile responsive
- ✅ WCAG 2.1 AA accessibility
- ✅ Quiz progress persistence (local storage)

### V1.1 (4-6 weeks post-launch)
- Side-by-side comparison (2-4 paddles)
- Save & share results (90-day links)
- Advanced mode (granular sliders)
- Affiliate links + click tracking
- User accounts (optional)

### V2+ (Future Roadmap)
- User satisfaction ratings → algorithm feedback loop
- Profile evolution ("your new matches vs. previous")
- Demo locator (geo search for retailers)
- B2B white-label API
- Mobile native apps

---

## Quick Start Checklist

```bash
# 1. Init project
npx create-next-app@latest paddle-finder --typescript --tailwind --app

# 2. Add dependencies
npm install @prisma/client zod redis nanoid
npm install -D prisma

# 3. Setup DB
npx prisma init
# Edit schema.prisma with models above
npx prisma migrate dev --name init

# 4. Seed paddles
npx prisma db seed  # add seed script with 100 paddles
```
