import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Bulk Update
export async function PUT(req: NextRequest) {
  try {
    const { updates } = await req.json();
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "updates must be an array" }, { status: 400 });
    }
    
    const tx = updates.map((u) =>
      db.product.update({
        where: { id: u.id },
        data: {
          name: u.name,
          sku: u.sku,
          price: Number(u.price),
          stock: Number(u.stock),
        },
      })
    );
    
    await db.$transaction(tx);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Bulk update error:", error);
    return NextResponse.json({ error: "Bulk update failed" }, { status: 500 });
  }
}

// Bulk Import / Upsert
export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "products must be an array" }, { status: 400 });
    }

    const tx = products.map((p) => {
      const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const data = {
        name: p.name,
        slug,
        brandId: p.brandId,
        categoryId: p.categoryId,
        description: p.description || "",
        longDescription: p.longDescription || "",
        price: Number(p.price) || 0,
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        size: Number(p.size) || 100,
        concentration: p.concentration || "Eau de Parfum",
        topNotes: p.topNotes || "",
        heartNotes: p.heartNotes || "",
        baseNotes: p.baseNotes || "",
        images: Array.isArray(p.images) ? JSON.stringify(p.images) : typeof p.images === "string" ? p.images : JSON.stringify(["/images/products/future-oud.jpg"]),
        stock: Number(p.stock) || 50,
        sku: p.sku || `SG-${slug.toUpperCase().replace(/-/g, "")}`,
        badge: p.badge || null,
        gender: p.gender || "Unisex",
        isTrending: !!p.isTrending,
        isExclusive: !!p.isExclusive,
        isBestSeller: !!p.isBestSeller,
        isArtisanal: !!p.isArtisanal,
        isFeatured: !!p.isFeatured,
        isNew: !!p.isNew,
        metaTitle: p.metaTitle || null,
        metaDescription: p.metaDescription || null,
        metaKeywords: p.metaKeywords || null,
        ogImage: p.ogImage || null,
      };

      if (p.id) {
        return db.product.upsert({
          where: { id: p.id },
          update: data,
          create: data,
        });
      } else {
        return db.product.create({
          data,
        });
      }
    });

    await db.$transaction(tx);
    return NextResponse.json({ success: true, count: products.length });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: "Bulk import failed" }, { status: 500 });
  }
}

// Bulk Delete
export async function DELETE(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "ids must be an array" }, { status: 400 });
    }
    
    await db.product.deleteMany({
      where: { id: { in: ids } },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Bulk delete error:", error);
    return NextResponse.json({ error: "Bulk delete failed" }, { status: 500 });
  }
}
