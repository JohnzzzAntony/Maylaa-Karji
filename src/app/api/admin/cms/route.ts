import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const pages = await db.cmsPage.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const slug = (b.slug || b.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const page = await db.cmsPage.create({ data: { title: b.title, slug, content: b.content || "", isPublished: b.isPublished ?? true } });
  return NextResponse.json({ page });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (data.isPublished !== undefined) data.isPublished = !!data.isPublished;
  const page = await db.cmsPage.update({ where: { id }, data });
  return NextResponse.json({ page });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.cmsPage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
