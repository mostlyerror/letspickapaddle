# Amazon Product Advertising API Setup

This guide explains how to set up the Amazon Product Advertising API to automate price updates and product data fetching.

## Overview

The Amazon Product Advertising API (PA API) allows you to:
- Fetch real-time product prices
- Get product images
- Check product availability
- Retrieve product details and specifications
- Generate affiliate links automatically

**Cost:** Free (requires Amazon Associates account)

## Prerequisites

1. Amazon Associates account (your affiliate account)
2. AWS account (free tier is fine)
3. Your website must comply with Amazon Associates terms

## Step 1: Apply for Amazon Associates (If Not Already a Member)

1. **Visit:** https://affiliate-program.amazon.com/
2. **Sign up** with your website URL
3. **Complete application:**
   - Website: Your domain (e.g., letspickapaddle.com)
   - Content: Describe your pickleball paddle recommendation site
   - Traffic: Estimate monthly visitors

4. **Wait for approval** (usually 1-3 days)
5. **Make 3 qualifying sales** within 180 days to keep account active

## Step 2: Sign Up for Product Advertising API

1. **Visit:** https://affiliate-program.amazon.com/assoc_credentials/home
2. **Log in** with your Associates account
3. **Navigate to:** Tools → Product Advertising API
4. **Request access** to PA API 5.0
5. **Wait for approval** (usually 1-7 days)

You'll receive:
- Access Key ID
- Secret Access Key
- Associate Tag (your affiliate ID)

## Step 3: Store Credentials Securely

Add to your `.env` file:

```bash
# Amazon Product Advertising API
AMAZON_ACCESS_KEY_ID=your_access_key_here
AMAZON_SECRET_ACCESS_KEY=your_secret_key_here
AMAZON_ASSOCIATE_TAG=yoursite-20
AMAZON_REGION=us-east-1
```

**Never commit these to git!** Make sure `.env` is in `.gitignore`.

## Step 4: Install SDK

```bash
npm install paapi5-nodejs-sdk
```

## Step 5: Create API Helper

Create `src/lib/amazon-api.ts`:

```typescript
import { ProductAdvertisingAPIv1 } from 'paapi5-nodejs-sdk';

const client = new ProductAdvertisingAPIv1();

// Configure client
client.accessKey = process.env.AMAZON_ACCESS_KEY_ID!;
client.secretKey = process.env.AMAZON_SECRET_ACCESS_KEY!;
client.host = 'webservices.amazon.com';
client.region = 'us-east-1';

export interface AmazonProduct {
  asin: string;
  title: string;
  price?: number; // in cents
  currency?: string;
  imageUrl?: string;
  availability?: string;
  url: string;
}

export async function getProductByAsin(asin: string): Promise<AmazonProduct | null> {
  try {
    const request = {
      PartnerTag: process.env.AMAZON_ASSOCIATE_TAG!,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.com',
      ItemIds: [asin],
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'Images.Primary.Large',
        'Offers.Listings.Availability'
      ]
    };

    const response = await client.getItems(request);

    if (!response.ItemsResult?.Items?.[0]) {
      return null;
    }

    const item = response.ItemsResult.Items[0];
    const offer = item.Offers?.Listings?.[0];

    return {
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || '',
      price: offer?.Price?.Amount ? Math.round(offer.Price.Amount * 100) : undefined,
      currency: offer?.Price?.Currency,
      imageUrl: item.Images?.Primary?.Large?.URL,
      availability: offer?.Availability?.Message,
      url: item.DetailPageURL || `https://www.amazon.com/dp/${asin}?tag=${process.env.AMAZON_ASSOCIATE_TAG}`
    };
  } catch (error) {
    console.error('Amazon API error:', error);
    return null;
  }
}

