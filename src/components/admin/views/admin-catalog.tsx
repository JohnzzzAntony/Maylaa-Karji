"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, X, Package, FolderTree, Edit2, Layers, MessageSquare, Tag, AlertTriangle, Sliders, ChevronRight } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminImageInput } from "../admin-ui";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Sub-components
import { AdminCategories } from "./admin-categories";
import { AdminBulkEdit } from "./admin-bulk-edit";
import { AdminVariants } from "./admin-variants";
import { AdminReviews } from "./admin-reviews";
import { AdminBrands } from "./admin-brands";
import { AdminLowStock } from "./admin-low-stock";
import { AdminAttributes } from "./admin-attributes";

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
  variants: "[]",
};

type CatalogTab = "categories" | "products" | "bulk-edit" | "variants" | "reviews" | "manufacturers" | "low-stock" | "attributes";

const TABS: { id: CatalogTab; label: string; icon: any }[] = [
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "products", label: "Manage Products", icon: Package },
  { id: "bulk-edit", label: "Bulk Edit Products", icon: Edit2 },
  { id: "variants", label: "Bulk Edit Variants", icon: Layers },
  { id: "reviews", label: "Product Reviews", icon: MessageSquare },
  { id: "manufacturers", label: "Manufacturers (Brands)", icon: Tag },
  { id: "low-stock", label: "Low Stock Report", icon: AlertTriangle },
  { id: "attributes", label: "Attributes", icon: Sliders },
];

export function AdminCatalog() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("categories");

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row bg-stone-50">
      {/* Left Sub-Sidebar */}
      <aside className="w-full shrink-0 border-b border-stone-200 bg-white p-4 md:w-60 md:border-b-0 md:border-r md:p-5">
        <div className="mb-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <Package className="text-amber-600" size={18} />
            Catalog Setup
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
        {activeTab === "categories" && <AdminCategories />}
        {activeTab === "products" && <ManageProducts />}
        {activeTab === "bulk-edit" && <AdminBulkEdit />}
        {activeTab === "variants" && <AdminVariants />}
        {activeTab === "reviews" && <AdminReviews />}
        {activeTab === "manufacturers" && <AdminBrands />}
        {activeTab === "low-stock" && <AdminLowStock />}
        {activeTab === "attributes" && <AdminAttributes />}
      </div>
    </div>
  );
}

