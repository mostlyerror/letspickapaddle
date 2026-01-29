import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportData {
  [paddleName: string]: string;
}

interface ImportResult {
  paddle: string;
  status: 'success' | 'error';
  message?: string;
}

export async function POST(request: Request) {
  try {
    const { data } = (await request.json()) as { data: ImportData };

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid data format' },
        { status: 400 }
      );
    }

    const results: ImportResult[] = [];

    for (const [paddleName, amazonUrl] of Object.entries(data)) {
      // Skip empty values
      if (!amazonUrl || !amazonUrl.trim()) {
        results.push({
          paddle: paddleName,
          status: 'error',
          message: 'Empty URL provided',
        });
        continue;
      }

      // Validate Amazon URL
      if (
        typeof amazonUrl !== 'string' ||
        !amazonUrl.match(/^https:\/\/(www\.)?amazon\.com\/.+/)
      ) {
        results.push({
          paddle: paddleName,
          status: 'error',
          message: 'Invalid Amazon URL format',
        });
        continue;
      }

      // Find paddle by name (case-insensitive)
      const paddle = await prisma.paddle.findFirst({
        where: {
          name: {
            equals: paddleName,
            mode: 'insensitive',
          },
        },
      });

      if (!paddle) {
        results.push({
          paddle: paddleName,
          status: 'error',
          message: 'Paddle not found',
        });
        continue;
      }

      // Update affiliate URLs
      const currentUrls = paddle.affiliateUrls
        ? JSON.parse(paddle.affiliateUrls)
        : {};

      currentUrls.amazon = amazonUrl.trim();

      await prisma.paddle.update({
        where: { id: paddle.id },
        data: {
          affiliateUrls: JSON.stringify(currentUrls),
        },
      });

      results.push({
        paddle: paddleName,
        status: 'success',
      });
    }

    const successCount = results.filter((r) => r.status === 'success').length;
    const errorCount = results.filter((r) => r.status === 'error').length;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: errorCount,
      },
      results,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Import failed',
      },
      { status: 500 }
    );
  }
}
