import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cartItems = await db.cartItem.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, price: true, sku: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    
    const carts: Record<string, any> = {};
    cartItems.forEach((item) => {
      const userKey = item.userId;
      if (!carts[userKey]) {
        carts[userKey] = {
          user: item.user,
          items: [],
          total: 0,
          updatedAt: item.updatedAt,
        };
      }
      carts[userKey].items.push({
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
      });
      carts[userKey].total += item.product.price * item.quantity;
      if (new Date(item.updatedAt) > new Date(carts[userKey].updatedAt)) {
        carts[userKey].updatedAt = item.updatedAt;
      }
    });
    
    return NextResponse.json({ carts: Object.values(carts) });
  } catch (error: any) {
    console.error("Fetch carts error:", error);
    return NextResponse.json({ error: "Failed to fetch carts" }, { status: 500 });
  }
}
