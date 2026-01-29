# Paddle Images Guide

## Current Setup

All 20 paddles currently use **placeholder images** from placeholder.com:

```
https://via.placeholder.com/400x400/0ea5e9/ffffff?text={Paddle Name}
```

These work immediately and display the paddle name on a blue background.

## Upgrading to Real Images

### Option 1: Amazon Product Advertising API (Recommended)

**Pros:**
- Official Amazon images
- Always up-to-date
- Free (within limits)
- High quality

**Steps:**
1. Set up Amazon Product Advertising API (see `docs/AMAZON_API_SETUP.md`)
2. Run the image fetch script (included in API setup)
3. Images auto-update daily

### Option 2: Manual Upload

**Pros:**
- Full control
- Custom images
- No API needed

**Steps:**
1. Download paddle images from manufacturers or Amazon
2. Save to `public/images/paddles/`
3. Update database:

```typescript
await prisma.paddle.update({
  where: { id: paddleId },
  data: {
    imageUrl: '/images/paddles/selkirk-vanguard.jpg'
  }
});
```

### Option 3: External CDN

**Pros:**
- No storage needed
- Fast delivery
- Professional

**Services:**
- Cloudinary (free tier: 25GB/month)
- imgix (free tier: 1GB/month)
- AWS S3 + CloudFront

## Scripts

### Set Placeholder Images
```bash
npx tsx scripts/set-placeholder-images.ts
```

### Fetch Amazon Images (when API is set up)
```bash
npx tsx scripts/fetch-amazon-images.ts
```

### Check Current Images
```bash
npx tsx scripts/check-images.ts
```

## Image Requirements

- **Size:** 400x400px minimum
- **Format:** JPG or PNG
- **Aspect Ratio:** Square (1:1) preferred
- **Background:** White or transparent
- **Quality:** Product photo quality

## Adding Images for New Paddles

When adding new paddles via import, you can include `imageUrl`:

```json
{
  "paddles": [
    {
      "name": "New Paddle",
      "brand": "Brand",
      "priceCents": 15995,
      "imageUrl": "https://via.placeholder.com/400?text=New+Paddle",
      "amazonUrl": "https://www.amazon.com/dp/B123456789"
    }
  ]
}
```

If omitted, a placeholder will be generated automatically.

## Image Display

Images are displayed in:
- Quiz results page
- Paddle detail pages
- Partner widgets
- Admin panel

All images use the `imageUrl` field from the database.

## Next Steps

1. **For MVP:** Keep placeholders (already working)
2. **For Launch:** Set up Amazon Product API
3. **For Scale:** Move to CDN for faster delivery

---

**Current Status:** ✅ All paddles have working placeholder images
**Next Upgrade:** Amazon Product API (see `docs/AMAZON_API_SETUP.md`)
