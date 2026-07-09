import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const updated = await prisma.user.updateMany({
    data: { role: 'superadmin' }
  });
  console.log("Updated users:", updated);
}
main();
