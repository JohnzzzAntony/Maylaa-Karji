import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [subs, orderCustomers] = await Promise.all([
    db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.groupBy({ by: ["email", "customerName"], _count: { id: true }, _sum: { total: true }, orderBy: { _count: { id: "desc" } } }),
  ]);
  return NextResponse.json({
    subscribers: subs.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })),
    customers: orderCustomers.map((c) => ({ email: c.email, name: c.customerName, orderCount: c._count.id, totalSpent: c._sum.total ?? 0 })),
  });
}
