import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const search = sp.get("search") || "";
  const where = search
    ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] }
    : {};
  const products = await db.product.findMany({
    where,
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    products: products.map((p) => {
      let parsedImages = ["/images/products/future-oud.jpg"];
      try {
        parsedImages = JSON.parse(p.images);
        if (!Array.isArray(parsedImages)) {
          parsedImages = typeof p.images === "string" ? [p.images] : ["/images/products/future-oud.jpg"];
        }
      } catch {
        if (p.images) {
          parsedImages = [p.images];
        }
      }
      return { ...p, images: parsedImages };
    })
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const product = await db.product.create({
    data: {
      name: body.name,
      slug,
      brandId: body.brandId,
      categoryId: body.categoryId,
      description: body.description || "",
      longDescription: body.longDescription || "",
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      size: Number(body.size) || 100,
      concentration: body.concentration || "Eau de Parfum",
      topNotes: body.topNotes || "",
      heartNotes: body.heartNotes || "",
      baseNotes: body.baseNotes || "",
      images: JSON.stringify(body.images || ["/images/products/future-oud.jpg"]),
      stock: Number(body.stock) || 50,
      sku: body.sku || `SG-${slug.toUpperCase().replace(/-/g, "")}`,
      badge: body.badge || null,
      gender: body.gender || "Unisex",
      isTrending: !!body.isTrending,
      isExclusive: !!body.isExclusive,
      isBestSeller: !!body.isBestSeller,
      isArtisanal: !!body.isArtisanal,
      isFeatured: !!body.isFeatured,
      isNew: !!body.isNew,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      metaKeywords: body.metaKeywords || null,
      ogImage: body.ogImage || null,
      variants: body.variants || "[]",
    },
  });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const update: Record<string, unknown> = { ...data };
  if (data.price !== undefined) update.price = Number(data.price);
  if (data.compareAtPrice !== undefined) update.compareAtPrice = data.compareAtPrice ? Number(data.compareAtPrice) : null;
  if (data.size !== undefined) update.size = Number(data.size);
  if (data.stock !== undefined) update.stock = Number(data.stock);
  if (data.images !== undefined) update.images = JSON.stringify(data.images);
  if (data.isTrending !== undefined) update.isTrending = !!data.isTrending;
  if (data.isExclusive !== undefined) update.isExclusive = !!data.isExclusive;
  if (data.isBestSeller !== undefined) update.isBestSeller = !!data.isBestSeller;
  if (data.isArtisanal !== undefined) update.isArtisanal = !!data.isArtisanal;
  if (data.isFeatured !== undefined) update.isFeatured = !!data.isFeatured;
  if (data.isNew !== undefined) update.isNew = !!data.isNew;
  if (data.badge === "") update.badge = null;
  if (data.variants !== undefined) update.variants = data.variants;
  const product = await db.product.update({ where: { id }, data: update });
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
