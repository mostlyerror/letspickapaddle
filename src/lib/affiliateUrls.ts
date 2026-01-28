/**
 * Affiliate URL Builder
 *
 * Builds affiliate URLs by substituting partner's affiliate IDs into URL templates.
 * Partners provide their own Amazon Associates ID, Impact ID, etc.
 */

interface PartnerAffiliateIds {
  amazonAffiliateId?: string | null;
  impactAffiliateId?: string | null;
  otherAffiliateIds?: string | null; // JSON string
}

interface AffiliateUrls {
  [retailer: string]: string;
}

/**
 * Builds affiliate URLs for a paddle using partner's affiliate IDs
 *
 * @param baseUrls - The paddle's base affiliate URL templates (stored on Paddle model)
 * @param partnerIds - The partner's affiliate IDs
 * @returns Affiliate URLs with partner's IDs substituted in
 */
export function buildPartnerAffiliateUrls(
  baseUrls: AffiliateUrls,
  partnerIds: PartnerAffiliateIds
): AffiliateUrls {
  const result: AffiliateUrls = {};

  for (const [retailer, baseUrl] of Object.entries(baseUrls)) {
    result[retailer] = substituteAffiliateId(baseUrl, retailer, partnerIds);
  }

  return result;
}

/**
 * Substitutes partner's affiliate ID into a URL based on the retailer
 */
function substituteAffiliateId(
  baseUrl: string,
  retailer: string,
  partnerIds: PartnerAffiliateIds
): string {
  // If no URL, return empty string
  if (!baseUrl) return '';

  try {
    const url = new URL(baseUrl);

    // Amazon Associates
    if (retailer === 'amazon' && partnerIds.amazonAffiliateId) {
      // Amazon uses the 'tag' parameter for affiliate ID
      url.searchParams.set('tag', partnerIds.amazonAffiliateId);
      return url.toString();
    }

    // Impact.com networks (Pickleball Central, Dick's Sporting Goods, etc.)
    const isImpactNetwork = retailer.includes('impact') ||
                           retailer.includes('pickleball') ||
                           retailer.includes('dicks');
    if (isImpactNetwork && partnerIds.impactAffiliateId) {
      // Impact uses various parameters - add as subid for tracking
      url.searchParams.set('subid', partnerIds.impactAffiliateId);
      return url.toString();
    }

    // Other affiliate networks from JSON
    if (partnerIds.otherAffiliateIds) {
      try {
        const otherIds = JSON.parse(partnerIds.otherAffiliateIds);
        if (otherIds[retailer]) {
          // Add the partner's ID as a tracking parameter
          url.searchParams.set('affiliate_id', otherIds[retailer]);
          return url.toString();
        }
      } catch {
        // Invalid JSON, ignore
      }
    }

    // If partner doesn't have an affiliate ID for this retailer,
    // return URL without modification (will earn no commission for partner)
    return baseUrl;
  } catch {
    // Invalid URL, return as-is
    return baseUrl;
  }
}

/**
 * Validates an Amazon Associates affiliate ID format
 */
export function validateAmazonAffiliateId(id: string): boolean {
  // Amazon Associate IDs must end with -20 or -21
  // Format: yoursite-20 or yoursite-21
  return /^[a-zA-Z0-9-]+-2[01]$/.test(id);
}

/**
 * Example paddle affiliate URL templates:
 *
 * Amazon:
 * https://www.amazon.com/dp/B08XYZ123?tag=PARTNER_ID_HERE
 *
 * Pickleball Central (Impact):
 * https://www.pickleballcentral.com/products/paddle-name?subid=PARTNER_ID_HERE
 *
 * Direct brand links:
 * https://www.selkirk.com/products/paddle-name?ref=PARTNER_ID_HERE
 */

/**
 * Helper to extract retailer name from URL
 */
export function getRetailerFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;

    if (hostname.includes('amazon')) return 'amazon';
    if (hostname.includes('pickleballcentral')) return 'pickleball-central';
    if (hostname.includes('dickssportinggoods')) return 'dicks';
    if (hostname.includes('selkirk')) return 'selkirk';
    if (hostname.includes('joola')) return 'joola';
    if (hostname.includes('engagepickleball')) return 'engage';

    return hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'unknown';
  }
}
