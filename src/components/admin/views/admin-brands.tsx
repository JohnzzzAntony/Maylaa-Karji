"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Home } from "lucide-react";
import { AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminTextarea } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Brand = {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  logoColor: string;
  _count?: { products: number };
};

const EMPTY = { name: "", country: "France", description: "", logoColor: "#B8935A" };

export function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/brands")
      .then((r) => r.json())
      .then((d) => {
        setBrands(d.brands || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (b: Brand) => {
    setForm({ name: b.name, country: b.country, description: b.description, logoColor: b.logoColor });
    setEditing(b);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const res = await fetch("/api/admin/brands", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    if (res.ok) {
      toast.success(editing ? "Brand updated" : "Brand created");
      close();
      load();
    } else {
      const err = await res.json();
      toast.error(err.error || "Save failed");
    }
  };

  const del = async (b: Brand) => {
    if (b._count && b._count.products > 0) {
      toast.error(`Cannot delete "${b.name}" because it is associated with ${b._count.products} products.`);
      return;
    }
    if (!confirm(`Delete brand "${b.name}"?`)) return;
    const res = await fetch(`/api/admin/brands?id=${b.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      load();
    } else {
      const err = await res.json();
      toast.error(err.error || "Delete failed");
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Manufacturers (Brands)</h2>
        <AdminButton variant="amber" size="sm" onClick={openCreate}><Plus size={13} /> Add Manufacturer</AdminButton>
      </div>
      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Home size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No brands found</p>
          </div>
        ) : (
          <AdminTable headers={["Manufacturer", "Country", "Products Count", "Color Swatch", "Actions"]}>
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{b.name}</p>
                  <p className="text-xs text-stone-500 max-w-xs truncate">{b.description || "No description"}</p>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{b.country}</td>
                <td className="px-4 py-3">
                  <AdminBadge color={b._count?.products ? "amber" : "stone"}>
                    {b._count?.products || 0} Products
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded border border-stone-200" style={{ backgroundColor: b.logoColor }} />
                    <span className="font-mono text-xs">{b.logoColor}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                    <button onClick={() => del(b)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-md bg-white p-6">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">
            {editing ? "Edit Manufacturer" : "Add Manufacturer"}
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Manufacturer Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Creed" />
            <AdminInput label="Country / Origin" value={form.country} onChange={(v) => set("country", v)} placeholder="e.g. France" />
            <AdminTextarea label="Description" value={form.description} onChange={(v) => set("description", v)} rows={3} placeholder="A luxury heritage perfume house..." />
            
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-600">Brand Color Theme</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.logoColor}
                  onChange={(e) => set("logoColor", e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border border-stone-200 p-0"
                />
                <input
                  type="text"
                  value={form.logoColor}
                  onChange={(e) => set("logoColor", e.target.value)}
                  className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
              <AdminButton variant="outline" onClick={close}>Cancel</AdminButton>
              <AdminButton variant="amber" onClick={save}>{editing ? "Save" : "Create"}</AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
