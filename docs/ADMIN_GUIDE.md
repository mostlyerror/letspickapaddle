# Admin Panel Guide

## Overview

The admin panel allows you to manage affiliate links for paddles. This is the interface for populating and maintaining Amazon product URLs that get injected with partner affiliate IDs.

## Accessing the Admin Panel

Navigate to: `/admin/paddles`

## Features

### 1. Paddle List View (`/admin/paddles`)

The main dashboard shows:
- **Total paddles** in the database
- **Paddles with Amazon links** (green checkmark)
- **Paddles missing links** (orange X)
- **Table view** of all paddles with:
  - Paddle name
  - Brand
  - Price
  - Amazon link status
  - Edit action

**Actions available:**
- **Import JSON** - Bulk upload Amazon URLs from a JSON file
- **Export JSON** - Download current paddle links as backup
- **Edit** - Update individual paddle's Amazon URL

---

### 2. Edit Individual Paddle (`/admin/paddles/[id]/edit`)

Edit page for a specific paddle includes:

**Paddle Details Card:**
- Name, brand, price
- Power and control ratings

**Amazon URL Input:**
- Text field for pasting Amazon product URL
- Format: `https://www.amazon.com/dp/ASIN`
- URL validation (must be from amazon.com)

**Preview Section:**
- Shows how the URL will look with a sample partner ID
- Displays the `?tag=` parameter that tracks commissions

**Help Guide:**
- Step-by-step instructions for finding Amazon ASINs
- Example: Search paddle name → Copy URL → Simplify format

---

### 3. Bulk Import (`/admin/paddles/import`)

Upload a JSON file to update multiple paddles at once.

**Step 1: Upload JSON File**
- Accepts `.json` files only
- Shows expected format example

**Step 2: Preview Changes**
- Table showing paddle name and Amazon URL
- Review before applying

**Step 3: Apply Import**
- One-click to execute all updates
- Shows detailed results per paddle

**Expected JSON Format:**

```json
{
  "Selkirk Vanguard Power Air Invikta": "https://www.amazon.com/dp/B09L3QXKJT",
  "JOOLA Ben Johns Hyperion CFS 16": "https://www.amazon.com/dp/B0B8VXNR7L",
  "Engage Pursuit Pro MX 6.0": "https://www.amazon.com/dp/B0CJQN9KJD"
}
```

**Keys:** Exact paddle name (from database)
**Values:** Amazon product URL

---

## How Amazon Affiliate URLs Work

### Base URL Storage

Paddle affiliate URLs are stored in the database as JSON:

```json
{
  "amazon": "https://www.amazon.com/dp/B09ABC123"
}
```

### Partner ID Injection

When a partner makes a recommendation, their Amazon Associates ID gets injected:

**Partner has:**
- Amazon Affiliate ID: `yoursite-20`

**Recommendation returns:**
```json
{
  "affiliateUrls": {
    "amazon": "https://www.amazon.com/dp/B09ABC123?tag=yoursite-20"
  }
}
```

The `?tag=yoursite-20` parameter:
- Tracks clicks to Amazon
- Attributes purchases to the partner
- Partner earns 100% of affiliate commissions

---

## Finding Amazon ASINs

### Manual Research Process

1. **Search Amazon.com**
   - Use exact paddle name from database
   - Example: "Selkirk Vanguard Power Air Invikta"

2. **Find the Product**
   - Click on matching product
   - Verify price and specs match

3. **Extract ASIN**
   - **Method 1:** From URL
     - Full URL: `https://www.amazon.com/Selkirk-Vanguard-Invikta/dp/B09L3QXKJT/ref=...`
     - ASIN is the 10-character code after `/dp/`
     - Simplified: `https://www.amazon.com/dp/B09L3QXKJT`

   - **Method 2:** From Product Details
     - Scroll to "Product Information"
     - Look for "ASIN: B09L3QXKJT"

4. **Record URL**
   - Use format: `https://www.amazon.com/dp/[ASIN]`
   - Remove all other parameters

### Tips

