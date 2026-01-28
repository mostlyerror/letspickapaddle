import { describe, it, expect } from 'vitest';
import {
  buildPartnerAffiliateUrls,
  validateAmazonAffiliateId,
  getRetailerFromUrl,
} from '../affiliateUrls';

describe('affiliateUrls', () => {
  describe('buildPartnerAffiliateUrls', () => {
    it('should inject Amazon affiliate ID into Amazon URLs', () => {
      const baseUrls = {
        amazon: 'https://www.amazon.com/dp/B08XYZ123',
      };
      const partnerIds = {
        amazonAffiliateId: 'pickleballpro-20',
      };

      const result = buildPartnerAffiliateUrls(baseUrls, partnerIds);

      expect(result.amazon).toBe(
        'https://www.amazon.com/dp/B08XYZ123?tag=pickleballpro-20'
      );
    });

    it('should inject Impact affiliate ID into Impact URLs', () => {
      const baseUrls = {
        impact: 'https://www.pickleballcentral.com/products/paddle',
      };
      const partnerIds = {
        impactAffiliateId: '12345',
      };

      const result = buildPartnerAffiliateUrls(baseUrls, partnerIds);

      expect(result.impact).toContain('subid=12345');
    });

    it('should handle multiple retailers', () => {
      const baseUrls = {
        amazon: 'https://www.amazon.com/dp/B08XYZ123',
        'pickleball-central': 'https://www.pickleballcentral.com/products/paddle',
      };
      const partnerIds = {
        amazonAffiliateId: 'test-20',
        impactAffiliateId: '99999',
      };

      const result = buildPartnerAffiliateUrls(baseUrls, partnerIds);

      expect(result.amazon).toContain('tag=test-20');
      expect(result['pickleball-central']).toContain('subid=99999');
    });

    it('should return original URL if no matching affiliate ID', () => {
      const baseUrls = {
        amazon: 'https://www.amazon.com/dp/B08XYZ123',
      };
      const partnerIds = {}; // No affiliate IDs

      const result = buildPartnerAffiliateUrls(baseUrls, partnerIds);

      expect(result.amazon).toBe('https://www.amazon.com/dp/B08XYZ123');
    });

    it('should handle otherAffiliateIds JSON', () => {
      const baseUrls = {
        selkirk: 'https://www.selkirk.com/products/paddle',
      };
      const partnerIds = {
        otherAffiliateIds: JSON.stringify({ selkirk: 'ref123' }),
      };

      const result = buildPartnerAffiliateUrls(baseUrls, partnerIds);

      expect(result.selkirk).toContain('affiliate_id=ref123');
    });

    it('should handle invalid URLs gracefully', () => {
      const baseUrls = {
        invalid: 'not-a-url',
      };
      const partnerIds = {
        amazonAffiliateId: 'test-20',
      };

      const result = buildPartnerAffiliateUrls(baseUrls, partnerIds);

      expect(result.invalid).toBe('not-a-url');
    });
  });

  describe('validateAmazonAffiliateId', () => {
    it('should validate correct Amazon affiliate ID formats', () => {
      expect(validateAmazonAffiliateId('pickleballpro-20')).toBe(true);
      expect(validateAmazonAffiliateId('my-site-21')).toBe(true);
      expect(validateAmazonAffiliateId('test123-20')).toBe(true);
    });

    it('should reject incorrect Amazon affiliate ID formats', () => {
      expect(validateAmazonAffiliateId('pickleballpro')).toBe(false);
      expect(validateAmazonAffiliateId('pickleballpro-19')).toBe(false);
      expect(validateAmazonAffiliateId('pickleballpro-22')).toBe(false);
      expect(validateAmazonAffiliateId('test-')).toBe(false);
      expect(validateAmazonAffiliateId('')).toBe(false);
    });
  });

  describe('getRetailerFromUrl', () => {
    it('should extract retailer from Amazon URL', () => {
      expect(getRetailerFromUrl('https://www.amazon.com/dp/B08XYZ123')).toBe('amazon');
      expect(getRetailerFromUrl('https://amazon.com/something')).toBe('amazon');
    });

    it('should extract retailer from Pickleball Central URL', () => {
      expect(
        getRetailerFromUrl('https://www.pickleballcentral.com/products/paddle')
      ).toBe('pickleball-central');
    });

    it('should extract retailer from brand URLs', () => {
      expect(getRetailerFromUrl('https://www.selkirk.com/products/paddle')).toBe(
        'selkirk'
      );
      expect(getRetailerFromUrl('https://www.joola.com/products/paddle')).toBe('joola');
      expect(
        getRetailerFromUrl('https://www.engagepickleball.com/products/paddle')
      ).toBe('engage');
    });

    it('should handle unknown retailers', () => {
      const result = getRetailerFromUrl('https://www.unknown-retailer.com/products/paddle');
      expect(result).toBe('unknown-retailer');
    });

    it('should handle invalid URLs', () => {
      expect(getRetailerFromUrl('not-a-url')).toBe('unknown');
    });
  });
});
