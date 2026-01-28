# Partner Affiliate Setup Guide

## How Partners Earn Commissions

**You keep 100% of affiliate commissions!** PaddleFit charges a simple monthly platform fee ($0-79/month), and all affiliate revenue goes directly to you.

To earn commissions, you need to:
1. Join affiliate programs (Amazon Associates, etc.)
2. Provide your affiliate IDs to PaddleFit
3. We'll automatically inject your IDs into paddle purchase links

---

## Step-by-Step Setup

### Step 1: Join Amazon Associates (Required)

Most paddles are available on Amazon, so this is the most important affiliate program to join.

1. **Go to:** https://affiliate-program.amazon.com
2. **Sign up** with your website URL
3. **Get approved** (usually 24-48 hours)
4. **Find your Affiliate ID** in the dashboard
   - Format: `yoursite-20` or `yoursite-21`
   - Example: `pickleballpro-20`

**Important:** Your Amazon Affiliate ID must match the format `xxx-20` or `xxx-21` (Amazon requirement)

### Step 2: Add Your Amazon Affiliate ID to PaddleFit

#### Option A: Via API (For developers)
```bash
curl -X PUT https://paddlefit.co/api/partners/YOUR_PARTNER_ID/affiliate-ids \
  -H "Content-Type: application/json" \
  -d '{
    "amazonAffiliateId": "yoursite-20"
  }'
```

#### Option B: Via Partner Dashboard (Coming Soon)
Navigate to Settings > Affiliate IDs and enter your Amazon Affiliate ID.

### Step 3: Join Additional Affiliate Programs (Optional)

#### Pickleball Central (via Impact.com)
- **Network:** Impact.com
- **Commission:** 8-10%
- **Sign up:** Contact Pickleball Central or apply via Impact
- **ID Format:** Your Impact account ID
- **Add to PaddleFit:** Use `impactAffiliateId` field

#### Direct Brand Programs
Some paddle brands offer direct affiliate programs:

- **Selkirk:** https://www.selkirk.com/pages/affiliate
- **JOOLA:** Contact team@joolausa.com
- **Engage:** https://www.engagepickleball.com/affiliate

For these, add to `otherAffiliateIds`:

```json
{
  "selkirk": "your-selkirk-ref-id",
  "joola": "your-joola-id",
  "engage": "your-engage-id"
}
```

---

## How Affiliate URLs Work

### Before Setup (No Commissions)
When a user clicks "Buy on Amazon", they see:
```
https://amazon.com/dp/B08XYZ123
```
**Result:** Sale goes through, but you earn nothing.

### After Setup (With Your Affiliate ID)
When a user clicks "Buy on Amazon", they see:
```
https://amazon.com/dp/B08XYZ123?tag=yoursite-20
```
**Result:** Sale is tracked to YOUR Amazon Associates account. You earn the commission!

### URL Template System

PaddleFit stores base URLs for each paddle:
```json
{
  "amazon": "https://amazon.com/dp/B08XYZ123",
  "pickleball-central": "https://pickleballcentral.com/products/paddle-name",
  "selkirk": "https://selkirk.com/products/paddle-name"
}
```

When a user takes the quiz, we substitute YOUR affiliate IDs:
```json
{
  "amazon": "https://amazon.com/dp/B08XYZ123?tag=yoursite-20",
  "pickleball-central": "https://pickleballcentral.com/products/paddle-name?subid=your-impact-id",
  "selkirk": "https://selkirk.com/products/paddle-name?ref=your-selkirk-id"
}
```

---

## API Reference

### Get Affiliate IDs
```
GET /api/partners/{partnerId}/affiliate-ids
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amazonAffiliateId": "yoursite-20",
    "impactAffiliateId": "12345",
    "otherAffiliateIds": {
      "selkirk": "ref123",
      "joola": "joola456"
    }
  }
}
```

### Update Affiliate IDs
```
PUT /api/partners/{partnerId}/affiliate-ids
```

**Request Body:**
```json
{
  "amazonAffiliateId": "yoursite-20",
  "impactAffiliateId": "12345",
  "otherAffiliateIds": {
    "selkirk": "ref123",
    "joola": "joola456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Affiliate IDs updated successfully",
  "data": {
    "amazonAffiliateId": "yoursite-20",
    "impactAffiliateId": "12345",
    "otherAffiliateIds": {
      "selkirk": "ref123",
      "joola": "joola456"
    }
  }
}
```

---

## Validation Rules

### Amazon Affiliate ID
- **Format:** Must end with `-20` or `-21`
- **Examples:**
  - ✅ `pickleballpro-20`
  - ✅ `my-site-21`
  - ❌ `pickleballpro` (missing suffix)
  - ❌ `pickleballpro-19` (wrong number)

### Impact Affiliate ID
- **Format:** Typically numeric
- **Examples:**
  - ✅ `12345`
  - ✅ `abc123def`

### Other Affiliate IDs
- **Format:** JSON object with retailer keys
- **Example:**
```json
{
  "selkirk": "ref-code-123",
  "joola": "partner-456",
  "engage": "engage-789"
}
```

---

## Testing Your Setup

### 1. Update Your Affiliate IDs
Use the API or dashboard to add your affiliate ID.

### 2. Test the Widget
Open your website with the embedded quiz and complete it.

### 3. Check the Recommended Paddle Links
Right-click on "Buy on Amazon" and inspect the URL. You should see your affiliate ID:
```
https://amazon.com/...?tag=yoursite-20
```

