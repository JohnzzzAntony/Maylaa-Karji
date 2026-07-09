const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  try {
    const p = await prisma.product.findFirst({ include: { brand: true, category: true } });
    if (!p) { console.log("No product"); return; }
    const { id, ...data } = p;
    await prisma.product.update({ where: { id }, data });
    console.log("Success!");
  } catch(e) {
    console.log("ERROR:", e.message);
  }
}
main();
