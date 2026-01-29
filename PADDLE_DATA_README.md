# Paddle Data Collection & Import System

Complete system for finding, validating, and importing popular pickleball paddle data.

## 🚀 Quick Start

### Option 1: Import Starter Data (Fastest - 5 minutes)

```bash
# Already have 20 popular paddles ready to import!
npx tsx scripts/import-paddles.ts scripts/starter-paddles.json
```

### Option 2: Research More Paddles

See comprehensive guides in `/docs`:
- [Getting Started Guide](docs/GETTING_STARTED.md) - Choose your path
- [Quick Start Guide](scripts/QUICK_START.md) - Fast workflow
- [Paddle Research Guide](docs/PADDLE_RESEARCH_GUIDE.md) - Complete details

## 📚 Documentation

### Main Guides
| Guide | Purpose | Time |
|-------|---------|------|
| [Getting Started](docs/GETTING_STARTED.md) | Choose your approach | 5 min |
| [Quick Start](scripts/QUICK_START.md) | Fast workflow for data collection | 15 min |
| [Paddle Research](docs/PADDLE_RESEARCH_GUIDE.md) | Complete research methodology | 30 min |
| [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md) | Overview of all tools | 10 min |
| [Amazon API Setup](docs/AMAZON_API_SETUP.md) | Automation guide | 20 min |

### Quick Reference

**Finding Popular Paddles:**
- Pickleball Central: https://www.pickleballcentral.com/best_sellers.asp
- Amazon: https://www.amazon.com/Best-Sellers-Sports-Outdoors-Pickleball-Paddles/zgbs/sporting-goods/16329141
- Review sites: The Pickler, YouTube
- Community: Reddit r/Pickleball

**Collecting Data:**
- Required: name, brand, price
- Recommended: weight, materials, ratings, Amazon URL
- Optional: advanced specs

**Data Sources:**
- Product specs: Retailer websites
- Performance ratings: Review sites (Pickler.com, YouTube)
- Amazon URLs: Search Amazon, copy /dp/ASIN URL

## 🛠 Tools & Scripts

### Validation
```bash
# Check data before importing
npx tsx scripts/validate-paddle-data.ts your-file.json
```

### Import
```bash
# Command line import
npx tsx scripts/import-paddles.ts your-file.json

# Or use web UI
# Visit: http://localhost:3000/admin/paddles
# Click: "Import Full Paddle Data"
```

### Generate Starter File
```bash
# Create import file from existing data
npx tsx scripts/generate-starter-json.ts
# Output: scripts/starter-paddles.json
```

## 📁 File Structure

```
letspickapaddle/
├── docs/
│   ├── GETTING_STARTED.md          # Start here!
│   ├── PADDLE_RESEARCH_GUIDE.md    # Complete research guide
│   ├── IMPLEMENTATION_SUMMARY.md   # All tools overview
│   └── AMAZON_API_SETUP.md         # Automation setup
│
├── scripts/
│   ├── QUICK_START.md              # Fast workflow guide
│   ├── paddle-data-template.json   # JSON template
│   ├── paddle-data-template.csv    # CSV template
│   ├── starter-paddles.json        # 20 pre-filled paddles ✨
│   ├── import-paddles.ts           # CLI import tool
│   ├── validate-paddle-data.ts     # Validation tool
│   └── generate-starter-json.ts    # Starter generator
│
├── src/app/admin/paddles/
│   ├── page.tsx                    # Admin dashboard
│   ├── import-full/page.tsx        # Full data import UI
│   └── import/page.tsx             # URL-only import UI
│
└── src/app/api/admin/
    ├── import-paddles/             # Full data import API
    └── import-affiliate-urls/      # URL-only import API
```

## 📊 Data Format

### Minimal (Required)
```json
{
  "paddles": [
    {
      "name": "Paddle Name",
      "brand": "Brand",
      "priceCents": 17995,
      "amazonUrl": "https://www.amazon.com/dp/ASIN"
    }
  ]
}
```

### Complete (Recommended)
```json
{
  "paddles": [
    {
      "name": "Selkirk Vanguard Power Air Invikta",
      "brand": "Selkirk",
      "priceCents": 17995,
      "weightOz": 8.0,
      "gripCircumference": 4.25,
      "coreMaterial": "polymer",
      "faceMaterial": "carbon fiber",
      "shape": "elongated",
      "powerRating": 9,
      "controlRating": 7,
      "spinRating": 8,
      "amazonUrl": "https://www.amazon.com/dp/B09L3QXKJT"
    }
  ]
}
```

See `scripts/paddle-data-template.json` for all fields.

## 🎯 Recommended Approach

### Phase 1: Launch (Week 1)
1. Import 20 starter paddles: `npx tsx scripts/import-paddles.ts scripts/starter-paddles.json`
2. Test quiz and recommendations
3. Launch to initial users

