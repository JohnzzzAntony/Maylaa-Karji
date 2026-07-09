"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, Users, Star, Mail, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { AdminPage, AdminCard, StatCard } from "../admin-ui";
import type { AdminModule } from "../admin-panel";
import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";

type DashboardData = {
  stats: { revenue: number; products: number; orders: number; customers: number; subscribers: number; reviews: number; banners: number; promotions: number };
  recentOrders: Array<{ id: string; customerName: string; email: string; total: number; status: string; createdAt: string; items: Array<{ name: string; quantity: number }> }>;
  topProducts: Array<{ id: string; name: string; price: number; reviewCount: number; rating: number; images: string[] }>;
  lowStock: Array<{ id: string; name: string; stock: number; sku: string }>;
  salesByDay: Array<{ date: string; total: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
};

const STATUS_COLORS: Record<string, "stone" | "amber" | "blue" | "green" | "red"> = {
  pending: "amber", confirmed: "blue", shipped: "blue", delivered: "green", cancelled: "red",
};

export function AdminDashboard({ onNavigate }: { onNavigate: (m: AdminModule) => void }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AdminPage title="Dashboard" subtitle="Loading analytics...">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-stone-200" />)}
      </div>
    </AdminPage>
    );
  }

  const maxSale = Math.max(...data.salesByDay.map((d) => d.total), 1);
  const statusColors: Record<string, string> = { pending: "#f59e0b", confirmed: "#3b82f6", shipped: "#6366f1", delivered: "#10b981", cancelled: "#ef4444" };

  return (
    <AdminPage title="Dashboard" subtitle="Overview of your store performance">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(data.stats.revenue)} icon={DollarSign} trend="+12.5% this month" color="emerald" delay={0} />
        <StatCard label="Orders" value={data.stats.orders} icon={ShoppingBag} trend="+8 today" color="amber" delay={0.05} />
        <StatCard label="Products" value={data.stats.products} icon={Package} color="blue" delay={0.1} />
        <StatCard label="Customers" value={data.stats.customers} icon={Users} trend="+3 new" color="violet" delay={0.15} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Reviews" value={data.stats.reviews} icon={Star} color="amber" delay={0.2} />
        <StatCard label="Subscribers" value={data.stats.subscribers} icon={Mail} color="blue" delay={0.25} />
        <StatCard label="Active Banners" value={data.stats.banners} icon={TrendingUp} color="emerald" delay={0.3} />
        <StatCard label="Promotions" value={data.stats.promotions} icon={Star} color="rose" delay={0.35} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Sales chart */}
        <AdminCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-stone-900">Revenue (Last 7 Days)</h3>
            <span className="text-xs text-stone-500">Daily totals</span>
          </div>
          <div className="flex h-48 items-end gap-2">
            {data.salesByDay.map((d, i) => (
              <motion.div
                key={d.date}
                initial={{ height: 0 }}
                animate={{ height: `${(d.total / maxSale) * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                className="group relative flex-1 rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 transition hover:from-amber-700 hover:to-amber-500"
                style={{ minHeight: d.total > 0 ? "8px" : "2px" }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-stone-900 px-1.5 py-0.5 text-[9px] text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap">
                  {formatPrice(d.total)}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-stone-400">
            {data.salesByDay.map((d) => <span key={d.date}>{new Date(d.date).toLocaleDateString("en", { weekday: "short" })}</span>)}
          </div>
        </AdminCard>

        {/* Order status breakdown */}
        <AdminCard className="p-5">
          <h3 className="mb-4 font-serif text-lg font-semibold text-stone-900">Order Status</h3>
          <div className="space-y-3">
            {data.statusBreakdown.map((s) => {
              const total = data.statusBreakdown.reduce((a, b) => a + b.count, 0) || 1;
              const pct = (s.count / total) * 100;
              return (
                <div key={s.status}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize text-stone-600">{s.status}</span>
                    <span className="font-semibold text-stone-900">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: statusColors[s.status] || "#78716c" }} />
                  </div>
                </div>
              );
            })}
            {data.statusBreakdown.length === 0 && <p className="text-sm text-stone-400">No orders yet</p>}
          </div>
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <AdminCard>
          <div className="flex items-center justify-between border-b border-stone-100 p-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900">Recent Orders</h3>
            <button onClick={() => onNavigate("sales")} className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-stone-100">
            {data.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">{o.customerName}</p>
                  <p className="text-xs text-stone-500">{o.items.length} item(s) · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-stone-900">{formatPrice(o.total)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_COLORS[o.status] ? `bg-${STATUS_COLORS[o.status]}-100 text-${STATUS_COLORS[o.status]}-700` : "bg-stone-100 text-stone-700"}`} style={{ backgroundColor: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>{o.status}</span>
                </div>
              </div>
            ))}
            {data.recentOrders.length === 0 && <p className="p-4 text-sm text-stone-400">No orders yet</p>}
          </div>
        </AdminCard>

        {/* Top products */}
        <AdminCard>
          <div className="flex items-center justify-between border-b border-stone-100 p-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900">Top Products</h3>
            <button onClick={() => onNavigate("catalog")} className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:underline">
              View catalog <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-stone-100">
            {data.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-4">
                <span className="font-serif text-lg font-semibold text-stone-300">{i + 1}</span>
                <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-900">{p.name}</p>
                  <p className="text-xs text-stone-500">★ {p.rating} · {p.reviewCount} reviews</p>
                </div>
                <span className="text-sm font-semibold text-stone-900">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Low stock alert */}
      {data.lowStock.length > 0 && (
        <AdminCard className="mt-6 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-serif text-base font-semibold text-stone-900">Low Stock Alert</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.lowStock.map((p) => (
              <span key={p.id} className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs">
                <span className="font-medium text-stone-900">{p.name}</span>
                <span className="ml-2 text-amber-600">{p.stock} left</span>
              </span>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminPage>
  );
}
