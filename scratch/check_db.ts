import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  try {
    const cats = await db.category.findMany({ select: { name: true, slug: true, parentId: true } });
    const prods = await db.product.count();
    const locs = await db.storeLocation.findMany({ select: { name: true, city: true } });
    console.log("=== CATEGORIES IN DB ===");
    console.log(cats);
    console.log("Products Count:", prods);
    console.log("=== LOCATIONS IN DB ===");
    console.log(locs);
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
  }
}

main();
