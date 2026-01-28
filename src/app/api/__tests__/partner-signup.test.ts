import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
const mockPrisma = {
  partner: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

describe('Partner Signup API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new partner with correct subscription tier', async () => {
    const mockPartner = {
      id: 'test-partner-id',
      name: 'Test Partner',
      email: 'test@example.com',
      website: 'https://test.com',
      partnerType: 'blog',
      subscriptionTier: 'free',
      billingStatus: 'trial',
      apiKey: 'test-api-key',
    };

    mockPrisma.partner.findUnique.mockResolvedValue(null); // No existing partner
    mockPrisma.partner.create.mockResolvedValue(mockPartner);

    // Import the POST handler
    const { POST } = await import('../partners/signup/route');

    const request = new Request('http://localhost/api/partners/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Partner',
        email: 'test@example.com',
        website: 'https://test.com',
        partnerType: 'blog',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.partnerId).toBe('test-partner-id');
    expect(data.embedCode).toContain('test-partner-id');
    expect(mockPrisma.partner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          subscriptionTier: 'free',
          billingStatus: 'trial',
        }),
      })
    );
  });

  it('should reject duplicate email', async () => {
    mockPrisma.partner.findUnique.mockResolvedValue({
      id: 'existing-id',
      email: 'test@example.com',
    });

    const { POST } = await import('../partners/signup/route');

    const request = new Request('http://localhost/api/partners/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Partner',
        email: 'test@example.com',
        partnerType: 'blog',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email already registered');
  });

  it('should validate required fields', async () => {
    const { POST } = await import('../partners/signup/route');

    const request = new Request('http://localhost/api/partners/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Partner',
        // Missing email and partnerType
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('should return embed code with partner ID', async () => {
    const mockPartner = {
      id: 'partner-123',
      name: 'Test Partner',
      email: 'test@example.com',
      partnerType: 'blog',
      subscriptionTier: 'free',
      billingStatus: 'trial',
    };

    mockPrisma.partner.findUnique.mockResolvedValue(null);
    mockPrisma.partner.create.mockResolvedValue(mockPartner);

    const { POST } = await import('../partners/signup/route');

    const request = new Request('http://localhost/api/partners/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Partner',
        email: 'test@example.com',
        partnerType: 'blog',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.embedCode).toContain('data-partner="partner-123"');
    expect(data.embedCode).toContain('widget.js');
  });
});
