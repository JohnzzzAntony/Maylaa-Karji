import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('\n=== CONFIG SETTINGS ===');
  const configs = await db.configSetting.findMany();
  console.log(JSON.stringify(configs, null, 2));

  console.log('\n=== CMS PAGES ===');
  const cms = await db.cmsPage.findMany({ take: 5 });
  console.log(JSON.stringify(cms, null, 2));

  console.log('\n=== PROMOTIONS ===');
  const promos = await db.promotion.findMany({ take: 5 });
  console.log(JSON.stringify(promos, null, 2));

  console.log('\n=== ADS ===');
  const ads = await db.advertisement.findMany({ take: 5 });
  console.log(JSON.stringify(ads, null, 2));

  await db.$disconnect();
}

main();