import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const where = status && status !== "all" ? { status } : {};
  const orders = await db.order.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ orders: orders.map((o) => ({ ...o, createdAt: o.createdAt.toISOString(), items: JSON.parse(o.items), address: JSON.parse(o.address) })) });
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
  const order = await db.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ order });
}
