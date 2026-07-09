"use client";

import { useEffect, useState } from "react";
import { useAuth, useWishlist } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { User, Package, Heart, LogOut, Loader2, Sparkles, MapPin, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { SectionDivider } from "./section-divider";

export function ProfilePage({
  onNavigate,
  onLogout,
}: {
  onNavigate: (view: "home" | "shop" | "cart") => void;
  onLogout: () => void;
}) {
  const { user, fetchUser, logout } = useAuth();
  const { ids: wishlistIds } = useWishlist();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  useEffect(() => {
    if (!user) {
      onNavigate("home");
      return;
    }

    const loadData = async () => {
      try {
        const res = await fetch("/api/orders?userId=" + user.id);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, onNavigate]);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    onLogout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-secondary/30 pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          
          {/* Sidebar */}
          <div className="w-full shrink-0 space-y-6 lg:w-72">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="bg-espresso px-6 py-8 text-center text-white">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold">{user.name}</h2>
                <p className="mt-1 text-sm text-white/70">{user.email}</p>
                {user.role === "admin" || user.role === "superadmin" ? (
                  <span className="mt-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
                    {user.role.toUpperCase()}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col p-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${activeTab === "orders" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
                >
                  <Package size={18} /> My Orders
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${activeTab === "settings" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
                >
                  <User size={18} /> Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Heart size={16} /> Wishlist
              </h3>
              <p className="mt-2 text-sm text-foreground">You have <strong className="text-gold">{wishlistIds.length}</strong> items in your wishlist.</p>
              <button onClick={() => { document.dispatchEvent(new CustomEvent("open-wishlist")); }} className="mt-4 w-full rounded-lg border border-border py-2.5 text-sm font-medium transition hover:border-gold hover:text-gold">
                View Wishlist
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <h1 className="font-serif text-3xl font-semibold">{activeTab === "orders" ? "Order History" : "Account Settings"}</h1>
            
            {activeTab === "orders" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-border bg-white">
                    <Loader2 size={24} className="animate-spin text-gold" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-16 text-center">
                    <Package size={48} className="text-muted-foreground/30" />
                    <h3 className="mt-4 font-serif text-xl font-semibold">No orders yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">When you place orders, they will appear here.</p>
                    <button onClick={() => onNavigate("shop")} className="mt-6 rounded-lg bg-espresso px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    return (
                      <div key={order.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md">
                        <div className="border-b border-border bg-secondary/50 px-6 py-4">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</p>
                              <p className="mt-1 font-mono text-sm">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</p>
                              <p className="mt-1 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
                              <p className="mt-1 font-serif text-lg font-semibold text-gold">{formatPrice(order.total)}</p>
                            </div>
                            <div>
                              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                order.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                                order.status === "processing" ? "bg-blue-100 text-blue-800" :
                                order.status === "cancelled" ? "bg-red-100 text-red-800" :
                                "bg-amber-100 text-amber-800"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-4">
                          <div className="space-y-4">
                            {items.map((item: any, i: number) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">{item.brand} · {item.size}ml</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                  <p className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-4 mb-6">Personal Information</h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <p className="text-sm font-medium">{user.name}</p>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
                        <p className="text-sm font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-4 mb-6">Password</h3>
                    <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:border-gold hover:text-gold">
                      <Edit3 size={16} /> Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
