import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { children: { orderBy: [{ displayOrder: "asc" }, { name: "asc" }] } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const category = await db.category.create({
    data: {
      name: body.name,
      slug,
      description: body.description || "",
      image: body.image || "",
      parentId: body.parentId || null,
      displayOrder: Number(body.displayOrder) || 0,
      showOnHomepage: !!body.showOnHomepage,
    },
  });
  return NextResponse.json({ category });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const category = await db.category.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || "",
      image: data.image || "",
      parentId: data.parentId || null,
      displayOrder: Number(data.displayOrder) || 0,
      showOnHomepage: !!data.showOnHomepage,
    },
  });
  return NextResponse.json({ category });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
