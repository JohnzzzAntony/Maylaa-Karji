import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const banners = await db.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const banner = await db.banner.create({ data: { title: body.title, subtitle: body.subtitle || "", image: body.image, link: body.link || "#", position: body.position || "hero", isActive: body.isActive ?? true, sortOrder: Number(body.sortOrder) || 0 } });
  return NextResponse.json({ banner });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const update: Record<string, unknown> = { ...data };
  if (data.sortOrder !== undefined) update.sortOrder = Number(data.sortOrder);
  if (data.isActive !== undefined) update.isActive = !!data.isActive;
  const banner = await db.banner.update({ where: { id }, data: update });
  return NextResponse.json({ banner });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
