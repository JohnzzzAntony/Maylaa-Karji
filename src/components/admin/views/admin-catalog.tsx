"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, X, Package } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminTextarea, AdminSelect, AdminToggle } from "../admin-ui";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string; name: string; slug: string; sku: string; price: number; compareAtPrice: number | null;
  stock: number; badge: string | null; gender: string; concentration: string; size: number;
  isTrending: boolean; isExclusive: boolean; isBestSeller: boolean; isArtisanal: boolean; isFeatured: boolean; isNew: boolean;
  images: string[]; brand?: { id: string; name: string }; category?: { id: string; name: string };
  rating: number; reviewCount: number;
};
type Brand = { id: string; name: string };
type Category = { id: string; name: string };

const EMPTY = {
  name: "", brandId: "", categoryId: "", description: "", longDescription: "", price: "", compareAtPrice: "",
  size: "100", concentration: "Eau de Parfum", topNotes: "", heartNotes: "", baseNotes: "",
  images: "/images/products/future-oud.jpg", stock: "50", sku: "", badge: "", gender: "Unisex",
  isTrending: false, isExclusive: false, isBestSeller: false, isArtisanal: false, isFeatured: false, isNew: false,
};

export function AdminCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, string | boolean>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/products${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, [search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetch("/api/brands").then((r) => r.json()).then((d) => setBrands(d.brands || []));
    fetch("/api/categories").then((r) => r.json()).then((d) => setCats(d.categories || []));
  }, []);

  const openCreate = () => { setForm(EMPTY); setCreating(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, brandId: p.brand?.id ?? "", categoryId: p.category?.id ?? "", description: p.description,
      longDescription: p.longDescription, price: String(p.price), compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
      size: String(p.size), concentration: p.concentration, topNotes: p.topNotes, heartNotes: p.heartNotes, baseNotes: p.baseNotes,
      images: p.images.join(", "), stock: String(p.stock), sku: p.sku, badge: p.badge ?? "", gender: p.gender,
      isTrending: p.isTrending, isExclusive: p.isExclusive, isBestSeller: p.isBestSeller, isArtisanal: p.isArtisanal, isFeatured: p.isFeatured, isNew: p.isNew,
    });
    setEditing(p);
  };

  const close = () => { setEditing(null); setCreating(false); setForm(EMPTY); };

  const save = async () => {
    if (!form.name || !form.brandId || !form.categoryId || !form.price) {
      toast.error("Name, brand, category, and price are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      images: String(form.images).split(",").map((s) => s.trim()).filter(Boolean),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      size: Number(form.size),
      stock: Number(form.stock),
    };
    try {
      const url = editing ? `/api/admin/products` : `/api/admin/products`;
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (res.ok) {
        toast.success(editing ? "Product updated" : "Product created");
        close();
        load();
      } else {
        toast.error("Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Product deleted"); load(); }
  };

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminPage
      title="Catalog"
      subtitle={`${products.length} products in your store`}
      action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Product</AdminButton>}
    >
      {/* Search */}
      <AdminCard className="mb-4 p-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-amber-500"
          />
        </div>
      </AdminCard>

      {/* Table */}
      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Package size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No products found</p>
          </div>
        ) : (
          <AdminTable headers={["Product", "SKU", "Price", "Stock", "Badges", "Status", "Actions"]}>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-stone-900">{p.name}</p>
                      <p className="text-xs text-stone-500">{p.brand?.name} · {p.concentration}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-stone-600">{p.sku}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-stone-900">{formatPrice(p.price)}</span>
                  {p.compareAtPrice && <span className="ml-1 text-xs text-stone-400 line-through">{formatPrice(p.compareAtPrice)}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 15 ? "font-semibold text-rose-600" : "text-stone-600"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.badge && <AdminBadge color="amber">{p.badge}</AdminBadge>}
                    {p.isTrending && <AdminBadge color="blue">Trending</AdminBadge>}
                    {p.isBestSeller && <AdminBadge color="green">Bestseller</AdminBadge>}
                    {p.isNew && <AdminBadge color="green">New</AdminBadge>}
                    {p.isExclusive && <AdminBadge color="red">Exclusive</AdminBadge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex h-2 w-2 rounded-full ${p.stock > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span className="ml-1.5 text-xs text-stone-600">{p.stock > 0 ? "Active" : "Out"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 transition hover:bg-amber-50 hover:text-amber-600" aria-label="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => del(p)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      {/* Create/Edit dialog */}
      <Dialog open={creating || !!editing} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">{editing ? "Edit Product" : "New Product"}</DialogTitle>
          <div className="mt-4 space-y-4">
            <AdminInput label="Product Name *" value={form.name as string} onChange={(v) => set("name", v)} placeholder="Future Oud" />
            <div className="grid grid-cols-2 gap-3">
              <AdminSelect label="Brand *" value={form.brandId as string} onChange={(v) => set("brandId", v)} options={[{ value: "", label: "Select brand" }, ...brands.map((b) => ({ value: b.id, label: b.name }))]} />
              <AdminSelect label="Category *" value={form.categoryId as string} onChange={(v) => set("categoryId", v)} options={[{ value: "", label: "Select category" }, ...cats.map((c) => ({ value: c.id, label: c.name }))]} />
            </div>
            <AdminTextarea label="Short Description" value={form.description as string} onChange={(v) => set("description", v)} rows={2} />
            <AdminTextarea label="Long Description" value={form.longDescription as string} onChange={(v) => set("longDescription", v)} rows={3} />
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label="Price (AED) *" type="number" value={form.price as string} onChange={(v) => set("price", v)} />
              <AdminInput label="Compare At" type="number" value={form.compareAtPrice as string} onChange={(v) => set("compareAtPrice", v)} />
              <AdminInput label="Stock" type="number" value={form.stock as string} onChange={(v) => set("stock", v)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label="Size (ml)" type="number" value={form.size as string} onChange={(v) => set("size", v)} />
              <AdminSelect label="Concentration" value={form.concentration as string} onChange={(v) => set("concentration", v)} options={["Eau de Parfum", "Extrait de Parfum", "Eau de Toilette"].map((c) => ({ value: c, label: c }))} />
              <AdminSelect label="Gender" value={form.gender as string} onChange={(v) => set("gender", v)} options={["Unisex", "Feminine", "Masculine"].map((g) => ({ value: g, label: g }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label="Top Notes" value={form.topNotes as string} onChange={(v) => set("topNotes", v)} placeholder="Saffron, Bergamot" />
              <AdminInput label="Heart Notes" value={form.heartNotes as string} onChange={(v) => set("heartNotes", v)} placeholder="Oud, Rose" />
              <AdminInput label="Base Notes" value={form.baseNotes as string} onChange={(v) => set("baseNotes", v)} placeholder="Amber, Musk" />
            </div>
            <AdminInput label="Image Path(s) — comma separated" value={form.images as string} onChange={(v) => set("images", v)} placeholder="/images/products/future-oud.jpg" />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="SKU" value={form.sku as string} onChange={(v) => set("sku", v)} placeholder="SG-FUTUREOUD" />
              <AdminSelect label="Badge" value={form.badge as string} onChange={(v) => set("badge", v)} options={[{ value: "", label: "None" }, ...["New", "Bestseller", "Exclusive", "Premium"].map((b) => ({ value: b, label: b }))]} />
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              {([["isTrending", "Trending"], ["isBestSeller", "Best Seller"], ["isNew", "New"], ["isExclusive", "Exclusive"], ["isArtisanal", "Artisanal"], ["isFeatured", "Featured"]] as const).map(([k, label]) => (
                <AdminToggle key={k} checked={form[k] as boolean} onChange={(v) => set(k, v)} label={label} />
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
              <AdminButton variant="outline" onClick={close}>Cancel</AdminButton>
              <AdminButton variant="amber" onClick={save} disabled={saving}>{saving ? "Saving..." : editing ? "Save Changes" : "Create Product"}</AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
