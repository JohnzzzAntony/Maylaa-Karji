import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const promos = await db.promotion.findMany({ orderBy: { createdAt: "desc" } });
  revalidatePath("/");
  return NextResponse.json({ promos });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const promo = await db.promotion.create({ data: { title: b.title, code: (b.code || "").toUpperCase(), type: b.type || "percent", value: Number(b.value) || 0, minSpend: Number(b.minSpend) || 0, usageLimit: Number(b.usageLimit) || 100, isActive: b.isActive ?? true, endsAt: b.endsAt ? new Date(b.endsAt) : null } });
  revalidatePath("/");
  return NextResponse.json({ promo });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (data.value !== undefined) data.value = Number(data.value);
  if (data.minSpend !== undefined) data.minSpend = Number(data.minSpend);
  if (data.usageLimit !== undefined) data.usageLimit = Number(data.usageLimit);
  if (data.isActive !== undefined) data.isActive = !!data.isActive;
  if (data.code !== undefined) data.code = (data.code || "").toUpperCase();
  if (data.endsAt !== undefined) data.endsAt = data.endsAt ? new Date(data.endsAt) : null;
  const promo = await db.promotion.update({ where: { id }, data });
  revalidatePath("/");
  return NextResponse.json({ promo });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.promotion.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