// Extract the original product list & management component
function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, string | boolean>>(EMPTY);
  const [saving, setSaving] = useState(false);
  
  // Custom states for bulk actions and SEO tab
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalTab, setModalTab] = useState<"details" | "seo" | "variants">("details");

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

  const openCreate = () => {
    setForm({
      ...EMPTY,
      metaTitle: "", metaDescription: "", metaKeywords: "", ogImage: "",
      variants: "[]",
    });
    setModalTab("details");
    setCreating(true);
  };
  
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, brandId: p.brand?.id ?? "", categoryId: p.category?.id ?? "", description: p.description,
      longDescription: p.longDescription, price: String(p.price), compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
      size: String(p.size), concentration: p.concentration, topNotes: p.topNotes, heartNotes: p.heartNotes, baseNotes: p.baseNotes,
      images: p.images.join(", "), stock: String(p.stock), sku: p.sku, badge: p.badge ?? "", gender: p.gender,
      isTrending: p.isTrending, isExclusive: p.isExclusive, isBestSeller: p.isBestSeller, isArtisanal: p.isArtisanal, isFeatured: p.isFeatured, isNew: p.isNew,
      metaTitle: (p as any).metaTitle ?? "",
      metaDescription: (p as any).metaDescription ?? "",
      metaKeywords: (p as any).metaKeywords ?? "",
      ogImage: (p as any).ogImage ?? "",
      variants: p.variants || "[]",
    });
    setModalTab("details");
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
      isTrending: !!form.isTrending,
      isExclusive: !!form.isExclusive,
      isBestSeller: !!form.isBestSeller,
      isArtisanal: !!form.isArtisanal,
      isFeatured: !!form.isFeatured,
      isNew: !!form.isNew,
      variants: form.variants,
    };
    try {
      const res = await fetch(`/api/admin/products`, {
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

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  // Bulk Delete Action
  const bulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) return;
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        toast.success("Selected products deleted");
        setSelectedIds([]);
        load();
      } else {
        toast.error("Failed to delete selected products");
      }
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  // Export products to JSON file
  const exportProducts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `karji_products_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Products exported successfully");
  };

  // CSV Simple Parser
  const parseCSV = (text: string) => {
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    return lines.slice(1).map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        const val = values[index] || "";
        if (val === "true") obj[header] = true;
        else if (val === "false") obj[header] = false;
        else if (!isNaN(Number(val)) && val !== "") obj[header] = Number(val);
        else obj[header] = val.replace(/^["']|["']$/g, "");
      });
      return obj;
    });
  };

  // Import products from file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        let productsToImport = [];
        if (file.name.endsWith(".json")) {
          productsToImport = JSON.parse(content);
        } else if (file.name.endsWith(".csv")) {
          productsToImport = parseCSV(content);
        } else {
          toast.error("Unsupported file format. Please upload a JSON or CSV file.");
          return;
        }

        if (!Array.isArray(productsToImport)) {
          toast.error("Invalid file structure. Expected a list/array of products.");
          return;
        }

        const res = await fetch("/api/admin/products/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: productsToImport }),
        });

        if (res.ok) {
          toast.success(`Successfully imported ${productsToImport.length} products`);
          load();
        } else {
          toast.error("Failed to import product catalog file");
        }
      } catch (err: any) {
        toast.error("Error reading import file: " + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = "";
  };

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Product Inventory</h2>
          <p className="text-xs text-stone-500">{products.length} products available</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <AdminButton variant="outline" size="sm" onClick={bulkDelete} className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 size={13} /> Bulk Delete Selected ({selectedIds.length})
            </AdminButton>
          )}
          
          <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50">
            <Layers size={13} />
            <span>Import Catalog</span>
            <input type="file" accept=".json,.csv" onChange={handleImport} className="hidden" />
          </label>

          <AdminButton variant="outline" size="sm" onClick={exportProducts}>
            <Sliders size={13} /> Export Catalog
          </AdminButton>
          
          <AdminButton variant="amber" size="sm" onClick={openCreate}>
            <Plus size={13} /> Add Product
          </AdminButton>
        </div>
      </div>

      {/* Search */}
      <AdminCard className="p-3">
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
          <AdminTable headers={[
            <input key="select-all" type="checkbox" checked={selectedIds.length === products.length && products.length > 0} onChange={toggleSelectAll} className="rounded border-stone-300 bg-white" />,
            "Product", "SKU", "Price", "Stock", "Badges", "Status", "Actions"
          ]}>
            {products.map((p) => (
              <tr key={p.id} className={cn("hover:bg-stone-50 transition", selectedIds.includes(p.id) && "bg-amber-50/20")}>
                <td className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded border-stone-300 bg-white" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={Array.isArray(p.images) && p.images[0] ? p.images[0] : "/images/products/future-oud.jpg"} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
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
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-white p-6">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">{editing ? "Edit Product" : "New Product"}</DialogTitle>
          
          {/* Modal Tab switcher */}
          <div className="flex border-b border-stone-200 mt-4 mb-4">
            <button
              onClick={() => setModalTab("details")}
              className={cn(
                "px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition",
                modalTab === "details" ? "border-amber-600 text-amber-600" : "border-transparent text-stone-500 hover:text-stone-900"
              )}
            >
              Product Details
            </button>
            <button
              onClick={() => setModalTab("seo")}
              className={cn(
                "px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition",
                modalTab === "seo" ? "border-amber-600 text-amber-600" : "border-transparent text-stone-500 hover:text-stone-900"
              )}
            >
              SEO & Search Engines
            </button>
            <button
              onClick={() => setModalTab("variants")}
              className={cn(
                "px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition",
                modalTab === "variants" ? "border-amber-600 text-amber-600" : "border-transparent text-stone-500 hover:text-stone-900"
              )}
            >
              Variants
            </button>
          </div>

          <div className="space-y-4">
            {modalTab === "details" ? (
              <>
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
                <AdminImageInput
                  label="Product Image"
                  value={form.images as string}
                  onChange={(v) => set("images", v)}
                  recommendedSize="800px X 800px"
                  helperText="[.jpg, .jpeg, .png, .gif Only]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <AdminInput label="SKU" value={form.sku as string} onChange={(v) => set("sku", v)} placeholder="SG-FUTUREOUD" />
                  <AdminSelect label="Badge" value={form.badge as string} onChange={(v) => set("badge", v)} options={[{ value: "", label: "None" }, ...["New", "Bestseller", "Exclusive", "Premium"].map((b) => ({ value: b, label: b }))]} />
                </div>
                <div className="grid grid-cols-3 gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
                  {([["isTrending", "Trending"], ["isBestSeller", "Best Seller"], ["isNew", "New"], ["isExclusive", "Exclusive"], ["isArtisanal", "Artisanal"], ["isFeatured", "Featured"]] as const).map(([k, label]) => (
                    <AdminToggle key={k} checked={form[k] as boolean} onChange={(v) => set(k, v)} label={label} />
                  ))}
                </div>
              </>
            ) : modalTab === "seo" ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 mb-2 text-xs text-amber-800 space-y-1">
                  <p className="font-semibold">Search Engine Optimization (SEO)</p>
                  <p>Configure how this fragrance appears in search results on Google, Bing, and other search engines.</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>Meta Title</span>
                    <span>{(form.metaTitle as string || "").length}/60 chars</span>
                  </div>
                  <AdminInput value={form.metaTitle as string} onChange={(v) => set("metaTitle", v)} placeholder="Custom title tag for search results..." />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>Meta Description</span>
                    <span>{(form.metaDescription as string || "").length}/160 chars</span>
                  </div>
                  <AdminTextarea value={form.metaDescription as string} onChange={(v) => set("metaDescription", v)} placeholder="Custom meta description for snippet..." rows={3} />
                </div>
                <AdminInput label="Meta Keywords" value={form.metaKeywords as string} onChange={(v) => set("metaKeywords", v)} placeholder="fragrance, oud, karji, luxury (comma separated)..." />
                <AdminImageInput
                  label="OG OpenGraph Image"
                  value={form.ogImage as string}
                  onChange={(v) => set("ogImage", v)}
                  recommendedSize="1200px X 630px"
                  helperText="Image for social sharing preview."
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 mb-2 text-xs text-amber-800 space-y-1">
                  <p className="font-semibold">Product Variants</p>
                  <p>Define variations like different sizes (e.g. 50ml, 100ml) with their own price, SKU, and stock. Must be valid JSON array.</p>
                </div>
                <AdminTextarea
                  label="Variants JSON"
                  value={form.variants as string}
                  onChange={(v) => set("variants", v)}
                  rows={8}
                  placeholder={`[\n  {\n    "name": "50ml",\n    "price": 450,\n    "compareAtPrice": 500,\n    "sku": "SG-FUTURE-50",\n    "stock": 10\n  }\n]`}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
              <AdminButton variant="outline" onClick={close}>Cancel</AdminButton>
              <AdminButton variant="amber" onClick={save} disabled={saving}>{saving ? "Saving..." : editing ? "Save Changes" : "Create Product"}</AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
