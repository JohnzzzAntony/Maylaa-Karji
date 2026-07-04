import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const offers = await db.bogoOffer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const offer = await db.bogoOffer.create({ data: { title: b.title, description: b.description || "", buyProductId: b.buyProductId || null, buyQty: Number(b.buyQty) || 1, getProductId: b.getProductId || null, getQty: Number(b.getQty) || 1, discountPct: Number(b.discountPct) || 100, isActive: b.isActive ?? true, endsAt: b.endsAt ? new Date(b.endsAt) : null } });
  return NextResponse.json({ offer });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const update: Record<string, unknown> = { ...data };
  if (data.buyQty !== undefined) update.buyQty = Number(data.buyQty);
  if (data.getQty !== undefined) update.getQty = Number(data.getQty);
  if (data.discountPct !== undefined) update.discountPct = Number(data.discountPct);
  if (data.isActive !== undefined) update.isActive = !!data.isActive;
  if (data.endsAt !== undefined) update.endsAt = data.endsAt ? new Date(data.endsAt) : null;
  const offer = await db.bogoOffer.update({ where: { id }, data: update });
  return NextResponse.json({ offer });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.bogoOffer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
