# Paddle Research & Data Collection Guide

## Quick Start (Week 1: Manual Research)

### Step 1: Find Popular Paddles (4-6 hours)

#### A. Pickleball Central Bestsellers (1 hour)
**URL:** https://www.pickleballcentral.com/best_sellers.asp

**What to do:**
1. Visit the bestsellers page
2. Copy the top 30 paddle names and brands
3. Note the prices
4. Add to data collection spreadsheet (see template below)

#### B. Amazon Bestsellers (1 hour)
**URL:** https://www.amazon.com/Best-Sellers-Sports-Outdoors-Pickleball-Paddles/zgbs/sporting-goods/16329141

**What to do:**
1. Browse the top 100 paddles
2. Add any missing from Pickleball Central list
3. Copy ASINs from URLs (the code after /dp/, e.g., B09L3QXKJT)
4. Target: 50 total unique paddles

#### C. YouTube Research (2-3 hours)
Search for these videos and note paddles mentioned:
- "Best Pickleball Paddles 2025"
- "Top Rated Pickleball Paddles"
- "Pickleball Paddle Reviews 2025"

**Recommended channels:**
- Pickleball Studio
- Pickleball Central
- ProPickleball

**What to do:**
1. Watch 3-5 recent videos (published in last 6 months)
2. Note which paddles are recommended
3. Add any high-rated paddles missing from your list

#### D. Reddit Research (1 hour)
**URL:** https://www.reddit.com/r/Pickleball/

**Search terms:**
- "best paddle"
- "paddle recommendations"
- "what paddle should I buy"

**What to do:**
1. Sort by "Top" posts from last year
2. Read top 10 threads
3. Note frequently mentioned paddles
4. Add to your list

### Step 2: Gather Product Data (1-2 hours per paddle)

For each paddle on your list:

#### A. Basic Information (15 minutes)
Visit retailer page (Pickleball Central or Amazon):

**Collect:**
- Full paddle name
- Brand name
- Price (in cents, e.g., $179.95 = 17995)
- Weight in ounces (usually 7.5-8.5 oz)
- Grip circumference (usually 4.125 or 4.25 inches)
- Core material (polymer, nomex, aluminum)
- Face material (carbon fiber, graphite, fiberglass)
- Shape (standard, elongated, wide-body)
- Handle length in inches

**Where to find:**
- Product title
- Specifications section
- Product description

#### B. Performance Ratings (30 minutes)
Visit review sites:

**Pickler.com Reviews:**
- URL: https://thepickler.com/pickleball-paddle-reviews
- Search for your paddle
- Note power/control/spin ratings (1-10 scale)

**Alternative sources if not on Pickler:**
- YouTube reviews (look for rated scores)
- Amazon reviews (estimate based on feedback)
- Reddit discussions

#### C. Amazon Data (15 minutes)
**Find ASIN:**
1. Search for paddle on Amazon
2. Copy ASIN from URL: `amazon.com/dp/ASIN_HERE`
3. Full Amazon URL: `https://www.amazon.com/dp/ASIN`

**Example:**
- Selkirk Vanguard Power Air Invikta
- ASIN: B09L3QXKJT
- URL: https://www.amazon.com/dp/B09L3QXKJT

#### D. Advanced Specs (15-30 minutes, optional)
If available from manufacturer specs or reviews:
- Balance point (in mm, usually 245-270)
- Sweet spot size (small, medium, large)
- Swing weight (usually 100-130)
- Twist weight (usually 5.5-7.5)
- USAPA approved (almost always true)

### Step 3: Data Entry

Use the provided template files:

#### Option 1: JSON Template (for bulk import)
See: `scripts/paddle-data-template.json`

#### Option 2: CSV Template (for spreadsheet work)
See: `scripts/paddle-data-template.csv`

## Data Collection Template

### JSON Format
```json
{
  "name": "Paddle Name",
  "brand": "Brand Name",
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
  "amazonUrl": "https://www.amazon.com/dp/ASIN_HERE"
}
```

