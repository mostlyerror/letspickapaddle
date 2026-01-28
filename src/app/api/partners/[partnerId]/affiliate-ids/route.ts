import { prisma } from '@/lib/prisma';
import { validateAmazonAffiliateId } from '@/lib/affiliateUrls';

/**
 * GET - Retrieve partner's affiliate IDs
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  const { partnerId } = await params;

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
      select: {
        amazonAffiliateId: true,
        impactAffiliateId: true,
        otherAffiliateIds: true,
      },
    });

    if (!partner) {
      return Response.json({ error: 'Partner not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: {
        amazonAffiliateId: partner.amazonAffiliateId,
        impactAffiliateId: partner.impactAffiliateId,
        otherAffiliateIds: partner.otherAffiliateIds
          ? JSON.parse(partner.otherAffiliateIds)
          : {},
      },
    });
  } catch (error) {
    console.error('Error fetching affiliate IDs:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT - Update partner's affiliate IDs
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  const { partnerId } = await params;

  try {
    const body = await request.json();
    const { amazonAffiliateId, impactAffiliateId, otherAffiliateIds } = body;

    // Validate Amazon Affiliate ID format if provided
    if (amazonAffiliateId && !validateAmazonAffiliateId(amazonAffiliateId)) {
      return Response.json(
        {
          error: 'Invalid Amazon Affiliate ID format. Should be like "yoursite-20" or "yoursite-21"',
        },
        { status: 400 }
      );
    }

    // Update partner
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: {
        amazonAffiliateId: amazonAffiliateId || null,
        impactAffiliateId: impactAffiliateId || null,
        otherAffiliateIds: otherAffiliateIds
          ? JSON.stringify(otherAffiliateIds)
          : null,
      },
      select: {
        id: true,
        amazonAffiliateId: true,
        impactAffiliateId: true,
        otherAffiliateIds: true,
      },
    });

    return Response.json({
      success: true,
      message: 'Affiliate IDs updated successfully',
      data: {
        amazonAffiliateId: partner.amazonAffiliateId,
        impactAffiliateId: partner.impactAffiliateId,
        otherAffiliateIds: partner.otherAffiliateIds
          ? JSON.parse(partner.otherAffiliateIds)
          : {},
      },
    });
  } catch (error) {
    console.error('Error updating affiliate IDs:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
