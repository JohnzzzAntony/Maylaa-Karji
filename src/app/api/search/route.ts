import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q) return NextResponse.json({ results: [] });
  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { topNotes: { contains: q } },
        { heartNotes: { contains: q } },
        { baseNotes: { contains: q } },
      ],
    },
    include: { brand: true, category: true },
    take: 8,
  });
  const results = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: JSON.parse(p.images)[0],
    brand: p.brand.name,
    rating: p.rating,
  }));
  return NextResponse.json({ results });
}
