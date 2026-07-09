import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let ads = await db.advertisement.findMany({ orderBy: { createdAt: "desc" } });
  if (ads.length === 0) {
    try {
      await db.advertisement.create({
        data: {
          title: "Exclusive Oud Scent Collection",
          image: "/images/products/oud-rose.jpg",
          link: "/category/oud",
          placement: "sidebar",
          isActive: true,
        }
      });
      ads = await db.advertisement.findMany({ orderBy: { createdAt: "desc" } });
    } catch (e) {
      console.error("Failed to seed default advertisement:", e);
    }
  }
  return NextResponse.json({ ads });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const ad = await db.advertisement.create({ data: { title: b.title, image: b.image, link: b.link || "#", placement: b.placement || "sidebar", isActive: b.isActive ?? true } });
  return NextResponse.json({ ad });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (data.isActive !== undefined) data.isActive = !!data.isActive;
  const ad = await db.advertisement.update({ where: { id }, data });
  return NextResponse.json({ ad });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.advertisement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