export async function getProductsByAsins(asins: string[]): Promise<AmazonProduct[]> {
  // API allows max 10 ASINs per request
  const batches = [];
  for (let i = 0; i < asins.length; i += 10) {
    batches.push(asins.slice(i, i + 10));
  }

  const results: AmazonProduct[] = [];

  for (const batch of batches) {
    for (const asin of batch) {
      const product = await getProductByAsin(asin);
      if (product) {
        results.push(product);
      }
      // Rate limit: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
```

## Step 6: Create Price Update Script

Create `scripts/update-amazon-prices.ts`:

```typescript
#!/usr/bin/env tsx
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { getProductByAsin } from '../src/lib/amazon-api';

const prisma = new PrismaClient();

async function updatePrices() {
  console.log('🔄 Updating Amazon prices...\n');

  const paddles = await prisma.paddle.findMany({
    where: {
      affiliateUrls: {
        not: null
      }
    }
  });

  let updated = 0;
  let failed = 0;
  let unchanged = 0;

  for (const paddle of paddles) {
    try {
      if (!paddle.affiliateUrls) continue;

      const urls = JSON.parse(paddle.affiliateUrls);
      const asin = urls.asin;

      if (!asin) {
        console.log(`  ⏭️  Skipped: ${paddle.name} (no ASIN)`);
        continue;
      }

      console.log(`  🔍 Checking: ${paddle.name}`);

      const product = await getProductByAsin(asin);

      if (!product) {
        console.log(`  ❌ Failed: ${paddle.name} (API error)`);
        failed++;
        continue;
      }

      if (product.price && product.price !== paddle.priceCents) {
        await prisma.paddle.update({
          where: { id: paddle.id },
          data: { priceCents: product.price }
        });
        console.log(`  ✅ Updated: ${paddle.name} ($${paddle.priceCents / 100} → $${product.price / 100})`);
        updated++;
      } else {
        console.log(`  ✓ Unchanged: ${paddle.name}`);
        unchanged++;
      }

      // Rate limit: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ❌ Error: ${paddle.name}`, error);
      failed++;
    }
  }

  console.log('\n✅ Update completed!');
  console.log(`  Updated: ${updated}`);
  console.log(`  Unchanged: ${unchanged}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${paddles.length}`);

  await prisma.$disconnect();
}

updatePrices();
```

## Step 7: Schedule Regular Updates

Add to your deployment (e.g., Vercel Cron or GitHub Actions):

### Option A: Vercel Cron
Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-prices",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Create `src/app/api/cron/update-prices/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { updateAllPrices } from '@/lib/amazon-price-updater';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await updateAllPrices();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
```

### Option B: GitHub Actions
Create `.github/workflows/update-prices.yml`:

```yaml
name: Update Amazon Prices

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Update prices
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AMAZON_ACCESS_KEY_ID: ${{ secrets.AMAZON_ACCESS_KEY_ID }}
          AMAZON_SECRET_ACCESS_KEY: ${{ secrets.AMAZON_SECRET_ACCESS_KEY }}
          AMAZON_ASSOCIATE_TAG: ${{ secrets.AMAZON_ASSOCIATE_TAG }}
        run: npx tsx scripts/update-amazon-prices.ts
```

## Rate Limits & Best Practices

### Amazon API Limits
- **Free tier:** 8,640 requests per day
- **Paid tier:** More requests available
- **Rate limit:** 1 request per second

### Best Practices
1. **Cache responses** (24 hours for prices)
2. **Batch updates** (once daily is usually enough)
3. **Handle errors gracefully** (products may be unavailable)
4. **Store ASIN separately** for easy updates
5. **Monitor API usage** in Associates dashboard

## What You Can Automate

### With PA API ✅
- Real-time prices
- Product images
- Availability status
- Product ratings/reviews count
- Affiliate links

### Still Need Manual Entry ❌
- Performance ratings (power/control/spin)
- Physical specs (weight, materials)
- Sweet spot size
- Balance point
- Swing/twist weight

These require expert reviews and testing.

## Troubleshooting

### Error: "Invalid Access Key"
- Double-check credentials in `.env`
- Ensure you've been approved for PA API
- Verify Associate Tag format: `yoursite-20`

### Error: "Too Many Requests"
- You're hitting rate limit (1 req/sec)
- Add delays between requests
- Reduce batch sizes

### Products Not Found
- Product may be unavailable
- ASIN may be incorrect
- Product may be region-specific

### No Price Returned
- Product may be out of stock
- Price may be variable (multiple sellers)
- Fall back to cached price

## Cost Estimate

**Free tier:**
- 8,640 requests/day
- 50 paddles updated daily = 50 requests
- Well within free limits!

**Paid tier only needed if:**
- Updating 1000+ products
- Multiple updates per day
- High-frequency price monitoring

## Next Steps

1. **Set up API credentials** (Steps 1-3)
2. **Test with a few ASINs** (Step 5)
3. **Run price update script** (Step 6)
4. **Schedule daily updates** (Step 7)
5. **Monitor API usage** in Associates dashboard

## Alternative: Simple Price Checking

If you don't want to set up PA API, you can:

1. **Manual updates** (check prices weekly)
2. **Use web scraping** (may violate ToS)
3. **Third-party services** (Keepa, CamelCamelCamel)
4. **Just use static links** (accept some price drift)

For a small catalog (50-100 paddles), manual updates weekly is totally viable!
