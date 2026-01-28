import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ partnerId: string }> }
) {
  const { partnerId } = await params;

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId, isActive: true },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        curatedPaddles: true,
      },
    });

    if (!partner) {
      return Response.json({ error: 'Partner not found' }, { status: 404 });
    }

    return Response.json({
      theme: {
        primaryColor: partner.primaryColor,
        secondaryColor: partner.secondaryColor,
      },
      curatedPaddles: partner.curatedPaddles ? JSON.parse(partner.curatedPaddles) : null,
      branding: {
        name: partner.name,
        logoUrl: partner.logoUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching partner config:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
