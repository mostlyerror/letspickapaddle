import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.quizQuestion.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    // Parse JSON strings back to objects
    const parsedQuestions = questions.map((q) => ({
      id: q.id,
      questionKey: q.questionKey,
      questionText: q.questionText,
      questionType: q.questionType,
      displayOrder: q.displayOrder,
      options: JSON.parse(q.options),
      conditions: q.conditions ? JSON.parse(q.conditions) : null,
      weightMappings: JSON.parse(q.weightMappings),
    }));

    return NextResponse.json({
      success: true,
      data: parsedQuestions,
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quiz questions',
      },
      { status: 500 }
    );
  }
}
