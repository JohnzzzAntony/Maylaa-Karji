import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/attributes?categoryId=xxx
export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const where = categoryId ? { categoryId } : {};
  const attributes = await db.categoryAttribute.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ attributes: attributes.map((a) => ({ ...a, options: a.options ? JSON.parse(a.options) : [] })) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.categoryId || !body.name) {
    return NextResponse.json({ error: "categoryId and name are required" }, { status: 400 });
  }
  const attribute = await db.categoryAttribute.create({
    data: {
      categoryId: body.categoryId,
      name: body.name,
      type: body.type || "text",
      options: body.options?.length ? JSON.stringify(body.options) : null,
      isRequired: !!body.isRequired,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });
  return NextResponse.json({ attribute });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const attribute = await db.categoryAttribute.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type || "text",
      options: data.options?.length ? JSON.stringify(data.options) : null,
      isRequired: !!data.isRequired,
      sortOrder: Number(data.sortOrder) || 0,
    },
  });
  return NextResponse.json({ attribute });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.categoryAttribute.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
