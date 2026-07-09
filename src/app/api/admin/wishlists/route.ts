import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const wishlists = await db.wishlistItem.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, price: true, sku: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    
    const userWishlists: Record<string, any> = {};
    wishlists.forEach((item) => {
      const userKey = item.userId;
      if (!userWishlists[userKey]) {
        userWishlists[userKey] = {
          user: item.user,
          items: [],
          createdAt: item.createdAt,
        };
      }
      userWishlists[userKey].items.push({
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
      });
    });
    
    revalidatePath("/");
  return NextResponse.json({ wishlists: Object.values(userWishlists) });
  } catch (error: any) {
    console.error("Fetch wishlists error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlists" }, { status: 500 });
  }
}
