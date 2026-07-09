import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    let count = 0;
    for (const product of products) {
        await prisma.product.update({
            where: { id: product.id },
            data: {
                isTrending: Math.random() > 0.5,
                isNew: Math.random() > 0.5,
                isExclusive: Math.random() > 0.5,
                isBestSeller: Math.random() > 0.5,
                isArtisanal: Math.random() > 0.5,
                isFeatured: true
            }
        });
        count++;
    }
    console.log(`Updated ${count} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

