"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, BarChart3, ShoppingBag, Plus, CreditCard, ShoppingCart, Heart, BarChart, ChevronRight } from "lucide-react";
import { AdminPage, AdminCard, AdminTable, AdminBadge, StatCard } from "../admin-ui";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// Sub-components
import { AdminPlaceOrder } from "./admin-place-order";
import { AdminCartsWishlists } from "./admin-carts-wishlists";
import { AdminReports } from "./admin-reports";

type Order = { id: string; customerName: string; email: string; total: number; subtotal: number; shipping: number; status: string; createdAt: string; items: Array<{ name: string; quantity: number; price: number }> };

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLOR: Record<string, "stone" | "amber" | "blue" | "green" | "red"> = { pending: "amber", confirmed: "blue", shipped: "blue", delivered: "green", cancelled: "red" };

type SalesTab = "orders" | "place-order" | "carts-wishlists" | "reports";

const TABS: { id: SalesTab; label: string; icon: any }[] = [
  { id: "orders", label: "Orders", icon: CreditCard },
  { id: "place-order", label: "Place Order", icon: Plus },
  { id: "carts-wishlists", label: "Carts & Wishlists", icon: ShoppingCart },
  { id: "reports", label: "Bestsellers & Analytics", icon: BarChart },
];

export function AdminSales() {
  const [activeTab, setActiveTab] = useState<SalesTab>("orders");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row bg-stone-50">
      {/* Left Sub-Sidebar */}
      <aside className="w-full shrink-0 border-b border-stone-200 bg-white p-4 md:w-60 md:border-b-0 md:border-r md:p-5">
        <div className="mb-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <DollarSign className="text-amber-600" size={18} />
            Sales Workspace
          </h2>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Sub-modules</p>
        </div>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible no-scrollbar">
          {TABS.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition w-full md:text-left",
                  isActive 
                    ? "bg-amber-600 text-white shadow-sm" 
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <t.icon size={14} />
                <span>{t.label}</span>
                {isActive && <ChevronRight className="ml-auto hidden md:block" size={12} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Sub-Content */}
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
        {activeTab === "orders" && <ManageOrders />}
        {activeTab === "place-order" && <AdminPlaceOrder />}
        {activeTab === "carts-wishlists" && <AdminCartsWishlists />}
        {activeTab === "reports" && <AdminReports />}
      </div>
    </div>
  );
}

function ManageOrders() {
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
    <div className="space-y-4">
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="amber" />
        <StatCard label="Revenue (filtered)" value={formatPrice(totalRevenue)} icon={DollarSign} color="emerald" />
        <StatCard label="Avg Order Value" value={formatPrice(avgOrder)} icon={BarChart3} color="blue" />
        <StatCard label="Items Sold" value={orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0)} icon={Package} color="violet" />
      </div>

      {/* Status filter tabs */}
      <AdminCard className="p-2">
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
          <AdminTable headers={["Order ID", "Customer", "Items Purchased", "Total Price", "Date", "Status", "Update Status"]}>
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono text-xs text-stone-500">#{o.id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{o.customerName}</p>
                  <p className="text-xs text-stone-500">{o.email}</p>
                </td>
                <td className="px-4 py-3 text-xs text-stone-600 font-medium">
                  {o.items.map((i, idx) => <div key={idx}>{i.quantity}&times; {i.name}</div>)}
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
    </div>
  );
}
