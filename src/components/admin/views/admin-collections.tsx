"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminTextarea, AdminToggle, AdminImageInput } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Collection = {
  id: string; title: string; slug: string; description: string | null;
  banner: string | null; productIds: string[]; isActive: boolean; displayOrder: number;
};
type Product = { id: string; name: string; sku: string };

const EMPTY = { title: "", description: "", banner: "", productIds: [] as string[], isActive: true, displayOrder: 0 };

export function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [productSearch, setProductSearch] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/collections").then((r) => r.json()).then((d) => setCollections(d.collections || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetch("/api/admin/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (c: Collection) => {
    setForm({ title: c.title, description: c.description ?? "", banner: c.banner ?? "", productIds: c.productIds, isActive: c.isActive, displayOrder: c.displayOrder });
    setEditing(c);
    setOpen(true);
  };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); setProductSearch(""); };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const res = await fetch("/api/admin/collections", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    if (res.ok) { toast.success(editing ? "Collection updated" : "Collection created"); close(); load(); }
    else { const err = await res.json(); toast.error(err.error || "Save failed"); }
  };

  const del = async (c: Collection) => {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await fetch(`/api/admin/collections?id=${c.id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  const toggleProduct = (id: string) =>
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id) ? f.productIds.filter((x) => x !== id) : [...f.productIds, id],
    }));

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const filteredProducts = products.filter(
    (p) =>
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <AdminPage
      title="Collections"
      subtitle="Curated product collections for the storefront"
      action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Collection</AdminButton>}
    >
      <AdminCard>
        {collections.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Layers size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No collections yet</p>
          </div>
        ) : (
          <AdminTable headers={["Collection", "Products", "Order", "Status", "Actions"]}>
            {collections.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{c.title}</p>
                  <p className="text-xs text-stone-500">{c.slug}</p>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{c.productIds.length} products</td>
                <td className="px-4 py-3 text-sm text-stone-500">{c.displayOrder}</td>
                <td className="px-4 py-3"><AdminBadge color={c.isActive ? "green" : "stone"}>{c.isActive ? "Active" : "Inactive"}</AdminBadge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                    <button onClick={() => del(c)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">
            {editing ? "Edit Collection" : "New Collection"}
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Title *" value={form.title} onChange={(v) => set("title", v)} placeholder="Summer Exclusives" />
            <AdminTextarea label="Description" value={form.description} onChange={(v) => set("description", v)} rows={2} />
            <AdminImageInput label="Banner Image URL" value={form.banner} onChange={(v) => set("banner", v)} helperText="Recommended wide ratio (1200x400px)." />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Display Order" type="number" value={String(form.displayOrder)} onChange={(v) => set("displayOrder", Number(v))} />
              <div className="flex items-end pb-2"><AdminToggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Active" /></div>
            </div>
            {/* Product selector */}
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">Products ({form.productIds.length} selected)</label>
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="mb-2 w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-amber-500"
              />
              <div className="max-h-48 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50">
                {filteredProducts.map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-3 border-b border-stone-100 px-3 py-2 hover:bg-amber-50 last:border-0">
                    <input
                      type="checkbox"
                      checked={form.productIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="rounded accent-amber-500"
                    />
                    <span className="flex-1 text-sm text-stone-800">{p.name}</span>
                    <span className="font-mono text-[10px] text-stone-400">{p.sku}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
              <AdminButton variant="outline" onClick={close}>Cancel</AdminButton>
              <AdminButton variant="amber" onClick={save}>{editing ? "Save" : "Create"}</AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
