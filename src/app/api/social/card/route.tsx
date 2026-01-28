import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return new Response('Session ID required', { status: 400 });
    }

    // Fetch quiz response
    const quizResponse = await prisma.quizResponse.findFirst({
      where: { sessionId },
    });

    if (!quizResponse) {
      return new Response('Quiz response not found', { status: 404 });
    }

    // Get top recommendation (simplified - just show "Find your perfect paddle" message)
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2563eb',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '60px',
              width: '100%',
              height: '100%',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              I Found My Perfect Paddle!
            </h1>
            <p
              style={{
                fontSize: '36px',
                color: '#6b7280',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              Take the quiz to find yours
            </p>
            <div
              style={{
                marginTop: '40px',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#2563eb',
              }}
            >
              PaddleFit
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating card:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
