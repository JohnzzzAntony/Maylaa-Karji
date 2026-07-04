"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, BarChart3, ShoppingBag } from "lucide-react";
import { AdminPage, AdminCard, AdminTable, AdminBadge, StatCard } from "../admin-ui";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { DollarSign, Package } from "lucide-react";

type Order = { id: string; customerName: string; email: string; total: number; subtotal: number; shipping: number; status: string; createdAt: string; items: Array<{ name: string; quantity: number; price: number }> };

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLOR: Record<string, "stone" | "amber" | "blue" | "green" | "red"> = { pending: "amber", confirmed: "blue", shipped: "blue", delivered: "green", cancelled: "red" };

export function AdminSales() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${filter}`)
      .then((r) => r.json())
      .then((d: { orders?: Order[] }) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [filter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) {
      toast.success(`Order marked as ${status}`);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;

  return (
    <AdminPage title="Sales" subtitle="Manage orders and track sales performance">
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="amber" />
        <StatCard label="Revenue (filtered)" value={formatPrice(totalRevenue)} icon={DollarSign} color="emerald" />
        <StatCard label="Avg Order Value" value={formatPrice(avgOrder)} icon={BarChart3} color="blue" />
        <StatCard label="Items Sold" value={orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0)} icon={Package} color="violet" />
      </div>

      {/* Status filter tabs */}
      <AdminCard className="mb-4 p-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition ${filter === s ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`}
            >
              {s} {s !== "all" && <span className="ml-1 opacity-60">({orders.filter((o) => o.status === s).length})</span>}
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <ShoppingBag size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No orders found</p>
          </div>
        ) : (
          <AdminTable headers={["Order", "Customer", "Items", "Total", "Date", "Status", "Update"]}>
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-500">#{o.id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{o.customerName}</p>
                  <p className="text-xs text-stone-500">{o.email}</p>
                </td>
                <td className="px-4 py-3 text-xs text-stone-600">
                  {o.items.map((i, idx) => <div key={idx}>{i.quantity}× {i.name}</div>)}
                </td>
                <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 text-xs text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3"><AdminBadge color={STATUS_COLOR[o.status]}>{o.status}</AdminBadge></td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="rounded-lg border border-stone-300 px-2 py-1 text-xs outline-none focus:border-amber-500"
                  >
                    {STATUSES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </AdminPage>
  );
}
