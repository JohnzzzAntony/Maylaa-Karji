import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  const reviews = await db.review.findMany({
    where: productId ? { productId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, author, rating, title, content, location } = body;
  if (!productId || !author || !rating || !title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const review = await db.review.create({
    data: { productId, author, rating: Number(rating), title, content, location: location || null, verified: true },
  });
  const agg = await db.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: { rating: true } });
  await db.product.update({
    where: { id: productId },
    data: { rating: Number((agg._avg.rating ?? 5).toFixed(1)), reviewCount: agg._count.rating },
  });
  return NextResponse.json({ review });
}