### 4. Make a Test Purchase (Optional)
Click through and make a small purchase to verify tracking works.

### 5. Check Your Affiliate Dashboard
After 24-48 hours, check your Amazon Associates dashboard for the tracked click/sale.

---

## Troubleshooting

### Issue: Affiliate ID Not Showing in Links

**Possible Causes:**
1. Affiliate ID not saved properly
2. Browser cache (hard refresh: Cmd+Shift+R)
3. Wrong paddle (some paddles may not have Amazon links)

**Solution:**
- Use GET endpoint to verify your affiliate ID is saved
- Clear browser cache and reload
- Try with a different paddle

### Issue: Amazon Rejects My Affiliate ID

**Error:** "Invalid Amazon Affiliate ID format"

**Solution:**
- Amazon IDs must end with `-20` or `-21`
- Check for typos
- Verify in your Amazon Associates dashboard

### Issue: Not Earning Commissions

**Possible Causes:**
1. Affiliate ID not set up correctly
2. Cookie was blocked (ad blockers, privacy settings)
3. User didn't purchase within cookie window (24 hours for Amazon)
4. Affiliate account needs approval/reapproval

**Solution:**
- Verify your affiliate ID is in the URLs
- Test in incognito mode without ad blockers
- Check your affiliate network dashboards for issues
- Contact affiliate network support if persistent

---

## Commission Rates by Retailer

| Retailer | Network | Typical Commission | Cookie Duration |
|----------|---------|-------------------|-----------------|
| Amazon | Amazon Associates | 1-5% | 24 hours |
| Pickleball Central | Impact.com | 8-10% | 30 days |
| Dick's Sporting Goods | Impact.com | 3-5% | 7 days |
| Selkirk (Direct) | Selkirk Affiliate | 10-15% | 30 days |
| JOOLA (Direct) | JOOLA Affiliate | 10-15% | 30 days |

**Note:** Rates vary by product category and network policies. Check with each affiliate program for current rates.

---

## Example Monthly Earnings

### Scenario: Blog with 500 quiz completions/month

**Assumptions:**
- 10% click-through rate on "Buy" buttons = 50 clicks
- 3% conversion rate = 1.5 sales
- Average paddle price: $180
- Average Amazon commission: 4% = $7.20/sale

**Monthly Revenue:**
- 1.5 sales × $7.20 = **~$11/month** from Amazon alone
- Plus commissions from other retailers
- **Total estimate: $15-25/month**

**Your costs:**
- Starter tier: $29/month
- **Net: Break even at ~4 sales/month**

### Scenario: High-traffic site with 2,000 completions/month

**Assumptions:**
- 15% CTR = 300 clicks
- 4% conversion = 12 sales
- $180 avg × 4% = $7.20/sale

**Monthly Revenue:**
- 12 sales × $7.20 = **~$86/month**
- Plus other retailers
- **Total estimate: $120-150/month**

**Your costs:**
- Pro tier: $79/month
- **Net profit: $40-70/month**

Plus you keep 100% of this - no revenue share with PaddleFit!

---

## Best Practices

### 1. Join All Major Programs
Don't just rely on Amazon. Join:
- Amazon Associates (required)
- Impact.com (Pickleball Central, Dick's)
- Direct brand programs (Selkirk, JOOLA, Engage)

### 2. Update IDs Promptly
As soon as you join a new affiliate program, add the ID to PaddleFit so you don't miss commissions.

### 3. Monitor Your Dashboards
Check your affiliate dashboards weekly to:
- Track clicks and conversions
- Identify best-performing paddles
- Ensure tracking is working

### 4. Disclose Affiliate Relationships
Add a disclosure to your website:
> "We may earn a commission if you purchase through our affiliate links. This helps support our content at no extra cost to you."

### 5. Test Regularly
Click through your own widget periodically to ensure affiliate links are working.

---

## FAQ

### Q: Do I need affiliate accounts to use PaddleFit?

**A:** No! You can use the widget without affiliate IDs. But you won't earn commissions on paddle sales. We recommend setting up at least Amazon Associates.

### Q: Can I use PaddleFit's affiliate accounts instead?

**A:** No. To comply with affiliate program terms and ensure YOU get paid, you must use your own affiliate accounts.

### Q: What happens if I don't set up affiliate IDs?

**A:** The widget works normally, but purchase links won't have any affiliate tracking. Sales will complete, but you won't earn commissions.

### Q: Can I change my affiliate IDs later?

**A:** Yes! You can update your affiliate IDs anytime via the API or dashboard. Changes take effect immediately.

### Q: How long does it take to get paid?

**A:** Payment timing depends on each affiliate network:
- Amazon Associates: Monthly (60-day lag)
- Impact.com: Monthly (30-60 day lag)
- Direct programs: Varies (check terms)

### Q: Do I need to report affiliate income?

**A:** Yes, affiliate commissions are taxable income. Consult your tax advisor for specifics.

---

## Support

### Need Help?
- **Documentation:** This guide
- **API Docs:** `/api/partners/[partnerId]/affiliate-ids`
- **Technical Issues:** Create an issue on GitHub
- **Business Questions:** Email partners@paddlefit.co

### Affiliate Network Support
- **Amazon Associates:** https://affiliate-program.amazon.com/help
- **Impact.com:** https://impact.com/support
- **Brand Programs:** Contact the brand directly

---

*Last Updated: January 28, 2026*
