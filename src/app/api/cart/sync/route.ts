import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    
    // Clear user's current items and insert new ones
    await db.cartItem.deleteMany({ where: { userId: user.userId } });
    
    const data = items.map((item) => ({
      userId: user.userId,
      productId: item.id,
      quantity: Number(item.quantity) || 1,
    }));
    
    if (data.length > 0) {
      await db.cartItem.createMany({ data });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
