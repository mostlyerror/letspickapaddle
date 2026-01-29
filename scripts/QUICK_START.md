# Quick Start: Collecting Paddle Data

This guide will walk you through collecting paddle data for the top 50 popular paddles.

## Setup (5 minutes)

1. **Create a workspace folder:**
   ```bash
   mkdir ~/paddle-research
   cd ~/paddle-research
   ```

2. **Copy the template:**
   ```bash
   cp /path/to/letspickapaddle/scripts/paddle-data-template.json my-paddles.json
   ```

3. **Open your tools:**
   - Text editor with `my-paddles.json`
   - Browser with these tabs:
     - Pickleball Central
     - Amazon
     - Pickler reviews
     - Reddit

## Step-by-Step Collection Process

### Part 1: Find the Top 50 Paddles (2 hours)

#### Visit Pickleball Central Bestsellers
1. Go to: https://www.pickleballcentral.com/best_sellers.asp
2. Copy the top 30 paddle names to a text file
3. Note approximate prices

#### Visit Amazon Bestsellers
1. Go to: https://www.amazon.com/Best-Sellers-Sports-Outdoors-Pickleball-Paddles/zgbs/sporting-goods/16329141
2. Add 20 more paddles not in your list
3. Note their ASINs (in URL after `/dp/`)

#### YouTube Quick Check
1. Search: "Best Pickleball Paddles 2025"
2. Watch top 2 videos
3. Add any highly-rated paddles you're missing

**Result:** A list of 50 paddle names

### Part 2: Collect Data (50 hours - do in batches!)

For each paddle, follow this workflow:

#### Day 1-2: Basic Info (10 paddles, ~10 hours)

1. **Search on Pickleball Central or Amazon**
   - Find the product page
   - Copy name, brand, price

2. **Get specifications from product page:**
   - Weight (oz)
   - Grip circumference (inches)
   - Core material (polymer/nomex/aluminum)
   - Face material (carbon fiber/graphite/fiberglass)
   - Shape (standard/elongated/wide-body)
   - Handle length (inches)

3. **Find on Amazon:**
   - Copy full URL
   - Extract ASIN from URL (after `/dp/`)

4. **Add to JSON:**
   ```json
   {
     "name": "Paddle Name Here",
     "brand": "Brand",
     "priceCents": 17995,
     "weightOz": 8.0,
     "gripCircumference": 4.25,
     "coreMaterial": "polymer",
     "faceMaterial": "carbon fiber",
     "shape": "elongated",
     "handleLengthIn": 5.5,
     "usapaApproved": true,
     "amazonUrl": "https://www.amazon.com/dp/ASIN_HERE"
   }
   ```

#### Day 3-4: Performance Ratings (10 paddles, ~5 hours)

1. **Visit Pickler.com:**
   - Search: https://thepickler.com/pickleball-paddle-reviews
   - Find your paddle review
   - Note power, control, spin ratings (1-10)

2. **Alternative sources if not on Pickler:**
   - YouTube reviews
   - Amazon reviews (estimate based on feedback)

3. **Add ratings to JSON:**
   ```json
   {
     "powerRating": 9,
     "controlRating": 7,
     "spinRating": 8
   }
   ```

#### Day 5: Advanced Specs (optional, 2-5 hours)

Only if easily available:
- Balance point (mm)
- Sweet spot size (small/medium/large)
- Swing weight
- Twist weight

### Part 3: Validation & Import (1 hour)

1. **Validate your data:**
   ```bash
   cd /path/to/letspickapaddle
   npx tsx scripts/validate-paddle-data.ts ~/paddle-research/my-paddles.json
   ```

2. **Fix any errors** shown by the validator

3. **Import to database:**
   ```bash
   npx tsx scripts/import-paddles.ts ~/paddle-research/my-paddles.json
   ```

## Time-Saving Tips

### Batch Your Work
- **Morning:** Collect basic specs for 5-10 paddles
- **Afternoon:** Add Amazon URLs and ASINs
- **Evening:** Research ratings

### Use Keyboard Shortcuts
- **Ctrl/Cmd + C:** Copy
- **Ctrl/Cmd + V:** Paste
- **Ctrl/Cmd + F:** Find on page
- **Ctrl/Cmd + T:** New tab

### Template Shortcuts
Save common JSON structures:

```json
// Template for polymer core, carbon fiber paddles (most common)
{
  "name": "",
  "brand": "",
  "priceCents": 0,
  "weightOz": 8.0,
  "gripCircumference": 4.25,
  "coreMaterial": "polymer",
  "faceMaterial": "carbon fiber",
  "shape": "standard",
  "handleLengthIn": 5.5,
  "usapaApproved": true,
  "amazonUrl": ""
}
```

### Focus on High-Value Paddles First
1. **Week 1:** Top 20 bestsellers (highest priority)
2. **Week 2:** Next 15 popular paddles
3. **Week 3:** Final 15 + quality check

## Realistic Schedule

### Part-Time (2 hours/day)
- **Week 1:** Find top 50, research 10 paddles fully
- **Week 2:** Research 20 more paddles
- **Week 3:** Research final 20 paddles
- **Week 4:** Validate, import, polish

### Full-Time (6 hours/day)
- **Day 1:** Find top 50
- **Days 2-6:** Research 10 paddles/day
- **Day 7:** Validate & import

### Weekend Warrior (8 hours/weekend)
- **Weekend 1:** Find top 50 + research 15 paddles
- **Weekend 2:** Research 20 paddles
- **Weekend 3:** Research 15 paddles + validate/import

## What to Do When Stuck

### Can't Find Specifications?
1. Check manufacturer's website
2. Search YouTube for review videos
3. Check Amazon Q&A section
4. Leave field empty (most are optional)

### Can't Find Ratings?
1. Search Pickler.com
2. Watch YouTube reviews
3. Read Amazon reviews
4. Estimate based on similar paddles
5. Leave empty if unsure

### Can't Find Amazon Link?
1. Search Amazon with exact paddle name
2. Try searching by brand + model
3. Check if it's sold under different name
4. Use alternative retailer link (Pickleball Central)
5. Leave empty (can add later)

### Duplicate Paddles?
- Some paddles have multiple versions (16mm vs 14mm)
- Include both as separate entries
- Note version in name: "Paddle Name 16mm"

## Quality Checks

Before importing, verify:
- [ ] All paddles have name, brand, price
- [ ] Prices are in cents (multiply by 100)
- [ ] At least 80% have Amazon URLs
- [ ] At least 70% have ratings
- [ ] No obvious typos in paddle names
- [ ] JSON is valid (use validator script)

## Next Steps

Once you have 50 paddles:

1. **Monitor for new releases:**
   - Check bestsellers monthly
   - Watch for Reddit buzz
   - Follow YouTube reviewers

2. **Add more data:**
   - Get missing ratings
   - Add images
   - Include manufacturer descriptions

3. **Consider automation:**
   - See: `docs/AMAZON_API_SETUP.md`
   - Set up price monitoring
   - Auto-update availability

## Need Help?

- **Validation errors:** Run `npx tsx scripts/validate-paddle-data.ts` for details
- **Import issues:** Check database connection in `.env`
- **Data format:** See `scripts/paddle-data-template.json`
- **Main docs:** See `AFFILIATE_IMPLEMENTATION.md`
