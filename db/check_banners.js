import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('=== BANNERS ===');
  const banners = await db.banner.findMany();
  console.log(JSON.stringify(banners, null, 2));
  
  await db.$disconnect();
}

main();