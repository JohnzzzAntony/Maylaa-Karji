import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids)) return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    
    // Clear user's current wishlist items and insert new ones
    await db.wishlistItem.deleteMany({ where: { userId: user.userId } });
    
    const data = ids.map((id) => ({
      userId: user.userId,
      productId: id,
    }));
    
    if (data.length > 0) {
      await db.wishlistItem.createMany({ data });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Wishlist sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
