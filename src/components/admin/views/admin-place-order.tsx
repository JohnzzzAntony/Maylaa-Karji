"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ShoppingBag, User, MapPin } from "lucide-react";
import { AdminCard, AdminButton, AdminInput, AdminSelect, AdminTable } from "../admin-ui";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";

type DraftItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  brand: string;
  size: number;
};

export function AdminPlaceOrder() {
  const [products, setProducts] = useState<any[]>([]);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "" });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, []);

  const addDraftItem = () => {
    if (!selectedProduct) return;
    const p = products.find((x) => x.id === selectedProduct);
    if (!p) return;

    const existing = draftItems.find((x) => x.id === p.id);
    if (existing) {
      setDraftItems((items) =>
        items.map((x) => (x.id === p.id ? { ...x, quantity: x.quantity + selectedQty } : x))
      );
    } else {
      setDraftItems((items) => [
        ...items,
        {
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: selectedQty,
          sku: p.sku,
          brand: p.brand?.name || "Unknown",
          size: p.size,
        },
      ]);
    }
    setSelectedProduct("");
    setSelectedQty(1);
    toast.success(`${p.name} added to draft order`);
  };

  const removeDraftItem = (id: string) => {
    setDraftItems((items) => items.filter((x) => x.id !== id));
  };

  const sub = draftItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = sub >= 300 || sub === 0 ? 0 : 35;
  const total = sub + shipping;

  const handlePlaceOrder = async () => {
    if (draftItems.length === 0) {
      toast.error("Add at least one product to place order");
      return;
    }
    if (!customer.name.trim() || !customer.email.trim() || !customer.address.trim() || !customer.city.trim()) {
      toast.error("Please fill all required customer shipping information");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer.email,
          customerName: customer.name,
          items: draftItems,
          subtotal: sub,
          shipping,
          total,
          address: { ...customer, paymentMethod: "Manual (Admin placed)" },
        }),
      });
      if (res.ok) {
        toast.success("Manual order placed successfully!");
        setDraftItems([]);
        setCustomer({ name: "", email: "", phone: "", address: "", city: "", zip: "" });
      } else {
        toast.error("Failed to place manual order");
      }
    } catch {
      toast.error("Network error occurred");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Place Manual Order</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column: Product Selection & Draft Cart */}
        <div className="space-y-4 lg:col-span-2">
          <AdminCard className="p-4 space-y-3">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700">
              <ShoppingBag size={14} className="text-amber-600" /> Select Products
            </h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                >
                  <option value="">Choose a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand?.name}) — {formatPrice(p.price)} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                min="1"
                value={selectedQty}
                onChange={(e) => setSelectedQty(Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-lg border border-stone-300 bg-white px-2 py-2 text-sm text-center outline-none focus:border-amber-500"
              />
              <AdminButton variant="amber" onClick={addDraftItem}>
                <Plus size={15} /> Add
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="p-4 border-b border-stone-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">Draft Order Items</h3>
            </div>
            {draftItems.length === 0 ? (
              <div className="p-8 text-center text-sm text-stone-400">No items added to draft order yet</div>
            ) : (
              <AdminTable headers={["Product", "Sku", "Price", "Qty", "Total", "Actions"]}>
                {draftItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{item.name}</p>
                      <p className="text-[10px] text-stone-500">{item.brand} · {item.size}ml</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-600">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-stone-850">{formatPrice(item.price)}</td>
                    <td className="px-4 py-3 text-sm text-stone-850">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-stone-900">{formatPrice(item.price * item.quantity)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeDraftItem(item.id)} className="text-stone-500 hover:text-rose-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        </div>

        {/* Right Column: Customer Info & Summary */}
        <div className="space-y-4">
          <AdminCard className="p-4 space-y-4">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700">
              <User size={14} className="text-amber-600" /> Customer Information
            </h3>
            <div className="space-y-3">
              <AdminInput label="Full Name *" value={customer.name} onChange={(v) => setCustomer((c) => ({ ...c, name: v }))} placeholder="John Doe" />
              <AdminInput label="Email Address *" type="email" value={customer.email} onChange={(v) => setCustomer((c) => ({ ...c, email: v }))} placeholder="john@example.com" />
              <AdminInput label="Phone Number" value={customer.phone} onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))} placeholder="+971 50 123 4567" />
            </div>
          </AdminCard>

          <AdminCard className="p-4 space-y-4">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700">
              <MapPin size={14} className="text-amber-600" /> Shipping Address
            </h3>
            <div className="space-y-3">
              <AdminInput label="Address *" value={customer.address} onChange={(v) => setCustomer((c) => ({ ...c, address: v }))} placeholder="Deira, Street 15" />
              <AdminInput label="City *" value={customer.city} onChange={(v) => setCustomer((c) => ({ ...c, city: v }))} placeholder="Dubai" />
              <AdminInput label="Zip / Postal Code" value={customer.zip} onChange={(v) => setCustomer((c) => ({ ...c, zip: v }))} placeholder="00000" />
            </div>
          </AdminCard>

          <AdminCard className="p-4 bg-stone-50/50 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">Order Totals</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-stone-850">{formatPrice(sub)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-stone-850">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-semibold text-stone-900">
                <span>Total</span>
                <span className="text-amber-700">{formatPrice(total)}</span>
              </div>
            </div>
            <AdminButton variant="amber" className="w-full mt-2" onClick={handlePlaceOrder} disabled={placing || draftItems.length === 0}>
              {placing ? "Placing Order..." : "Place Order"}
            </AdminButton>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
