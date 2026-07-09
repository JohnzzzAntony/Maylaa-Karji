import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const products = await db.product.findMany({
    where: { stock: { lte: 15 } },
    include: { brand: { select: { name: true } }, category: { select: { name: true } } },
    orderBy: { stock: "asc" },
  });
  return NextResponse.json({ products: products.map((p) => ({ ...p, images: JSON.parse(p.images) })) });
}
