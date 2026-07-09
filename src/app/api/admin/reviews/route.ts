import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const reviews = await db.review.findMany({
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function PUT(req: NextRequest) {
  try {
    const { id, verified, rating, title, content } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    
    const update: any = {};
    if (verified !== undefined) update.verified = !!verified;
    if (rating !== undefined) update.rating = Number(rating);
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    
    const review = await db.review.update({
      where: { id },
      data: update,
    });
    return NextResponse.json({ review });
  } catch (error: any) {
    console.error("Update review error:", error);
    return NextResponse.json({ error: "Update review failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
