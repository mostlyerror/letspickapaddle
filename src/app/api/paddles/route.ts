import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {};

    if (brand) {
      where.brand = brand;
    }

    if (minPrice || maxPrice) {
      where.priceCents = {};
      if (minPrice) {
        where.priceCents.gte = parseInt(minPrice);
      }
      if (maxPrice) {
        where.priceCents.lte = parseInt(maxPrice);
      }
    }

    const paddles = await prisma.paddle.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: paddles,
      count: paddles.length,
    });
  } catch (error) {
    console.error('Error fetching paddles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch paddles',
      },
      { status: 500 }
    );
  }
}
