import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePaddleScore } from '@/lib/recommendationEngine';
import { buildPartnerAffiliateUrls } from '@/lib/affiliateUrls';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, responses, partnerId } = body;

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

    // Fetch partner to check for curated paddles and affiliate IDs
    let curatedPaddleIds: string[] | null = null;
    let partnerAffiliateIds: {
      amazonAffiliateId?: string | null;
      impactAffiliateId?: string | null;
      otherAffiliateIds?: string | null;
    } | null = null;

    if (partnerId) {
      const partner = await prisma.partner.findUnique({
        where: { id: partnerId },
        select: {
          curatedPaddles: true,
          amazonAffiliateId: true,
          impactAffiliateId: true,
          otherAffiliateIds: true,
        },
      });

      if (partner?.curatedPaddles) {
        curatedPaddleIds = JSON.parse(partner.curatedPaddles);
      }

      if (partner) {
        partnerAffiliateIds = {
          amazonAffiliateId: partner.amazonAffiliateId,
          impactAffiliateId: partner.impactAffiliateId,
          otherAffiliateIds: partner.otherAffiliateIds,
        };
      }
    }

    // Fetch paddles (filtered by curated list if applicable)
    const paddles = await prisma.paddle.findMany({
      where: curatedPaddleIds
        ? { id: { in: curatedPaddleIds } }
        : undefined,
    });

    // Calculate scores for each paddle
    const scoredPaddles = paddles.map((paddle) => {
      const { score, matchReasons } = calculatePaddleScore(paddle, responses, weightMappings);

      // Build affiliate URLs with partner's affiliate IDs
      let affiliateUrls = paddle.affiliateUrls
        ? JSON.parse(paddle.affiliateUrls)
        : {};

      if (partnerAffiliateIds && Object.keys(affiliateUrls).length > 0) {
        // Substitute partner's affiliate IDs into the URLs
        affiliateUrls = buildPartnerAffiliateUrls(affiliateUrls, partnerAffiliateIds);
      }

      return {
        id: paddle.id,
        name: paddle.name,
        brand: paddle.brand,
        priceCents: paddle.priceCents,
        powerRating: paddle.powerRating,
        controlRating: paddle.controlRating,
        spinRating: paddle.spinRating,
        weightOz: paddle.weightOz,
        coreMaterial: paddle.coreMaterial,
        faceMaterial: paddle.faceMaterial,
        shape: paddle.shape,
        sweetSpotSize: paddle.sweetSpotSize,
        imageUrl: paddle.imageUrl,
        score,
        matchReasons,
        affiliateUrls,
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
