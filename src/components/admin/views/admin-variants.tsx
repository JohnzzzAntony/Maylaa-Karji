"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { AdminCard, AdminButton, AdminTable, AdminSelect } from "../admin-ui";
import { toast } from "sonner";

export function AdminVariants() {
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
      // We can reuse the products PUT api to update size/concentration
      const tx = updates.map(async (u) => {
        return fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(u),
        });
      });
      await Promise.all(tx);
      toast.success("Variant changes saved successfully");
      setEdited({});
      load();
    } catch {
      toast.error("Save error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Bulk Edit Variant Products</h2>
        <div className="flex gap-2">
          <AdminButton variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw size={13} /> Refresh</AdminButton>
          <AdminButton variant="amber" size="sm" onClick={handleSave} disabled={saving || Object.keys(edited).length === 0}><Save size={13} /> {saving ? "Saving..." : "Save Variant Changes"}</AdminButton>
        </div>
      </div>
      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading products...</div>
        ) : (
          <AdminTable headers={["Product", "SKU", "Size", "Size Unit", "Concentration", "Status"]}>
            {products.map((p) => {
              const current = edited[p.id] || {};
              const size = current.size !== undefined ? current.size : p.size;
              const sizeUnit = current.sizeUnit !== undefined ? current.sizeUnit : p.sizeUnit || "ml";
              const concentration = current.concentration !== undefined ? current.concentration : p.concentration;

              return (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-stone-900">{p.name}</p>
                    <p className="text-xs text-stone-500">{p.brand?.name}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-600">{p.sku}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={size}
                      onChange={(e) => handleChange(p.id, "size", Number(e.target.value))}
                      className="w-20 rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-amber-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={sizeUnit}
                      onChange={(e) => handleChange(p.id, "sizeUnit", e.target.value)}
                      className="w-16 rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-amber-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={concentration}
                      onChange={(e) => handleChange(p.id, "concentration", e.target.value)}
                      className="rounded border border-stone-200 px-2 py-1 text-sm outline-none focus:border-amber-500"
                    >
                      {["Eau de Parfum", "Extrait de Parfum", "Eau de Toilette", "Eau de Cologne", "Oud Oil"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {Object.keys(current).length > 0 ? (
                      <span className="text-amber-600 font-semibold">Unsaved</span>
                    ) : (
                      <span className="text-stone-400">Saved</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
