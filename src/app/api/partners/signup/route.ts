import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, website, partnerType } = body;

    // Validate required fields
    if (!name || !email || !partnerType) {
      return Response.json(
        { error: 'Missing required fields: name, email, partnerType' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.partner.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create partner with free tier and trial period (SaaS model)
    const partner = await prisma.partner.create({
      data: {
        name,
        email,
        website: website || null,
        partnerType,
        subscriptionTier: 'free',
        billingStatus: 'trial', // 14-day trial period
      },
    });

    return Response.json({
      success: true,
      apiKey: partner.apiKey,
      partnerId: partner.id,
      embedCode: generateEmbedCode(partner.id),
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateEmbedCode(partnerId: string): string {
  return `<!-- PaddleFit Widget -->
<div id="paddlefit-widget"></div>
<script
  src="https://paddlefit.co/widget.js"
  data-partner="${partnerId}"
  data-target="paddlefit-widget"
></script>`;
}
