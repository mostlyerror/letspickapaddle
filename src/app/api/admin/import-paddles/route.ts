import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PaddleImportData {
  name: string;
  brand: string;
  priceCents: number;
  weightOz?: number;
  gripCircumference?: number;
  coreMaterial?: string;
  faceMaterial?: string;
  shape?: string;
  balancePointMm?: number;
  powerRating?: number;
  controlRating?: number;
  spinRating?: number;
  sweetSpotSize?: string;
  swingWeight?: number;
  twistWeight?: number;
  handleLengthIn?: number;
  usapaApproved?: boolean;
  imageUrl?: string;
  amazonUrl?: string;
}

interface ImportResult {
  paddle: string;
  status: 'success' | 'error' | 'created' | 'updated';
  message?: string;
}

function extractAsinFromUrl(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

function validatePaddle(paddle: PaddleImportData): string | null {
  if (!paddle.name || typeof paddle.name !== 'string' || paddle.name.trim() === '') {
    return 'Missing or invalid name';
  }

  if (!paddle.brand || typeof paddle.brand !== 'string' || paddle.brand.trim() === '') {
    return 'Missing or invalid brand';
  }

  if (!paddle.priceCents || typeof paddle.priceCents !== 'number' || paddle.priceCents <= 0) {
    return 'Missing or invalid price (must be a positive number in cents)';
  }

  if (paddle.powerRating !== undefined && (paddle.powerRating < 1 || paddle.powerRating > 10)) {
    return 'Power rating must be between 1 and 10';
  }

  if (paddle.controlRating !== undefined && (paddle.controlRating < 1 || paddle.controlRating > 10)) {
    return 'Control rating must be between 1 and 10';
  }

  if (paddle.spinRating !== undefined && (paddle.spinRating < 1 || paddle.spinRating > 10)) {
    return 'Spin rating must be between 1 and 10';
  }

  if (paddle.amazonUrl && !paddle.amazonUrl.match(/^https?:\/\/(www\.)?amazon\.com\//)) {
    return 'Invalid Amazon URL format';
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { paddles } = (await request.json()) as { paddles: PaddleImportData[] };

    if (!paddles || !Array.isArray(paddles)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format. Expected: { paddles: [...] }' },
        { status: 400 }
      );
    }

    if (paddles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No paddles provided' },
        { status: 400 }
      );
    }

    const results: ImportResult[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const paddleData of paddles) {
      // Validate paddle data
      const validationError = validatePaddle(paddleData);
      if (validationError) {
        results.push({
          paddle: paddleData.name || 'Unknown',
          status: 'error',
          message: validationError,
        });
        failed++;
        continue;
      }

      try {
        // Prepare affiliate URLs if Amazon URL provided
        let affiliateUrls: string | null = null;
        if (paddleData.amazonUrl) {
          const asin = extractAsinFromUrl(paddleData.amazonUrl);
          const urlData: Record<string, string> = {
            amazon: paddleData.amazonUrl,
          };
          if (asin) {
            urlData.asin = asin;
          }
          affiliateUrls = JSON.stringify(urlData);
        }

        // Check if paddle already exists (case-insensitive name match)
        const existing = await prisma.paddle.findFirst({
          where: {
            name: {
              equals: paddleData.name,
              mode: 'insensitive',
            },
          },
        });

        const paddleDbData = {
          name: paddleData.name,
          brand: paddleData.brand,
          priceCents: paddleData.priceCents,
          weightOz: paddleData.weightOz,
          gripCircumference: paddleData.gripCircumference,
          coreMaterial: paddleData.coreMaterial,
          faceMaterial: paddleData.faceMaterial,
          shape: paddleData.shape,
          balancePointMm: paddleData.balancePointMm,
          powerRating: paddleData.powerRating,
          controlRating: paddleData.controlRating,
          spinRating: paddleData.spinRating,
          sweetSpotSize: paddleData.sweetSpotSize,
          swingWeight: paddleData.swingWeight,
          twistWeight: paddleData.twistWeight,
          handleLengthIn: paddleData.handleLengthIn,
          usapaApproved: paddleData.usapaApproved ?? true,
          imageUrl: paddleData.imageUrl,
          affiliateUrls: affiliateUrls,
        };

        if (existing) {
          // Update existing paddle
          await prisma.paddle.update({
            where: { id: existing.id },
            data: paddleDbData,
          });
          results.push({
            paddle: paddleData.name,
            status: 'updated',
            message: 'Paddle updated successfully',
          });
          updated++;
        } else {
          // Create new paddle
          await prisma.paddle.create({
            data: paddleDbData,
          });
          results.push({
            paddle: paddleData.name,
            status: 'created',
            message: 'Paddle created successfully',
          });
          created++;
        }
      } catch (error) {
        console.error(`Error importing paddle: ${paddleData.name}`, error);
        results.push({
          paddle: paddleData.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: paddles.length,
        created,
        updated,
        failed,
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
