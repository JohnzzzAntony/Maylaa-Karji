"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Gift, ChevronLeft, X } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable } from "../admin-ui";
import { toast } from "sonner";

type Offer = {
  id: string;
  title: string;
  description: string;
  buyQty: number;
  getQty: number;
  discountPct: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string | null;
  maxQty: number;
  isCrossProduct: boolean;
  productIds: string;
  buyProductIds: string;
  getProductIds: string;
};

const EMPTY = {
  title: "",
  description: "",
  buyQty: 1,
  getQty: 1,
  discountPct: 100,
  isActive: true,
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: "",
  maxQty: 0,
  isCrossProduct: false,
  productIds: [] as string[],
  buyProductIds: [] as string[],
  getProductIds: [] as string[],
};

export function AdminBogo() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  // View State: "list" | "create" | "edit"
  const [viewState, setViewState] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<Record<string, any>>(EMPTY);

  // Filters State for Product Selection
  const [filterSku, setFilterSku] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/bogo").then((r) => r.json()).then((d) => setOffers(d.offers || []));
  }, []);

  const loadProductsData = useCallback(() => {
    fetch("/api/admin/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
    fetch("/api/brands").then((r) => r.json()).then((d) => setBrands(d.brands || []));
  }, []);

  useEffect(() => {
    load();
    loadProductsData();
  }, [load, loadProductsData]);

  const openCreate = () => {
    setForm(EMPTY);
    setEditingId(null);
    setViewState("create");
  };

  const openEdit = (o: Offer) => {
    let pIds: string[] = [];
    let bIds: string[] = [];
    let gIds: string[] = [];
    try { pIds = JSON.parse(o.productIds || "[]"); } catch {}
    try { bIds = JSON.parse(o.buyProductIds || "[]"); } catch {}
    try { gIds = JSON.parse(o.getProductIds || "[]"); } catch {}

    setForm({
      ...o,
      startsAt: o.startsAt ? o.startsAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      endsAt: o.endsAt ? o.endsAt.slice(0, 10) : "",
      productIds: pIds,
      buyProductIds: bIds,
      getProductIds: gIds,
    });
    setEditingId(o.id);
    setViewState("edit");
  };

  const close = () => {
    setViewState("list");
    setEditingId(null);
    setForm(EMPTY);
    setFilterSku("");
    setFilterCat("");
    setFilterBrand("");
  };

  const save = async () => {
    const payload = {
      ...form,
      title: form.description?.slice(0, 40) || "BOGO Offer",
    };
    const isEdit = viewState === "edit";
    const res = await fetch("/api/admin/bogo", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { id: editingId, ...payload } : payload),
    });
    if (res.ok) {
      toast.success(isEdit ? "BOGO offer updated" : "BOGO offer created");
      close();
      load();
    } else {
      toast.error("Save failed");
    }
  };

  const del = async (o: Offer) => {
    if (!confirm(`Delete BOGO offer "${o.title}"?`)) return;
    await fetch(`/api/admin/bogo?id=${o.id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const clearFilters = () => {
    setFilterSku("");
    setFilterCat("");
    setFilterBrand("");
  };

  // Filtered products list to select from
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSku = !filterSku || p.sku.toLowerCase().includes(filterSku.toLowerCase());
      const matchCat = !filterCat || p.categoryId === filterCat;
      const matchBrand = !filterBrand || p.brandId === filterBrand;
      return matchSku && matchCat && matchBrand;
    });
  }, [products, filterSku, filterCat, filterBrand]);

  const toggleProductId = (id: string, field: "productIds" | "buyProductIds" | "getProductIds") => {
    const current = form[field] || [];
    const updated = current.includes(id) ? current.filter((x: string) => x !== id) : [...current, id];
    set(field, updated);
  };

  if (viewState === "list") {
    return (
      <AdminPage
        title="BOGO Offers"
        subtitle="Buy-One-Get-One and bundle promotions"
        action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Offer</AdminButton>}
      >
        <AdminCard>
          {offers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <Gift size={32} className="text-stone-300" />
              <p className="text-sm text-stone-500">No BOGO offers yet</p>
            </div>
          ) : (
            <AdminTable headers={["Offer", "Rules", "Target Products", "Start / End Date", "Status", "Actions"]}>
              {offers.map((o) => {
                let pIds: string[] = [];
                let bIds: string[] = [];
                let gIds: string[] = [];
                try { pIds = JSON.parse(o.productIds || "[]"); } catch {}
                try { bIds = JSON.parse(o.buyProductIds || "[]"); } catch {}
                try { gIds = JSON.parse(o.getProductIds || "[]"); } catch {}

                const productCount = o.isCrossProduct ? bIds.length + gIds.length : pIds.length;

                return (
                  <tr key={o.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{o.title}</p>
                      <p className="text-xs text-stone-500">{o.description}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">
                      <div>Buy {o.buyQty} &rarr; Get {o.getQty}</div>
                      {o.isCrossProduct && <div className="text-[10px] text-amber-600 font-semibold uppercase">Cross Product</div>}
                      {o.maxQty > 0 && <div className="text-xs text-stone-400">Max limit: {o.maxQty}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500">
                      {productCount === 0 ? "All Products" : `${productCount} products selected`}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500">
                      <div>Start: {new Date(o.startsAt).toLocaleDateString()}</div>
                      <div>End: {o.endsAt ? new Date(o.endsAt).toLocaleDateString() : "Never"}</div>
                    </td>
                    <td className="px-4 py-3"><AdminBadge color={o.isActive ? "green" : "stone"}>{o.isActive ? "Active" : "Inactive"}</AdminBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(o)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                        <button onClick={() => del(o)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          )}
        </AdminCard>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={viewState === "create" ? "Add New BOGO Offer" : "Edit BOGO Offer"}
      subtitle="Configure promotion rules and product matching"
      action={
        <button
          onClick={close}
          className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50"
        >
          <ChevronLeft size={14} /> Back to List
        </button>
      }
    >
      <AdminCard className="p-8 max-w-4xl mx-auto bg-white">
        <div className="space-y-6">
          {/* Description Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600">Description</span>
            <div className="md:w-3/4">
              <input
                type="text"
                value={form.description as string}
                onChange={(e) => set("description", e.target.value)}
                placeholder="e.g. Buy 1 Oud Royale, Get 1 Jasmine Supreme Free"
                className="w-full rounded border border-stone-350 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Buy Quantity Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600">Buy Quantity</span>
            <div className="md:w-3/4">
              <input
                type="number"
                value={String(form.buyQty)}
                onChange={(e) => set("buyQty", Math.max(1, Number(e.target.value)))}
                className="w-full rounded border border-stone-350 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Get Quantity Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600">Get Quantity</span>
            <div className="md:w-3/4">
              <input
                type="number"
                value={String(form.getQty)}
                onChange={(e) => set("getQty", Math.max(1, Number(e.target.value)))}
                className="w-full rounded border border-stone-350 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Selected Product Ids Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600 pt-2">Selected Product Ids</span>
            <div className="md:w-3/4 space-y-3">
              {/* Product selection filters box */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end rounded-lg border border-stone-200 bg-stone-50/50 p-3">
                <div>
                  <span className="mb-0.5 block text-[10px] font-medium text-stone-500">Filter by SKU</span>
                  <input
                    value={filterSku}
                    onChange={(e) => setFilterSku(e.target.value)}
                    placeholder="Type SKU..."
                    className="w-full rounded bg-white border border-stone-300 px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] font-medium text-stone-500">Filter by category</span>
                  <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="w-full rounded bg-white border border-stone-300 px-2 py-1.5 text-xs outline-none focus:border-amber-500"
                  >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] font-medium text-stone-500">Filter by manufacturer</span>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full rounded bg-white border border-stone-300 px-2 py-1.5 text-xs outline-none focus:border-amber-500"
                  >
                    <option value="">All manufacturers</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full rounded border border-stone-300 bg-white py-1.5 text-xs text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition font-semibold"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Product checklists */}
              {form.isCrossProduct ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-600">1. Buy Products (Required)</label>
                    <div className="h-48 overflow-y-auto rounded border border-stone-250 bg-white p-1">
                      {filteredProducts.map((p) => (
                        <label key={p.id} className="flex cursor-pointer items-center gap-2 border-b border-stone-100 px-2 py-1.5 text-xs hover:bg-amber-50/50 last:border-0">
                          <input
                            type="checkbox"
                            checked={(form.buyProductIds || []).includes(p.id)}
                            onChange={() => toggleProductId(p.id, "buyProductIds")}
                            className="rounded accent-amber-600"
                          />
                          <span className="text-stone-700 font-medium">{p.name} ({p.sku})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-600">2. Get Products (Free/Promo)</label>
                    <div className="h-48 overflow-y-auto rounded border border-stone-250 bg-white p-1">
                      {filteredProducts.map((p) => (
                        <label key={p.id} className="flex cursor-pointer items-center gap-2 border-b border-stone-100 px-2 py-1.5 text-xs hover:bg-amber-50/50 last:border-0">
                          <input
                            type="checkbox"
                            checked={(form.getProductIds || []).includes(p.id)}
                            onChange={() => toggleProductId(p.id, "getProductIds")}
                            className="rounded accent-amber-600"
                          />
                          <span className="text-stone-700 font-medium">{p.name} ({p.sku})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 overflow-y-auto rounded border border-stone-250 bg-white p-1">
                  {filteredProducts.map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-center gap-2 border-b border-stone-100 px-2 py-1.5 text-xs hover:bg-amber-50/50 last:border-0">
                      <input
                        type="checkbox"
                        checked={(form.productIds || []).includes(p.id)}
                        onChange={() => toggleProductId(p.id, "productIds")}
                        className="rounded accent-amber-600"
                      />
                      <span className="text-stone-700 font-medium">{p.name} ({p.sku})</span>
                    </label>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-stone-400 italic">
                Filtering only affects the visible list. Your selected products remain selected.
              </p>
            </div>
          </div>

          {/* Max Quantity Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600">Max Quantity</span>
            <div className="md:w-3/4">
              <input
                type="number"
                value={String(form.maxQty)}
                onChange={(e) => set("maxQty", Number(e.target.value))}
                className="w-full rounded border border-stone-350 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Is Cross Product Row */}
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600 pt-1">Is Cross Product</span>
            <div className="md:w-3/4">
              <label className="flex cursor-pointer items-center gap-2">
                <button
                  type="button"
                  onClick={() => set("isCrossProduct", !form.isCrossProduct)}
                  className={`relative h-6 w-11 rounded-full transition ${form.isCrossProduct ? "bg-amber-600" : "bg-stone-300"}`}
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition"
                    style={{ left: form.isCrossProduct ? "1.375rem" : "0.125rem" }}
                  />
                </button>
              </label>
              <p className="text-xs text-stone-400 mt-1">
                Check this if you want to offer a different product for free (e.g., Buy Shirt, Get Tie Free)
              </p>
            </div>
          </div>

          {/* Start Date Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600">Start Date</span>
            <div className="md:w-3/4 relative">
              <input
                type="date"
                value={form.startsAt as string}
                onChange={(e) => set("startsAt", e.target.value)}
                className="w-full rounded border border-stone-350 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* End Date Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="md:w-1/4 md:text-right text-sm font-medium text-stone-600">End Date</span>
            <div className="md:w-3/4 relative">
              <input
                type="date"
                value={form.endsAt as string}
                onChange={(e) => set("endsAt", e.target.value)}
                className="w-full rounded border border-stone-350 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex justify-end gap-2 border-t border-stone-100 pt-4 md:w-3/4 md:ml-auto">
            <button
              onClick={close}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="flex items-center gap-1.5 rounded-lg bg-stone-950 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-white hover:bg-stone-800 transition"
            >
              <Plus size={15} /> {viewState === "create" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </AdminCard>
    </AdminPage>
  );
}
