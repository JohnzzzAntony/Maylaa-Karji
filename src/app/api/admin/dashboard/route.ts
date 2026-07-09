import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [productCount, orderCount, subCount, reviewCount, bannerCount, promoCount, customerRows] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.newsletterSubscriber.count(),
    db.review.count(),
    db.banner.count(),
    db.promotion.count(),
    db.order.findMany({ select: { email: true }, distinct: ["email"] }),
  ]);

  const revenueAgg = await db.order.aggregate({ _sum: { total: true } });
  const revenue = revenueAgg._sum.total ?? 0;

  const recentOrders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 });

  const topProducts = await db.product.findMany({
    orderBy: { reviewCount: "desc" },
    take: 5,
    select: { id: true, name: true, price: true, reviewCount: true, rating: true, images: true },
  });

  const lowStock = await db.product.findMany({ where: { stock: { lte: 15 } }, take: 5, select: { id: true, name: true, stock: true, sku: true } });

  const sevenAgo = new Date();
  sevenAgo.setDate(sevenAgo.getDate() - 7);
  const recentOrderRows = await db.order.findMany({
    where: { createdAt: { gte: sevenAgo } },
    select: { total: true, createdAt: true },
  });
  const salesByDay: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const total = recentOrderRows
      .filter((o) => o.createdAt.toISOString().slice(0, 10) === key)
      .reduce((s, o) => s + o.total, 0);
    salesByDay.push({ date: key, total });
  }

  const statusGroups = await db.order.groupBy({ by: ["status"], _count: true });

  return NextResponse.json({
    stats: {
      revenue,
      products: productCount,
      orders: orderCount,
      customers: customerRows.length,
      subscribers: subCount,
      reviews: reviewCount,
      banners: bannerCount,
      promotions: promoCount,
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      email: o.email,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      items: safeParse(o.items, []),
    })),
    topProducts: topProducts.map((p) => ({ ...p, images: safeParse(p.images, []) })),
    lowStock,
    salesByDay,
    statusBreakdown: statusGroups.map((s) => ({ status: s.status, count: s._count })),
  });
}

function safeParse<T>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

