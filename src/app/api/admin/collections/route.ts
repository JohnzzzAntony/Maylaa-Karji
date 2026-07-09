import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const collections = await db.collection.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json({ collections: collections.map((c) => ({ ...c, productIds: JSON.parse(c.productIds) })) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const collection = await db.collection.create({
    data: {
      title: body.title,
      slug,
      description: body.description || null,
      banner: body.banner || null,
      productIds: JSON.stringify(body.productIds || []),
      isActive: body.isActive !== false,
      displayOrder: Number(body.displayOrder) || 0,
    },
  });
  return NextResponse.json({ collection });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const collection = await db.collection.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      banner: data.banner || null,
      productIds: JSON.stringify(data.productIds || []),
      isActive: data.isActive !== false,
      displayOrder: Number(data.displayOrder) || 0,
    },
  });
  return NextResponse.json({ collection });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.collection.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
