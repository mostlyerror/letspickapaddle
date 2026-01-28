# Let's Pick a Paddle 🏓

An intelligent pickleball paddle recommendation engine that helps players find their perfect paddle match through a personalized quiz system.

## 🎯 Features

- **Personalized Quiz**: 8-question adaptive quiz covering skill level, play style, budget, and physical considerations
- **Smart Recommendations**: Weighted scoring algorithm analyzes 20+ paddles across multiple attributes
- **Match Explanations**: Get clear reasons why each paddle suits your preferences
- **Progress Tracking**: Quiz progress saved locally - resume anytime
- **Paddle Browser**: Browse all available paddles with detailed specifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma 5 + SQLite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + localStorage

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mostlyerror/letspickapaddle.git
cd letspickapaddle
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
npx tsx prisma/seedQuiz.ts
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Live Demo

**Production URL**: https://letspickapaddle.vercel.app

> **Note**: The current deployment uses SQLite, which has limitations in serverless environments. The database resets between requests. For production use, switch to PostgreSQL using Vercel Postgres, Neon, or Supabase. See the [Production Database Setup](#-production-database-setup) section below.

## 💾 Production Database Setup

For production deployment, replace SQLite with PostgreSQL:

1. **Set up a PostgreSQL database** (choose one):
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Neon](https://neon.tech) (free tier available)
   - [Supabase](https://supabase.com) (free tier available)

2. **Update your schema**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Add DATABASE_URL to Vercel**:
```bash
vercel env add DATABASE_URL
# Paste your PostgreSQL connection string
```

4. **Deploy**:
```bash
git add -A
git commit -m "Switch to PostgreSQL"
git push
vercel --prod
```

## 🗂️ Project Structure

```
letspickapaddle/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Paddle data seeding
│   └── seedQuiz.ts            # Quiz questions seeding
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── paddles/       # Paddle listing API
│   │   │   ├── quiz/          # Quiz questions & responses
│   │   │   └── recommend/     # Recommendation engine API
│   │   ├── quiz/              # Quiz UI
│   │   ├── results/           # Results page
│   │   ├── paddles/           # Paddle browser
│   │   └── page.tsx           # Homepage
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       └── recommendationEngine.ts  # Scoring algorithm
└── docs/
    └── IMPLEMENT.md           # Implementation plan
```

## 🎮 How It Works

### 1. Quiz System
Users answer 8 questions about:
- Skill level (beginner to pro)
- Play style (power, control, all-around, defensive)
- Shot preferences (dinks, drives, serves, volleys, spins)
- Budget range
- Physical considerations
- Grip size preference
- Weight preference
- Paddle shape preference

### 2. Recommendation Algorithm
The engine uses weighted scoring across multiple dimensions:
- **Power Rating**: Matches user's power preference
- **Control Rating**: Evaluates precision and placement
- **Spin Rating**: Considers spin shot frequency
- **Weight**: Matches preferred paddle weight
- **Price**: Filters within budget range
- **Materials**: Considers core and face materials
- **Shape**: Matches shape preferences (standard, elongated, wide-body)
- **Grip Size**: Ensures comfortable fit

### 3. Results Display
- Top 5 paddle recommendations
- Match percentage (0-100%)
- Top 3 reasons for each match
- Detailed specifications
- Price comparison

## 📊 Database Models

### Paddle
Stores paddle specifications including ratings, materials, dimensions, and pricing.

### QuizQuestion
Config-driven questions with:
- Question text and type (single/multi-select)
- Options with descriptions
- Weight mappings for scoring
- Display order and conditions

### QuizResponse
Stores user responses linked to session IDs for result retrieval.

## 🔧 API Endpoints

- `GET /api/paddles` - List all paddles with optional filtering
- `GET /api/quiz/questions` - Fetch active quiz questions
- `POST /api/quiz/responses` - Save quiz responses
- `GET /api/quiz/responses?sessionId=X` - Retrieve saved responses
- `POST /api/recommend` - Generate paddle recommendations

## 🎨 Design Philosophy

- **User-First**: Simple, intuitive interface with minimal friction
- **Mobile-Responsive**: Optimized for all screen sizes
- **Fast & Lightweight**: Server-side rendering for speed
- **Accessible**: Clear hierarchy and readable typography
- **Progressive**: Works without JavaScript for core features

## 📝 Future Enhancements

- [ ] User accounts for saving multiple quiz results
- [ ] Side-by-side paddle comparison tool
- [ ] Advanced mode with granular sliders
- [ ] Affiliate link integration
- [ ] User ratings and reviews
- [ ] Share results via unique URLs
- [ ] Price alerts and tracking
- [ ] Demo locator (find retailers nearby)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

Built with guidance from the implementation plan in `docs/IMPLEMENT.md`.

---

**Repository**: https://github.com/mostlyerror/letspickapaddle

**Questions?** Open an issue on GitHub.