### Field Definitions

| Field | Type | Example | Where to Find |
|-------|------|---------|---------------|
| name | String | "Selkirk Vanguard Power Air Invikta" | Product title |
| brand | String | "Selkirk" | Product title/description |
| priceCents | Number | 17995 | Price × 100 (e.g., $179.95 = 17995) |
| weightOz | Number | 8.0 | Specifications section |
| gripCircumference | Number | 4.25 | Specifications (inches) |
| coreMaterial | String | "polymer" | Product specs (polymer/nomex/aluminum) |
| faceMaterial | String | "carbon fiber" | Product specs (carbon fiber/graphite/fiberglass) |
| shape | String | "elongated" | Product description (standard/elongated/wide-body) |
| balancePointMm | Number | 260 | Manufacturer specs (optional) |
| powerRating | Number (1-10) | 9 | Review sites like Pickler.com |
| controlRating | Number (1-10) | 7 | Review sites like Pickler.com |
| spinRating | Number (1-10) | 8 | Review sites like Pickler.com |
| sweetSpotSize | String | "large" | Reviews (small/medium/large) |
| swingWeight | Number | 115 | Advanced specs (optional) |
| twistWeight | Number | 6.8 | Advanced specs (optional) |
| handleLengthIn | Number | 5.5 | Specifications (inches) |
| usapaApproved | Boolean | true | Product page (almost always true) |
| amazonUrl | String | "https://www.amazon.com/dp/B09L3QXKJT" | Amazon product page |

## Time Estimates

### Manual Research (Top 50 Paddles)
- Finding popular paddles: 4-6 hours
- Research per paddle: 1-2 hours
- **Total: 54-106 hours**
- **Realistic timeline: 2-3 weeks part-time**

### Efficiency Tips
1. **Batch your work:**
   - Day 1: Find all 50 paddle names
   - Days 2-5: Gather specs (10-15 paddles/day)
   - Days 6-7: Get performance ratings
   - Day 8: Verify and format data

2. **Use multiple tabs:**
   - Tab 1: Pickleball Central product page
   - Tab 2: Amazon search
   - Tab 3: Pickler reviews
   - Tab 4: Data entry spreadsheet

3. **Start with high-priority paddles:**
   - Top 20 bestsellers first
   - Most expensive/premium paddles
   - Pro player signature paddles

## Next Steps: Automation

After completing manual research for top 50 paddles:

1. **Amazon Product API** (Week 2)
   - Apply for Amazon Product Advertising API
   - Automate: price updates, availability, images
   - See: `docs/AMAZON_API_SETUP.md`

2. **Web Scraping** (Week 3+, optional)
   - Automate data collection from Pickleball Central
   - See: `scripts/scrape-paddles.ts` (example)

## Resources

### Retailer Sites
- Pickleball Central: https://www.pickleballcentral.com
- Amazon Pickleball: https://www.amazon.com/s?k=pickleball+paddle
- Fromuth Pickleball: https://www.fromuthpickleball.com
- Total Pickleball: https://www.totalpickleball.com

### Review Sites
- The Pickler: https://thepickler.com/pickleball-paddle-reviews
- Pickleball Effect: https://pickleballeffect.com/paddle-reviews
- My Pickleball Coach: https://www.mypickleballcoach.com/paddle-reviews

### Community Sources
- Reddit r/Pickleball: https://www.reddit.com/r/Pickleball/
- Pickleball Forum: https://www.pickleballforum.com
- Facebook: Pickleball Enthusiasts group

### YouTube Channels
- Pickleball Studio
- Pickleball Central
- ProPickleball
- The Pickleball Clinic

## Support

Need help? Check:
- Main implementation docs: `AFFILIATE_IMPLEMENTATION.md`
- Database schema: `prisma/schema.prisma`
- Import tool: Admin UI → Paddles → Bulk Import
