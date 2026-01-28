import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePaddleScore } from '@/lib/recommendationEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, responses } = body;

    if (!responses) {
      return NextResponse.json(
        {
          success: false,
          error: 'Responses are required',
        },
        { status: 400 }
      );
    }

    // Fetch all quiz questions to get weight mappings
    const questions = await prisma.quizQuestion.findMany({
      where: { isActive: true },
    });

    const weightMappings: Record<string, any> = {};
    questions.forEach((q) => {
      weightMappings[q.questionKey] = JSON.parse(q.weightMappings);
    });

    // Fetch all paddles
    const paddles = await prisma.paddle.findMany();

    // Calculate scores for each paddle
    const scoredPaddles = paddles.map((paddle) => {
      const { score, matchReasons } = calculatePaddleScore(paddle, responses, weightMappings);
      return {
        ...paddle,
        score,
        matchReasons,
      };
    });

    // Sort by score and get top 5
    const recommendations = scoredPaddles
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
      },
      { status: 500 }
    );
  }
}
