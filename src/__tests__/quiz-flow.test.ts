import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = 'http://localhost:3000';

describe('Quiz Flow Integration Tests', () => {
  let sessionId: string;
  const testResponses = {
    playStyle: 'power',
    skillLevel: 'intermediate',
    budget: 'premium',
    weight: 'medium',
  };

  beforeAll(() => {
    sessionId = `test-${Date.now()}`;
  });

  it('should fetch quiz questions', async () => {
    const response = await fetch(`${API_BASE}/api/quiz/questions`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it('should save quiz responses', async () => {
    const response = await fetch(`${API_BASE}/api/quiz/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
  });

  it('should generate paddle recommendations', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it('should include required fields in recommendations', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();
    const firstRec = data.data[0];

    // Required fields
    expect(firstRec).toHaveProperty('id');
    expect(firstRec).toHaveProperty('name');
    expect(firstRec).toHaveProperty('brand');
    expect(firstRec).toHaveProperty('priceCents');
    expect(firstRec).toHaveProperty('score');
    expect(firstRec).toHaveProperty('matchReasons');
    expect(firstRec).toHaveProperty('affiliateUrls');

    // Validate types
    expect(typeof firstRec.name).toBe('string');
    expect(typeof firstRec.brand).toBe('string');
    expect(typeof firstRec.priceCents).toBe('number');
    expect(typeof firstRec.score).toBe('number');
    expect(Array.isArray(firstRec.matchReasons)).toBe(true);
    expect(typeof firstRec.affiliateUrls).toBe('object');
  });

  it('should have match reasons in recommendations', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();
    const firstRec = data.data[0];

    expect(firstRec.matchReasons).toBeDefined();
    expect(Array.isArray(firstRec.matchReasons)).toBe(true);
    expect(firstRec.matchReasons.length).toBeGreaterThan(0);
    expect(firstRec.matchReasons.every((r: any) => typeof r === 'string')).toBe(true);
  });

  it('should have affiliate URLs in recommendations', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();
    const firstRec = data.data[0];

    expect(firstRec.affiliateUrls).toBeDefined();
    expect(typeof firstRec.affiliateUrls).toBe('object');

    // Should have at least one affiliate URL
    const hasAffiliateUrls = Object.keys(firstRec.affiliateUrls).length > 0;
    expect(hasAffiliateUrls).toBe(true);
  });

  it('should calculate match scores between 0-100', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();

    data.data.forEach((rec: any) => {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(100);
    });
  });

  it('should return recommendations sorted by score', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();
    const scores = data.data.map((rec: any) => rec.score);

    // Check if sorted descending
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });

  it('should have image URLs for all recommendations', async () => {
    const response = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        responses: testResponses,
      }),
    });

    const data = await response.json();

    data.data.forEach((rec: any) => {
      expect(rec).toHaveProperty('imageUrl');
      expect(typeof rec.imageUrl).toBe('string');
      expect(rec.imageUrl.length).toBeGreaterThan(0);
      expect(rec.imageUrl).toMatch(/^https?:\/\//); // Should be a URL
    });
  });
});