- ASIN format: 10 characters (letters and numbers), e.g., `B09L3QXKJT`
- If multiple versions exist (colors, sizes), pick the default
- Verify price is within ±$20 of database price
- Not all paddles may be available on Amazon (that's okay)

---

## Using the Import Scripts

### Import Amazon Links

Populates database from `amazon-links.json`:

```bash
npx tsx scripts/import-amazon-links.ts
```

**Output:**
- Shows progress for each paddle
- Summary of successful/failed imports
- Lists any errors

### Test Affiliate URLs

Verifies the affiliate system is working:

```bash
npx tsx scripts/test-affiliate-urls.ts
```

**Checks:**
- Database has Amazon links
- URL builder injects partner IDs correctly
- Simulates API response
- Reports coverage percentage

### Test API Integration

Full end-to-end test with recommendation engine:

```bash
npx tsx scripts/test-api-integration.ts
```

**Verifies:**
- Creates/uses test partner with affiliate IDs
- Runs recommendation algorithm
- Confirms affiliate tags in results
- Reports pass/fail

---

## Maintenance

### Regular Tasks

1. **Quarterly URL Check**
   - Export current links as backup
   - Verify links are not 404s
   - Update any changed ASINs

2. **New Paddles**
   - When adding new paddles to database
   - Research Amazon ASIN
   - Add via admin UI or bulk import

3. **Bulk Updates**
   - Use Export → Edit → Import workflow
   - Download JSON, edit in text editor
   - Re-upload via bulk import

### Monitoring

Check analytics for:
- Which paddles get most clicks
- Broken affiliate links (no purchases)
- Popular brands to prioritize

---

## Troubleshooting

### Problem: "Invalid Amazon URL format"

**Solution:** URL must be from `amazon.com` and include ASIN
- Correct: `https://www.amazon.com/dp/B09ABC123`
- Incorrect: `https://amzn.to/xyz` (short link)
- Incorrect: `https://www.amazon.co.uk/...` (wrong region)

### Problem: "Paddle not found"

**Solution:** Paddle name must match exactly
- Check database for exact spelling
- Names are case-insensitive
- Check for extra spaces or special characters

### Problem: Affiliate links not showing in API

**Possible causes:**
1. Paddle doesn't have Amazon URL → Add via admin
2. Partner doesn't have affiliate ID → Update partner settings
3. Database not updated → Verify with test script

### Problem: Import shows errors

**Check the JSON file:**
- Valid JSON syntax (use jsonlint.com)
- Exact paddle names
- Valid Amazon URLs
- No trailing commas

---

## API Reference

### Import Endpoint

**POST** `/api/admin/import-affiliate-urls`

**Request Body:**
```json
{
  "data": {
    "Paddle Name": "https://www.amazon.com/dp/ASIN"
  }
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 20,
    "successful": 18,
    "failed": 2
  },
  "results": [
    {
      "paddle": "Paddle Name",
      "status": "success"
    },
    {
      "paddle": "Another Paddle",
      "status": "error",
      "message": "Paddle not found"
    }
  ]
}
```

---

## Future Enhancements

Potential additions to the admin panel:

1. **Additional Retailers**
   - Pickleball Central (Impact network)
   - Direct brand sites (Selkirk, JOOLA, etc.)
   - Dick's Sporting Goods

2. **Automation**
   - Automatic ASIN lookup via Amazon Product API
   - Link validation (check for 404s)
   - Price monitoring

3. **Analytics Integration**
   - Click tracking per retailer
   - Conversion rates
   - Most popular products

4. **Enhanced UI**
   - Bulk select for batch operations
   - Filtering by brand, price range
   - Search functionality
   - CSV import support

---

## Security Notes

**Current Protection:**
- Admin routes are publicly accessible
- No authentication required

**Recommended for Production:**
- Add authentication middleware
- Require API key or admin login
- Log all changes for audit trail
- Rate limiting on import endpoint

**Example Protection:**
```typescript
// In admin pages
import { auth } from '@/lib/auth';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect('/login');
  }
  // ... rest of page
}
```
