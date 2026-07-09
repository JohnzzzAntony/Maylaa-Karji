import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: { status: { not: "cancelled" } },
      select: { items: true },
    });
    
    const purchasedIds = new Set<string>();
    orders.forEach((o) => {
      try {
        const items = JSON.parse(o.items);
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            if (item.id) purchasedIds.add(item.id);
          });
        }
      } catch (e) {}
    });
    
    const allProducts = await db.product.findMany({
      include: { brand: { select: { name: true } } },
      orderBy: { name: "asc" },
    });
    
    const neverPurchased = allProducts.filter((p) => !purchasedIds.has(p.id));
    
    return NextResponse.json({
      products: neverPurchased.map((p) => ({
        ...p,
        images: JSON.parse(p.images),
      })),
    });
  } catch (error: any) {
    console.error("Never purchased report error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