### Phase 2: Expand (Weeks 2-4)
1. Research 30 more popular paddles
2. Use templates and validation tools
3. Import incrementally

### Phase 3: Optimize (Week 5+)
1. Set up Amazon Product API
2. Automate price updates
3. Monitor and maintain

## 📈 Time Estimates

| Task | Time | Output |
|------|------|--------|
| Import starter data | 5 min | 20 paddles |
| Research 30 more paddles | 20-30 hours | 50 total paddles |
| Research 50 more paddles | 35-50 hours | 100 total paddles |
| Amazon API setup | 2-4 hours + 1-7 day approval | Automated updates |

## ✅ What's Included

### Pre-Built Data
- ✅ 20 popular paddles with complete specs
- ✅ Amazon affiliate URLs included
- ✅ Performance ratings included
- ✅ Ready to import immediately

### Documentation
- ✅ Getting started guide
- ✅ Quick start workflow
- ✅ Comprehensive research guide
- ✅ Amazon API automation guide
- ✅ Implementation summary

### Tools
- ✅ CLI validation script
- ✅ CLI import script
- ✅ Web import interface
- ✅ Starter data generator
- ✅ Data templates (JSON & CSV)

### Features
- ✅ Automatic ASIN extraction
- ✅ Create or update paddles
- ✅ Detailed validation
- ✅ Progress reporting
- ✅ Error handling

## 🔧 Common Tasks

### Add a single paddle
1. Copy template from `scripts/paddle-data-template.json`
2. Fill in paddle data
3. Save as JSON file
4. Validate: `npx tsx scripts/validate-paddle-data.ts file.json`
5. Import: `npx tsx scripts/import-paddles.ts file.json`

### Update existing paddle
1. Export current data from admin UI
2. Modify the JSON
3. Re-import (will update matching paddles)

### Bulk import 50 paddles
1. Follow [Quick Start Guide](scripts/QUICK_START.md)
2. Use templates for data collection
3. Validate before importing
4. Import via CLI or web UI

### Set up automated updates
1. Read [Amazon API Setup](docs/AMAZON_API_SETUP.md)
2. Apply for Product Advertising API
3. Configure credentials
4. Schedule daily price updates

## 🎓 Learning Path

1. **Start here:** [Getting Started](docs/GETTING_STARTED.md)
2. **Quick workflow:** [Quick Start](scripts/QUICK_START.md)
3. **Deep dive:** [Paddle Research Guide](docs/PADDLE_RESEARCH_GUIDE.md)
4. **Automation:** [Amazon API Setup](docs/AMAZON_API_SETUP.md)
5. **Reference:** [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

## 💡 Pro Tips

1. **Start small:** Import 20 starter paddles first
2. **Test early:** Verify quiz works with minimal data
3. **Expand gradually:** Add 10-20 paddles per week
4. **Use templates:** Copy-paste saves time
5. **Validate always:** Catch errors before importing
6. **Automate when ready:** Amazon API after baseline data
7. **Monitor performance:** Track which paddles users choose

## 🆘 Troubleshooting

### Validation errors
```bash
npx tsx scripts/validate-paddle-data.ts your-file.json
```
Read the error messages - they tell you exactly what's wrong.

### Import fails
- Check database connection (`.env`)
- Ensure JSON is valid
- Verify required fields present
- Check for duplicate names

### Missing data
- Most fields are optional
- Start with minimum (name, brand, price)
- Add more data incrementally

### Wrong prices
- Prices must be in cents (multiply by 100)
- Example: $179.95 = 17995 cents

## 📞 Get Help

- **Where to start?** → [Getting Started](docs/GETTING_STARTED.md)
- **Fast workflow?** → [Quick Start](scripts/QUICK_START.md)
- **Where to find data?** → [Paddle Research Guide](docs/PADDLE_RESEARCH_GUIDE.md)
- **How to automate?** → [Amazon API Setup](docs/AMAZON_API_SETUP.md)
- **What's available?** → [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

## 🚦 Next Steps

1. **Read:** [Getting Started Guide](docs/GETTING_STARTED.md)
2. **Import:** `npx tsx scripts/import-paddles.ts scripts/starter-paddles.json`
3. **Test:** Visit quiz and check recommendations
4. **Expand:** Follow [Quick Start](scripts/QUICK_START.md) to add more
5. **Automate:** Set up [Amazon API](docs/AMAZON_API_SETUP.md) when ready

---

**Quick Commands:**

```bash
# Import starter data (20 paddles)
npx tsx scripts/import-paddles.ts scripts/starter-paddles.json

# Validate your data
npx tsx scripts/validate-paddle-data.ts your-file.json

# Generate starter from existing data
npx tsx scripts/generate-starter-json.ts
```

**Start with 20 paddles. Expand from there. Good luck! 🏓**
