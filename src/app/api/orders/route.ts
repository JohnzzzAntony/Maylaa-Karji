import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, customerName, items, subtotal, shipping, total, address } = body;
  if (!email || !items || !total) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const order = await db.order.create({
    data: {
      email,
      customerName: customerName || "Guest",
      items: JSON.stringify(items),
      subtotal: Number(subtotal),
      shipping: Number(shipping ?? 0),
      total: Number(total),
      currency: "AED",
      status: "confirmed",
      address: JSON.stringify(address || {}),
    },
  });
  return NextResponse.json({ orderId: order.id, status: "confirmed" });
}

export async function GET() {
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json({ orders });
}
