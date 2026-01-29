#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkImages() {
  const paddles = await prisma.paddle.findMany({
    select: { name: true, imageUrl: true },
    take: 5,
  });

  console.log('Current image URLs:');
  paddles.forEach(p => {
    console.log(`  ${p.name}: ${p.imageUrl || 'NO IMAGE'}`);
  });

  await prisma.$disconnect();
}

checkImages();
