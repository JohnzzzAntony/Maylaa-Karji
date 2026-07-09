"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, RefreshCw, EyeOff, BarChart2 } from "lucide-react";
import { AdminCard, AdminBadge, AdminTable } from "../admin-ui";
import { formatPrice } from "@/lib/format";

type Bestseller = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  total: number;
};

type NeverPurchasedProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  brand?: { name: string };
};

export function AdminReports() {
  const [activeTab, setActiveTab] = useState<"bestsellers" | "never">("bestsellers");
  const [bestsellers, setBestsellers] = useState<Bestseller[]>([]);
  const [neverPurchased, setNeverPurchased] = useState<NeverPurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBestsellers = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/reports/bestsellers")
      .then((r) => r.json())
      .then((d) => {
        setBestsellers(d.bestsellers || []);
        setLoading(false);
      });
  }, []);

  const loadNeverPurchased = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/reports/never-purchased")
      .then((r) => r.json())
      .then((d) => {
        setNeverPurchased(d.products || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === "bestsellers") loadBestsellers();
    else loadNeverPurchased();
  }, [activeTab, loadBestsellers, loadNeverPurchased]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("bestsellers")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "bestsellers"
              ? "border-b-2 border-amber-600 text-amber-600 font-bold"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Bestsellers
        </button>
        <button
          onClick={() => setActiveTab("never")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "never"
              ? "border-b-2 border-amber-600 text-amber-600 font-bold"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Products Never Purchased
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {activeTab === "bestsellers"
            ? "Analyze top-performing fragrance products calculated by items sold."
            : "Review products that haven't generated sales yet to plan marketing promotions."}
        </span>
        <button
          onClick={activeTab === "bestsellers" ? loadBestsellers : loadNeverPurchased}
          className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Generating report...</div>
        ) : activeTab === "bestsellers" ? (
          bestsellers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <TrendingUp size={32} className="text-stone-300" />
              <p className="text-sm text-stone-500">No sales data available yet</p>
            </div>
          ) : (
            <AdminTable headers={["Rank", "Product Name", "Manufacturer", "Unit Price", "Qty Sold", "Total Revenue"]}>
              {bestsellers.map((b, idx) => (
                <tr key={b.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-sm font-bold text-stone-500">#{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-stone-900">{b.name}</td>
                  <td className="px-4 py-3 text-sm text-stone-600">{b.brand}</td>
                  <td className="px-4 py-3 text-sm text-stone-850">{formatPrice(b.price)}</td>
                  <td className="px-4 py-3 text-sm">
                    <AdminBadge color="amber">{b.quantity} sold</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-stone-900">{formatPrice(b.total)}</td>
                </tr>
              ))}
            </AdminTable>
          )
        ) : neverPurchased.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <EyeOff size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">All products have been purchased at least once!</p>
          </div>
        ) : (
          <AdminTable headers={["Product Name", "SKU", "Manufacturer", "Price", "Stock"]}>
            {neverPurchased.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-stone-600">{p.sku}</td>
                <td className="px-4 py-3 text-sm text-stone-600">{p.brand?.name || "—"}</td>
                <td className="px-4 py-3 text-sm text-stone-850">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-sm text-stone-600">{p.stock} units</td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
