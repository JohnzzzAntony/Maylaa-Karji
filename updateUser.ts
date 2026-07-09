import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const updated = await prisma.user.update({
    where: { email: 'johns@admin.com' },
    data: { role: 'superadmin' }
  });
  console.log("Updated user:", updated);
}
main();
