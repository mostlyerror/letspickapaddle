import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, partnerId, platform, shareUrl, resultCardUrl } = body;

    if (!sessionId || !platform) {
      return Response.json(
        { error: 'sessionId and platform are required' },
        { status: 400 }
      );
    }

    // Create social share record
    const share = await prisma.socialShare.create({
      data: {
        sessionId,
        partnerId: partnerId || null,
        platform,
        shareUrl: shareUrl || null,
        resultCardUrl: resultCardUrl || null,
      },
    });

    // Update partner analytics
    if (partnerId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.partnerAnalytics.upsert({
        where: {
          partnerId_date: {
            partnerId,
            date: today,
          },
        },
        update: {
          shareAttempts: { increment: 1 },
        },
        create: {
          partnerId,
          date: today,
          shareAttempts: 1,
        },
      });
    }

    return Response.json({
      success: true,
      shareId: share.id,
    });
  } catch (error) {
    console.error('Error tracking share:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
