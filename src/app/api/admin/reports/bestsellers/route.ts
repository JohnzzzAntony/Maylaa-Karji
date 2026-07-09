import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: { status: { not: "cancelled" } },
      select: { items: true },
    });
    
    const sales: Record<string, { id: string; name: string; brand: string; price: number; quantity: number; total: number }> = {};
    
    orders.forEach((o) => {
      try {
        const items = JSON.parse(o.items);
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const key = item.id;
            if (!sales[key]) {
              sales[key] = {
                id: item.id,
                name: item.name,
                brand: item.brand || "Unknown",
                price: item.price,
                quantity: 0,
                total: 0,
              };
            }
            sales[key].quantity += Number(item.quantity) || 1;
            sales[key].total += (Number(item.quantity) || 1) * (Number(item.price) || 0);
          });
        }
      } catch (e) {
        console.error("Parse order items error:", e);
      }
    });
    
    const bestsellers = Object.values(sales).sort((a, b) => b.quantity - a.quantity);
    revalidatePath("/");
  return NextResponse.json({ bestsellers });
  } catch (error: any) {
    console.error("Bestsellers report error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
