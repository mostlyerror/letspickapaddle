import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partnerId, sessionId, eventType, eventData } = body;

    if (!eventType) {
      return Response.json({ error: 'eventType is required' }, { status: 400 });
    }

    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    const referer = headersList.get('referer');

    // Store event
    await prisma.embedEvent.create({
      data: {
        partnerId: partnerId || null,
        sessionId: sessionId || null,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
        userAgent,
        referer,
      },
    });

    // Update daily analytics
    if (partnerId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Use upsert to create or update daily analytics
      const updateData: any = {};

      switch (eventType) {
        case 'quiz_start':
          updateData.quizStarts = { increment: 1 };
          break;
        case 'quiz_complete':
          updateData.quizCompletions = { increment: 1 };
          break;
        case 'result_view':
          updateData.resultsViewed = { increment: 1 };
          break;
        case 'paddle_click':
          updateData.paddleClicks = { increment: 1 };
          break;
        case 'purchase_click':
          updateData.purchaseClicks = { increment: 1 };
          break;
        case 'share_attempt':
          updateData.shareAttempts = { increment: 1 };
          break;
        case 'share_complete':
          updateData.shareCompletes = { increment: 1 };
          break;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.partnerAnalytics.upsert({
          where: {
            partnerId_date: {
              partnerId,
              date: today,
            },
          },
          update: updateData,
          create: {
            partnerId,
            date: today,
            ...Object.fromEntries(
              Object.entries(updateData).map(([key, value]: [string, any]) => [
                key,
                value.increment || 0,
              ])
            ),
          },
        });
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
