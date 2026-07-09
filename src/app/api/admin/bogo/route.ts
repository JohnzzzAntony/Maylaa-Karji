import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const offers = await db.bogoOffer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const offer = await db.bogoOffer.create({
    data: {
      title: b.title || b.description?.slice(0, 40) || "BOGO Offer",
      description: b.description || "",
      buyQty: Number(b.buyQty) || 1,
      getQty: Number(b.getQty) || 1,
      discountPct: Number(b.discountPct) ?? 100,
      isActive: b.isActive ?? true,
      startsAt: b.startsAt ? new Date(b.startsAt) : new Date(),
      endsAt: b.endsAt ? new Date(b.endsAt) : null,
      maxQty: Number(b.maxQty) || 0,
      isCrossProduct: !!b.isCrossProduct,
      productIds: JSON.stringify(b.productIds || []),
      buyProductIds: JSON.stringify(b.buyProductIds || []),
      getProductIds: JSON.stringify(b.getProductIds || []),
    },
  });
  return NextResponse.json({ offer });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const update: Record<string, unknown> = {
    title: data.title || data.description?.slice(0, 40),
    description: data.description,
  };
  if (data.buyQty !== undefined) update.buyQty = Number(data.buyQty);
  if (data.getQty !== undefined) update.getQty = Number(data.getQty);
  if (data.discountPct !== undefined) update.discountPct = Number(data.discountPct);
  if (data.maxQty !== undefined) update.maxQty = Number(data.maxQty);
  if (data.isCrossProduct !== undefined) update.isCrossProduct = !!data.isCrossProduct;
  if (data.productIds !== undefined) update.productIds = JSON.stringify(data.productIds);
  if (data.buyProductIds !== undefined) update.buyProductIds = JSON.stringify(data.buyProductIds);
  if (data.getProductIds !== undefined) update.getProductIds = JSON.stringify(data.getProductIds);
  if (data.isActive !== undefined) update.isActive = !!data.isActive;
  if (data.startsAt !== undefined) update.startsAt = data.startsAt ? new Date(data.startsAt) : new Date();
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

