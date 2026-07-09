import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const locations = await db.storeLocation.findMany({ orderBy: { sortOrder: "asc" } });
  revalidatePath("/");
  return NextResponse.json({ locations });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.address || !body.city) {
    return NextResponse.json({ error: "Name, address, and city are required" }, { status: 400 });
  }
  const location = await db.storeLocation.create({
    data: {
      name: body.name,
      image: body.image || null,
      address: body.address,
      city: body.city,
      phone: body.phone || null,
      mapsUrl: body.mapsUrl || null,
      isActive: body.isActive !== false,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });
  revalidatePath("/");
  return NextResponse.json({ location });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const location = await db.storeLocation.update({
    where: { id },
    data: {
      name: data.name,
      image: data.image || null,
      address: data.address,
      city: data.city,
      phone: data.phone || null,
      mapsUrl: data.mapsUrl || null,
      isActive: data.isActive !== false,
      sortOrder: Number(data.sortOrder) || 0,
    },
  });
  revalidatePath("/");
  return NextResponse.json({ location });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.storeLocation.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
