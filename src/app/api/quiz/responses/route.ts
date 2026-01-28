import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { responses, sessionId, partnerId } = body;

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid responses format',
        },
        { status: 400 }
      );
    }

    // Generate session ID if not provided
    const finalSessionId = sessionId || nanoid();

    // Save quiz response with partner tracking
    const quizResponse = await prisma.quizResponse.create({
      data: {
        sessionId: finalSessionId,
        partnerId: partnerId || null,
        responses: JSON.stringify(responses),
        completedAt: new Date(),
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
          quizCompletions: { increment: 1 },
        },
        create: {
          partnerId,
          date: today,
          quizCompletions: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: quizResponse.id,
        sessionId: finalSessionId,
      },
    });
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save quiz response',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID is required',
        },
        { status: 400 }
      );
    }

    const response = await prisma.quizResponse.findFirst({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          error: 'Response not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: response.id,
        sessionId: response.sessionId,
        responses: JSON.parse(response.responses),
        completedAt: response.completedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz response:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quiz response',
      },
      { status: 500 }
    );
  }
}
