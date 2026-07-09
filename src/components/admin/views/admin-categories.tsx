"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, FolderTree, ChevronRight, Sliders, Check, Settings, ShoppingBag, Info, Globe, AlertCircle } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminImageInput } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  displayOrder: number;
  showOnHomepage: boolean;
  children?: Category[];
};

const EMPTY = {
  name: "",
  topDescription: "",
  completeName: "",
  bannerImage: "",
  metaTitle: "",
  metaKeywords: "",
  metaDescription: "",
  published: true,
  image: "",
  parentId: "",
  displayOrder: 0,
  showOnHomepage: false,
};

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  
  // Tab State: "info" | "seo" | "products"
  const [formTab, setFormTab] = useState<"info" | "seo" | "products">("info");
  
  // Language Sub-tab State
  const [langTab, setLangTab] = useState<"standard" | "en" | "ar">("standard");

  // Form state
  const [form, setForm] = useState<Record<string, any>>(EMPTY);

  // Attributes states
  const [attrCat, setAttrCat] = useState<Category | null>(null);
  const [attrOpen, setAttrOpen] = useState(false);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [editingAttr, setEditingAttr] = useState<any | null>(null);
  const [attrForm, setAttrForm] = useState({ name: "", type: "text", options: "", isRequired: false, sortOrder: 0 });

  const load = useCallback(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
      
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Flat list for parent selector (root categories only)
  const rootCats = categories.filter((c) => !c.parentId);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setFormTab("info");
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    let meta = { topDescription: "", completeName: "", bannerImage: "", metaTitle: "", metaKeywords: "", metaDescription: "", published: true };
    try {
      meta = JSON.parse(c.description);
    } catch {
      meta.topDescription = c.description;
    }
    
    setForm({
      name: c.name,
      topDescription: meta.topDescription || "",
      completeName: meta.completeName || "",
      bannerImage: meta.bannerImage || "",
      metaTitle: meta.metaTitle || "",
      metaKeywords: meta.metaKeywords || "",
      metaDescription: meta.metaDescription || "",
      published: meta.published !== undefined ? meta.published : true,
      image: c.image || "",
      parentId: c.parentId ?? "",
      displayOrder: c.displayOrder,
      showOnHomepage: c.showOnHomepage,
    });
    setEditing(c);
    setFormTab("info");
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const save = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    
    const descriptionPayload = JSON.stringify({
      topDescription: form.topDescription || "",
      completeName: form.completeName || "",
      bannerImage: form.bannerImage || "",
      metaTitle: form.metaTitle || "",
      metaKeywords: form.metaKeywords || "",
      metaDescription: form.metaDescription || "",
      published: form.published,
    });

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: descriptionPayload,
      image: form.image,
      parentId: form.parentId || null,
      displayOrder: Number(form.displayOrder) || 0,
      showOnHomepage: !!form.showOnHomepage,
    };

    const res = await fetch("/api/admin/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
    });
    if (res.ok) {
      toast.success(editing ? "Category updated" : "Category created");
      close();
      load();
    } else {
      const err = await res.json();
      toast.error(err.error || "Save failed");
    }
  };

  const del = async (c: Category) => {
    if (!confirm(`Delete "${c.name}"? All products in this category may be affected.`)) return;
    const res = await fetch(`/api/admin/categories?id=${c.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); }
    else toast.error("Cannot delete — category may have products");
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  // Attribute Actions
  const loadAttributes = useCallback(async (catId: string) => {
    try {
      const res = await fetch(`/api/admin/attributes?categoryId=${catId}`);
      if (res.ok) {
        const d = await res.json();
        setAttributes(d.attributes || []);
      }
    } catch (e) {
      toast.error("Failed to load attributes");
    }
  }, []);

  const openAttributes = (c: Category) => {
    setAttrCat(c);
    setAttrForm({ name: "", type: "text", options: "", isRequired: false, sortOrder: 0 });
    setEditingAttr(null);
    loadAttributes(c.id);
    setAttrOpen(true);
  };

  const closeAttr = () => {
    setAttrOpen(false);
    setAttrCat(null);
    setAttributes([]);
  };

  const startEditAttr = (attr: any) => {
    setEditingAttr(attr);
    setAttrForm({
      name: attr.name,
      type: attr.type,
      options: Array.isArray(attr.options) ? attr.options.join(", ") : attr.options || "",
      isRequired: attr.isRequired,
      sortOrder: attr.sortOrder,
    });
  };

  const cancelEditAttr = () => {
    setEditingAttr(null);
    setAttrForm({ name: "", type: "text", options: "", isRequired: false, sortOrder: 0 });
  };

  const saveAttribute = async () => {
    if (!attrCat) return;
    if (!attrForm.name) { toast.error("Attribute name required"); return; }

    const payload = {
      categoryId: attrCat.id,
      name: attrForm.name,
      type: attrForm.type,
      options: ["dropdown", "multiselect"].includes(attrForm.type)
        ? attrForm.options.split(",").map(o => o.trim()).filter(Boolean)
        : [],
      isRequired: attrForm.isRequired,
      sortOrder: Number(attrForm.sortOrder) || 0,
    };

    try {
      const method = editingAttr ? "PUT" : "POST";
      const res = await fetch("/api/admin/attributes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAttr ? { id: editingAttr.id, ...payload } : payload),
      });

      if (res.ok) {
        toast.success(editingAttr ? "Attribute updated" : "Attribute created");
        cancelEditAttr();
        loadAttributes(attrCat.id);
      } else {
        const err = await res.json();
        toast.error(err.error || "Save failed");
      }
    } catch (e) {
      toast.error("Save failed");
    }
  };

  const deleteAttribute = async (attrId: string) => {
    if (!attrCat) return;
    if (!confirm("Are you sure you want to delete this attribute?")) return;
    try {
      const res = await fetch(`/api/admin/attributes?id=${attrId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Attribute deleted");
        loadAttributes(attrCat.id);
      } else {
        toast.error("Delete failed");
      }
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  // Associated products list
  const associatedProducts = products.filter(p => p.categoryId === editing?.id);

  // Render tree rows
  const renderRows = (cats: Category[], depth = 0): React.ReactNode[] =>
    cats.flatMap((c) => {
      let meta = { topDescription: "", completeName: "", published: true };
      try {
        meta = JSON.parse(c.description);
      } catch {
        meta.topDescription = c.description;
      }
      const displayDesc = meta.topDescription || c.description;

      return [
        <tr key={c.id} className="hover:bg-stone-50">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
              {depth > 0 && <ChevronRight size={12} className="text-stone-400 shrink-0" />}
              <div>
                <p className="font-medium text-stone-900">{c.name}</p>
                <p className="text-xs text-stone-400">/category/{c.slug}</p>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-xs text-stone-600 max-w-xs truncate">{displayDesc || "—"}</td>
          <td className="px-4 py-3 text-xs text-stone-500">{c.displayOrder}</td>
          <td className="px-4 py-3">
            <AdminBadge color={meta.published ? "green" : "stone"}>
              {meta.published ? "Published" : "Draft"}
            </AdminBadge>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <button onClick={() => openAttributes(c)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600" title="Options / Attributes"><Sliders size={14} /></button>
              <button onClick={() => openEdit(c)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600" title="Edit"><Pencil size={14} /></button>
              <button onClick={() => del(c)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600" title="Delete"><Trash2 size={14} /></button>
            </div>
          </td>
        </tr>,
        ...(c.children?.length ? renderRows(c.children, depth + 1) : []),
      ];
    });

  return (
    <AdminPage
      title="Categories"
      subtitle="Manage product categories and hierarchy"
      action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Category</AdminButton>}
    >
      <AdminCard>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <FolderTree size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No categories yet</p>
          </div>
        ) : (
          <AdminTable headers={["Category", "Description", "Order", "Status", "Actions"]}>
            {renderRows(rootCats)}
          </AdminTable>
        )}
      </AdminCard>

      {/* Premium Tabbed Category Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <DialogTitle className="font-serif text-lg font-bold text-stone-900">
              {editing ? "Edit Category Details" : "Add a new category"}
            </DialogTitle>
            <button onClick={close} className="text-stone-400 hover:text-stone-600 text-xs font-semibold">
              Close
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-[500px]">
            {/* Left Tabs Sidebar */}
            <aside className="w-48 shrink-0 border-r border-stone-200 bg-stone-50/50 p-3 flex flex-col gap-1">
              <button
                onClick={() => setFormTab("info")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition text-left",
                  formTab === "info" ? "bg-amber-600 text-white shadow-sm" : "text-stone-600 hover:bg-stone-100"
                )}
              >
                <Info size={13} />
                <span>Category Info</span>
              </button>
              <button
                onClick={() => setFormTab("seo")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition text-left",
                  formTab === "seo" ? "bg-amber-600 text-white shadow-sm" : "text-stone-600 hover:bg-stone-100"
                )}
              >
                <Globe size={13} />
                <span>Search engines (SEO)</span>
              </button>
              <button
                onClick={() => setFormTab("products")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition text-left",
                  formTab === "products" ? "bg-amber-600 text-white shadow-sm" : "text-stone-600 hover:bg-stone-100"
                )}
              >
                <ShoppingBag size={13} />
                <span>Products</span>
              </button>
            </aside>

            {/* Right Form Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
              {formTab === "info" && (
                <div className="space-y-5">
                  {/* Parent category */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Parent category</span>
                    <div className="md:w-2/3">
                      <select
                        value={form.parentId}
                        onChange={(e) => set("parentId", e.target.value)}
                        className="w-full rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                      >
                        <option value="">[Unspecified]</option>
                        {rootCats
                          .filter((c) => c.id !== editing?.id)
                          .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  {/* Display order */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Display order</span>
                    <div className="md:w-2/3">
                      <input
                        type="number"
                        value={String(form.displayOrder)}
                        onChange={(e) => set("displayOrder", Number(e.target.value))}
                        className="w-full rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Published */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Published</span>
                    <div className="md:w-2/3">
                      <button
                        type="button"
                        onClick={() => set("published", !form.published)}
                        className={`relative h-6 w-11 rounded-full transition ${form.published ? "bg-amber-600" : "bg-stone-300"}`}
                      >
                        <span
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                          style={{ left: form.published ? "1.375rem" : "0.125rem" }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Show on homepage */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Show on home page</span>
                    <div className="md:w-2/3">
                      <button
                        type="button"
                        onClick={() => set("showOnHomepage", !form.showOnHomepage)}
                        className={`relative h-6 w-11 rounded-full transition ${form.showOnHomepage ? "bg-amber-600" : "bg-stone-300"}`}
                      >
                        <span
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                          style={{ left: form.showOnHomepage ? "1.375rem" : "0.125rem" }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Category URL */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Category Url</span>
                    <div className="md:w-2/3">
                      <input
                        type="text"
                        disabled
                        value={`/category/${form.name ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "new-category"}`}
                        className="w-full rounded border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Language Tab Content */}
                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                    {/* Language Tabs bar */}
                    <div className="flex bg-stone-50 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wide">
                      <button
                        onClick={() => setLangTab("standard")}
                        className={cn(
                          "px-3 py-2 transition border-r border-stone-200",
                          langTab === "standard" ? "bg-white text-stone-900 border-t-2 border-t-amber-600" : "text-stone-500"
                        )}
                      >
                        Standard
                      </button>
                      <button onClick={() => setLangTab("en")} className="px-3 py-2 border-r border-stone-200 text-stone-400 flex items-center gap-1 cursor-not-allowed">
                        <span>🇬🇧 English</span>
                      </button>
                      <button onClick={() => setLangTab("ar")} className="px-3 py-2 border-r border-stone-200 text-stone-400 flex items-center gap-1 cursor-not-allowed">
                        <span>🇦🇪 Ar</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-4 bg-white">
                      {/* Name */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="sm:w-1/4 text-xs font-medium text-stone-600">Name</span>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          className="flex-1 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Complete name */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="sm:w-1/4 text-xs font-medium text-stone-600">Complete name</span>
                        <input
                          type="text"
                          value={form.completeName}
                          onChange={(e) => set("completeName", e.target.value)}
                          className="flex-1 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Top description */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <span className="sm:w-1/4 text-xs font-medium text-stone-600 pt-1">Top description</span>
                        <textarea
                          rows={3}
                          value={form.topDescription}
                          onChange={(e) => set("topDescription", e.target.value)}
                          placeholder="Click to edit HTML..."
                          className="flex-1 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Picture */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600 pt-1">Picture</span>
                    <div className="md:w-2/3">
                      <AdminImageInput
                        value={form.image}
                        onChange={(v) => set("image", v)}
                        recommendedSize="800px X 800px"
                        helperText="[.jpg, .jpeg, .png, .gif Only]"
                      />
                    </div>
                  </div>

                  {/* Banner Picture Id */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600 pt-1">Banner Picture Id</span>
                    <div className="md:w-2/3">
                      <AdminImageInput
                        value={form.bannerImage}
                        onChange={(v) => set("bannerImage", v)}
                        recommendedSize="580px X 460px"
                        helperText="[.jpg, .jpeg, .png, .gif Only]"
                      />
                    </div>
                  </div>

                  {/* Discounts */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Discounts</span>
                    <div className="md:w-2/3">
                      <select
                        className="w-full rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                      >
                        <option value="">Unspecified</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formTab === "seo" && (
                <div className="space-y-4">
                  {/* Meta Title */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Meta Title</span>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => set("metaTitle", e.target.value)}
                      className="md:w-2/3 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600">Meta Keywords</span>
                    <input
                      type="text"
                      value={form.metaKeywords}
                      onChange={(e) => set("metaKeywords", e.target.value)}
                      className="md:w-2/3 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <span className="md:w-1/3 md:text-right text-xs font-medium text-stone-600 pt-1">Meta Description</span>
                    <textarea
                      rows={3}
                      value={form.metaDescription}
                      onChange={(e) => set("metaDescription", e.target.value)}
                      className="md:w-2/3 rounded border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {formTab === "products" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">Associated Category Products</span>
                    <span className="text-xs text-stone-400">{associatedProducts.length} items</span>
                  </div>
                  {associatedProducts.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500">
                      No products are linked to this category yet. Update the product's category inside "Manage Products" to associate.
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto border border-stone-200 rounded-lg">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase">
                            <th className="px-3 py-2">Image</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Sku</th>
                            <th className="px-3 py-2">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white">
                          {associatedProducts.map(p => {
                            let imgs = ["/images/products/future-oud.jpg"];
                            try { imgs = JSON.parse(p.images); } catch {}
                            return (
                              <tr key={p.id}>
                                <td className="px-3 py-2"><img src={imgs[0]} alt={p.name} className="h-8 w-8 rounded object-cover" /></td>
                                <td className="px-3 py-2 font-medium text-stone-900">{p.name}</td>
                                <td className="px-3 py-2 font-mono text-stone-500">{p.sku}</td>
                                <td className="px-3 py-2 text-stone-600">{p.stock} units</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-stone-150 bg-stone-50/50 flex justify-end gap-2 shrink-0">
            <button
              onClick={close}
              className="rounded-lg border border-stone-350 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="rounded-lg bg-stone-950 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-stone-850 transition"
            >
              {editing ? "Save" : "Create"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attributes manage Dialog */}
      <Dialog open={attrOpen} onOpenChange={(v) => { if (!v) closeAttr(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-white p-6 overflow-y-auto">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">
            Manage Attributes for "{attrCat?.name}"
          </DialogTitle>
          <div className="mt-4 space-y-6">
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-600">
                {editingAttr ? "Edit Attribute / Option" : "Add Attribute / Option"}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="mb-1 block text-xs font-medium text-stone-600">Attribute Name *</span>
                    <input
                      type="text"
                      value={attrForm.name}
                      onChange={(e) => setAttrForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Size, Scent Family"
                      className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-700">Type</label>
                    <select
                      value={attrForm.type}
                      onChange={(e) => setAttrForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                    >
                      <option value="text">Text Input</option>
                      <option value="number">Number Input</option>
                      <option value="dropdown">Dropdown (Single Select)</option>
                      <option value="multiselect">Multi Select</option>
                      <option value="checkbox">Checkbox (Yes/No)</option>
                      <option value="color">Color Swatch</option>
                    </select>
                  </div>
                </div>

                {(attrForm.type === "dropdown" || attrForm.type === "multiselect") && (
                  <div>
                    <span className="mb-1 block text-xs font-medium text-stone-600 font-medium">Options (Comma separated)</span>
                    <input
                      type="text"
                      value={attrForm.options}
                      onChange={(e) => setAttrForm(f => ({ ...f, options: e.target.value }))}
                      placeholder="e.g. 50ml, 100ml, 200ml"
                      className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
                    />
                    <p className="mt-1 text-[10px] text-stone-400">Enter options separated by commas.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="mb-1 block text-xs font-medium text-stone-600">Display Order</span>
                    <input
                      type="number"
                      value={String(attrForm.sortOrder)}
                      onChange={(e) => setAttrForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                      className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="pt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAttrForm(f => ({ ...f, isRequired: !f.isRequired }))}
                      className={`relative h-6 w-11 rounded-full transition ${attrForm.isRequired ? "bg-amber-600" : "bg-stone-300"}`}
                    >
                      <span
                        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                        style={{ left: attrForm.isRequired ? "1.375rem" : "0.125rem" }}
                      />
                    </button>
                    <span className="text-sm text-stone-700">Required Field</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {editingAttr && (
                    <AdminButton variant="outline" onClick={cancelEditAttr}>Cancel Edit</AdminButton>
                  )}
                  <button
                    onClick={saveAttribute}
                    className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition"
                  >
                    {editingAttr ? "Update Attribute" : "Add Attribute"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-600 font-medium">
                Current Attributes
              </h3>
              {attributes.length === 0 ? (
                <p className="py-4 text-center text-xs text-stone-400">No attributes configured for this category yet.</p>
              ) : (
                <div className="max-h-60 overflow-y-auto rounded-lg border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Options</th>
                        <th className="px-3 py-2">Required</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {attributes.map((attr) => (
                        <tr key={attr.id} className="hover:bg-stone-50">
                          <td className="px-3 py-2 font-medium text-stone-900">{attr.name}</td>
                          <td className="px-3 py-2 capitalize text-stone-650">{attr.type}</td>
                          <td className="px-3 py-2 text-stone-500">
                            {Array.isArray(attr.options) && attr.options.length > 0 
                              ? attr.options.join(", ") 
                              : "—"
                            }
                          </td>
                          <td className="px-3 py-2">
                            <AdminBadge color={attr.isRequired ? "red" : "stone"}>
                              {attr.isRequired ? "Yes" : "No"}
                            </AdminBadge>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => startEditAttr(attr)}
                                className="grid h-6 w-6 place-items-center rounded text-stone-500 hover:bg-amber-50 hover:text-amber-600"
                                title="Edit"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => deleteAttribute(attr.id)}
                                className="grid h-6 w-6 place-items-center rounded text-stone-500 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-stone-100 pt-4">
              <button
                onClick={closeAttr}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
