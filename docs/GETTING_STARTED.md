# Getting Started: Paddle Data Collection

Welcome! This guide will help you quickly get started with finding and importing popular pickleball paddle data.

## Quick Links

- **Fast Track:** [Quick Start Guide](../scripts/QUICK_START.md)
- **Detailed Guide:** [Paddle Research Guide](PADDLE_RESEARCH_GUIDE.md)
- **Full Summary:** [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- **Automation:** [Amazon API Setup](AMAZON_API_SETUP.md)

## Choose Your Path

### Path 1: Import Existing Data (5 minutes)

We've already generated a starter file with 20 popular paddles!

```bash
# Validate the data
npx tsx scripts/validate-paddle-data.ts scripts/starter-paddles.json

# Import to database
npx tsx scripts/import-paddles.ts scripts/starter-paddles.json
```

**Result:** 20 fully-spec'd paddles with Amazon affiliate links ready to go!

### Path 2: Add More Paddles Manually (2-4 weeks)

Follow the comprehensive research process to expand to 50-100 paddles.

**Start here:**
1. Read: [Paddle Research Guide](PADDLE_RESEARCH_GUIDE.md)
2. Follow: [Quick Start Guide](../scripts/QUICK_START.md)
3. Use templates: `scripts/paddle-data-template.json`

**Time estimate:**
- 50 paddles: 30-40 hours (2-3 weeks part-time)
- 100 paddles: 60-80 hours (4-6 weeks part-time)

### Path 3: Automate with Amazon API (Future)

Set up automated price updates and data fetching.

**Start here:**
1. Read: [Amazon API Setup Guide](AMAZON_API_SETUP.md)
2. Apply for API access (1-7 days)
3. Configure automated updates

**Benefits:**
- Real-time price updates
- Automatic availability checks
- Product images and details
- 100% free (within limits)

## What's Included

### Documentation
- ✅ **Comprehensive research guide** - Where to find paddles, what data to collect
- ✅ **Quick start guide** - Fast-track workflow for efficient data collection
- ✅ **Amazon API guide** - Automation setup instructions
- ✅ **Implementation summary** - Overview of all tools and features

### Data Templates
- ✅ **JSON template** - Complete paddle data structure
- ✅ **CSV template** - Spreadsheet-compatible format
- ✅ **Starter data** - 20 pre-filled popular paddles

### Import Tools
- ✅ **CLI import script** - Command-line batch import
- ✅ **Validation script** - Pre-import data checking
- ✅ **Web UI** - Admin panel bulk import interface
- ✅ **API endpoints** - Programmatic import

### Helper Scripts
- ✅ **Starter generator** - Create import file from existing data
- ✅ **Data validator** - Check data quality before import
- ✅ **Full importer** - Create/update paddles in database

## Recommended Starting Point

### Week 1: Launch with 20 Paddles

**Day 1:** Import starter data
```bash
npx tsx scripts/import-paddles.ts scripts/starter-paddles.json
```

**Day 2-3:** Test the system
- Run quiz flow
- Check recommendations
- Verify affiliate links

**Day 4-5:** Review and refine
- Update any outdated prices
- Add missing specs
- Test with real users

### Week 2-3: Expand to 50 Paddles

**Follow the research guide:**
1. Find 30 more popular paddles
2. Collect specs and ratings
3. Validate and import
4. Monitor performance

### Week 4+: Optimize and Automate

**Set up automation:**
1. Apply for Amazon Product API
2. Configure automated price updates
3. Set up monitoring and alerts

## Data Sources

### Where to Find Popular Paddles

**Retailer Bestsellers:**
- [Pickleball Central](https://www.pickleballcentral.com/best_sellers.asp) - Top 50
- [Amazon Pickleball](https://www.amazon.com/Best-Sellers-Sports-Outdoors-Pickleball-Paddles/zgbs/sporting-goods/16329141) - Top 100

**Expert Reviews:**
- [The Pickler](https://thepickler.com/pickleball-paddle-reviews) - Performance ratings
- YouTube: "Best Pickleball Paddles 2025"

**Community:**
- [Reddit r/Pickleball](https://www.reddit.com/r/Pickleball/) - User discussions
- Facebook Groups - Trending paddles

### What Data to Collect

**Required (minimum):**
- Paddle name
- Brand
- Price

**Recommended:**
- Weight, materials, shape
- Power/control/spin ratings
- Amazon URL

**Optional:**
- Advanced specs (balance point, swing weight, etc.)
- Images
- Full descriptions

## Using the Tools

### Validate Your Data

Before importing, always validate:

```bash
npx tsx scripts/validate-paddle-data.ts your-file.json
```

This checks:
- ✓ JSON syntax is valid
- ✓ Required fields are present
- ✓ Values are in correct ranges
- ✓ URLs are properly formatted
- ✓ Data quality statistics

### Import to Database

Two ways to import:

**Option 1: Command Line**
```bash
npx tsx scripts/import-paddles.ts your-file.json
```

**Option 2: Web Interface**
1. Visit: `http://localhost:3000/admin/paddles`
2. Click: "Import Full Paddle Data"
3. Upload your JSON file
4. Review and apply

### Generate Starter File

Create a JSON file from existing data:

```bash
npx tsx scripts/generate-starter-json.ts
```

Output: `scripts/starter-paddles.json`

## File Format

### Basic Structure

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

### Complete Example

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
      "balancePointMm": 260,
      "powerRating": 9,
      "controlRating": 7,
      "spinRating": 8,
      "sweetSpotSize": "large",
      "swingWeight": 115,
      "twistWeight": 6.8,
      "handleLengthIn": 5.5,
      "usapaApproved": true,
      "amazonUrl": "https://www.amazon.com/dp/B09L3QXKJT"
    }
  ]
}
```

See `scripts/paddle-data-template.json` for more examples.

## Workflow Diagram

```
1. Research
   ↓
   Find popular paddles on bestseller lists
   ↓
2. Collect Data
   ↓
   Visit product pages, copy specs
   Visit review sites, copy ratings
   ↓
3. Format
   ↓
   Create JSON file using template
   ↓
4. Validate
   ↓
   npx tsx scripts/validate-paddle-data.ts file.json
   ↓
5. Import
   ↓
   npx tsx scripts/import-paddles.ts file.json
   OR
   Upload via admin UI
   ↓
6. Test
   ↓
   Run quiz, check recommendations
   ↓
7. Monitor
   ↓
   Update prices, add new paddles monthly
```

## Time Estimates

### Quick Start (Week 1)
- Import starter data: **5 minutes**
- Test system: **2 hours**
- Review/refine: **3 hours**
- **Total: ~5 hours**

### Expand to 50 (Weeks 2-3)
- Find 30 more paddles: **4 hours**
- Collect basic data: **20 hours**
- Add ratings: **6 hours**
- **Total: ~30 hours**

### Expand to 100 (Weeks 4-6)
- Find 50 more paddles: **6 hours**
- Collect basic data: **35 hours**
- Add ratings: **10 hours**
- **Total: ~50 hours**

### Automation Setup (Week 7+)
- Apply for API: **30 minutes + 1-7 day wait**
- Configure system: **2-4 hours**
- **Ongoing: Fully automated**

## Common Questions

### How many paddles do I need to start?

**Minimum:** 20 paddles (use starter data)
**Recommended:** 50 paddles
**Ideal:** 100+ paddles

Start with 20, launch, then expand over time.

### How do I keep prices updated?

**Manual:** Check prices weekly/monthly
**Semi-automated:** Use price tracking tools
**Fully automated:** Set up Amazon Product API

### Where do I find performance ratings?

1. **The Pickler** - Most comprehensive reviews
2. **YouTube** - Expert reviewers
3. **Amazon reviews** - User feedback
4. **Reddit** - Community opinions

### Can I just use Amazon URLs without full data?

Yes! You can:
1. Use the existing Amazon URL import: `/admin/paddles/import`
2. Add full specs later
3. Start minimal, expand over time

### How do I know which paddles are popular?

Check these sources:
- Pickleball Central bestsellers (most reliable)
- Amazon bestseller ranks
- YouTube view counts on review videos
- Reddit post upvotes and comment counts

## Support Files

- **Templates:** `scripts/paddle-data-template.json`
- **Starter data:** `scripts/starter-paddles.json`
- **Validation:** `scripts/validate-paddle-data.ts`
- **Import:** `scripts/import-paddles.ts`
- **Generator:** `scripts/generate-starter-json.ts`

## Next Steps

1. **Choose your path** (import starter, manual research, or automation)
2. **Read the relevant guide** (links at top of this file)
3. **Start small** (20 paddles is enough to launch)
4. **Expand gradually** (add 10-20 paddles per week)
5. **Automate when ready** (Amazon API after you have baseline data)

## Get Help

- **Research questions:** See [Paddle Research Guide](PADDLE_RESEARCH_GUIDE.md)
- **Workflow questions:** See [Quick Start Guide](../scripts/QUICK_START.md)
- **Technical issues:** See [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- **Automation questions:** See [Amazon API Setup](AMAZON_API_SETUP.md)

Good luck! Start with the 20 starter paddles and expand from there.
