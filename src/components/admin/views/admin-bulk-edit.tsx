"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { AdminCard, AdminButton, AdminBadge } from "../admin-ui";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function AdminBulkEdit() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState<Record<string, any>>({});

  const load = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (id: string, field: string, val: any) => {
    setEdited((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        id,
        [field]: val,
      },
    }));
  };

  const handleSave = async () => {
    const updates = Object.values(edited);
    if (updates.length === 0) {
      toast.info("No changes to save");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (res.ok) {
        toast.success("Bulk changes saved successfully");
        setEdited({});
        load();
      } else {
        toast.error("Failed to save bulk changes");
      }
    } catch {
      toast.error("Save error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Bulk Edit Products</h2>
          <p className="text-xs text-stone-500">Edit price, stock, SKU, and name values across catalog</p>
        </div>
        <div className="flex gap-2">
          <AdminButton variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw size={13} /> Refresh</AdminButton>
          <AdminButton variant="amber" size="sm" onClick={handleSave} disabled={saving || Object.keys(edited).length === 0}><Save size={13} /> {saving ? "Saving..." : `Save Changes (${Object.keys(edited).length})`}</AdminButton>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-stone-400 bg-white rounded-xl border border-stone-200">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center text-sm text-stone-400 bg-white rounded-xl border border-stone-200">No products found</div>
      ) : (
        <div className="grid gap-3">
          {products.map((p, i) => {
            const current = edited[p.id] || {};
            const name = current.name !== undefined ? current.name : p.name;
            const sku = current.sku !== undefined ? current.sku : p.sku;
            const price = current.price !== undefined ? current.price : p.price;
            const stock = current.stock !== undefined ? current.stock : p.stock;
            const isChanged = Object.keys(current).length > 0;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <AdminCard className="p-3.5 flex flex-col md:flex-row gap-4 items-center border border-stone-200 hover:border-amber-500/30 hover:shadow-md transition duration-200">
                  {/* Product thumbnail & current info */}
                  <div className="flex items-center gap-3 w-full md:w-1/4 shrink-0">
                    <img
                      src={Array.isArray(p.images) && p.images[0] ? p.images[0] : "/images/products/future-oud.jpg"}
                      alt={p.name}
                      className="h-11 w-11 rounded-lg object-cover border border-stone-200/60"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 truncate text-xs">{p.name}</p>
                      <p className="text-[10px] font-mono text-stone-400 truncate">{p.sku}</p>
                    </div>
                  </div>

                  {/* Form fields inputs grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Name</label>
                      <input
                        value={name}
                        onChange={(e) => handleChange(p.id, "name", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500 bg-white text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">SKU</label>
                      <input
                        value={sku}
                        onChange={(e) => handleChange(p.id, "sku", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-mono outline-none focus:border-amber-500 bg-white text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Price (AED)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => handleChange(p.id, "price", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500 bg-white text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Stock</label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => handleChange(p.id, "stock", e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500 bg-white text-stone-800"
                      />
                    </div>
                  </div>

                  {/* Unsaved changes indicators */}
                  <div className="flex items-center gap-2 shrink-0 justify-end w-full md:w-auto">
                    {isChanged ? (
                      <AdminBadge color="amber">edited</AdminBadge>
                    ) : (
                      <AdminBadge color="stone">saved</AdminBadge>
                    )}
                  </div>
                </AdminCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

