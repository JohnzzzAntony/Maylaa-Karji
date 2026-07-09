"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Heart, RefreshCw, Clock } from "lucide-react";
import { AdminCard, AdminBadge, AdminTable } from "../admin-ui";
import { formatPrice } from "@/lib/format";

type Cart = {
  user: { name: string; email: string };
  items: { name: string; sku: string; price: number; quantity: number }[];
  total: number;
  updatedAt: string;
};

type Wishlist = {
  user: { name: string; email: string };
  items: { name: string; sku: string; price: number }[];
  createdAt: string;
};

export function AdminCartsWishlists() {
  const [activeTab, setActiveTab] = useState<"carts" | "wishlists">("carts");
  const [carts, setCarts] = useState<Cart[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCarts = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/carts")
      .then((r) => r.json())
      .then((d) => {
        setCarts(d.carts || []);
        setLoading(false);
      });
  }, []);

  const loadWishlists = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/wishlists")
      .then((r) => r.json())
      .then((d) => {
        setWishlists(d.wishlists || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === "carts") loadCarts();
    else loadWishlists();
  }, [activeTab, loadCarts, loadWishlists]);

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("carts")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "carts"
              ? "border-b-2 border-amber-600 text-amber-600 font-bold"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Current Shopping Carts
        </button>
        <button
          onClick={() => setActiveTab("wishlists")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "wishlists"
              ? "border-b-2 border-amber-600 text-amber-600 font-bold"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Current Wishlists
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {activeTab === "carts"
            ? "Observe active, database-synced customer shopping sessions in real-time."
            : "Review products that customers have saved to their personal wishlists."}
        </span>
        <button
          onClick={activeTab === "carts" ? loadCarts : loadWishlists}
          className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading details...</div>
        ) : activeTab === "carts" ? (
          carts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <ShoppingCart size={32} className="text-stone-300" />
              <p className="text-sm text-stone-500">No active shopping carts found</p>
            </div>
          ) : (
            <AdminTable headers={["Customer", "Cart Items Breakdown", "Cart Value", "Last Active"]}>
              {carts.map((c, idx) => (
                <tr key={idx} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-stone-900">{c.user?.name || "Guest User"}</p>
                    <p className="text-xs text-stone-500">{c.user?.email || "No email"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-1">
                      {c.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-xs text-stone-600">
                          <span className="font-medium text-stone-800">{item.name}</span>
                          <span className="text-stone-400"> (SKU: {item.sku})</span>
                          <span className="ml-1 text-amber-600 font-semibold">&times; {item.quantity}</span>
                          <span className="ml-2 text-stone-400">({formatPrice(item.price)} each)</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(c.total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Clock size={12} />
                      {new Date(c.updatedAt).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )
        ) : wishlists.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Heart size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No active wishlists found</p>
          </div>
        ) : (
          <AdminTable headers={["Customer", "Saved Items", "Date Added"]}>
            {wishlists.map((w, idx) => (
              <tr key={idx} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-stone-900">{w.user?.name || "Guest User"}</p>
                  <p className="text-xs text-stone-500">{w.user?.email || "No email"}</p>
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-1">
                    {w.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-xs text-stone-650">
                        <span className="font-medium text-stone-805">{item.name}</span>
                        <span className="text-stone-400"> (SKU: {item.sku})</span>
                        <span className="ml-2 text-stone-500">— {formatPrice(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">
                  {new Date(w.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
