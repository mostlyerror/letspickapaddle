import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildPartnerAffiliateUrls } from '@/lib/affiliateUrls';
import { RecommendationEngine } from '@/platform/core/engine/recommendation-engine';
import { paddlesToProducts, productToPaddleResponse } from '@/platform/adapters/paddle-adapter';
import { paddleScoringConfig } from '@/platform/adapters/paddle-scoring-config';

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

    // Convert paddles to generic products
    const products = paddlesToProducts(paddles);

    // Use generic recommendation engine
    const engine = new RecommendationEngine(paddleScoringConfig);
    const recommendations = engine.recommend(products, responses, { limit: 5 });

    // Convert back to paddle response format with affiliate URLs
    const paddleRecommendations = recommendations.map((product) => {
      // Build affiliate URLs with partner's affiliate IDs
      let affiliateUrls = product.affiliateUrls;

      if (partnerAffiliateIds && Object.keys(affiliateUrls).length > 0) {
        // Substitute partner's affiliate IDs into the URLs
        affiliateUrls = buildPartnerAffiliateUrls(affiliateUrls, partnerAffiliateIds);
      }

      // Convert to paddle response format
      const paddleResponse = productToPaddleResponse(
        product,
        product.score,
        product.matchReasons
      );

      return {
        ...paddleResponse,
        affiliateUrls, // Override with partner-specific URLs
      };
    });

    return NextResponse.json({
      success: true,
      data: paddleRecommendations,
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
