"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Sliders } from "lucide-react";
import { AdminCard, AdminButton, AdminTable, AdminInput, AdminTextarea } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Attribute = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export function AdminAttributes() {
  const [activeTab, setActiveTab] = useState<"product" | "specification">("product");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Attribute | null>(null);
  
  // Form state
  const [form, setForm] = useState({ name: "", description: "" });

  const load = useCallback(() => {
    setLoading(true);
    const endpoint = activeTab === "product" ? "/api/admin/attributes/product" : "/api/admin/attributes/spec";
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => {
        setAttributes(d.attributes || []);
        setLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({ name: "", description: "" });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (a: Attribute) => {
    setForm({ name: a.name, description: a.description || "" });
    setEditing(a);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm({ name: "", description: "" });
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const endpoint = activeTab === "product" ? "/api/admin/attributes/product" : "/api/admin/attributes/spec";
    const res = await fetch(endpoint, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    if (res.ok) {
      toast.success(editing ? "Attribute updated" : "Attribute created");
      close();
      load();
    } else {
      toast.error("Save failed");
    }
  };

  const del = async (a: Attribute) => {
    if (!confirm(`Delete attribute "${a.name}"?`)) return;
    const endpoint = activeTab === "product" ? `/api/admin/attributes/product?id=${a.id}` : `/api/admin/attributes/spec?id=${a.id}`;
    const res = await fetch(endpoint, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      load();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("product")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "product"
              ? "border-b-2 border-amber-600 text-amber-600 font-bold"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Product Attributes
        </button>
        <button
          onClick={() => setActiveTab("specification")}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === "specification"
              ? "border-b-2 border-amber-600 text-amber-600 font-bold"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Specification Attributes
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {activeTab === "product"
            ? "Manage product variant configurations (e.g. Size, Color, Bottle Type)."
            : "Manage descriptive features (e.g. Concentration, Scent Type, Origin, Longevity)."}
        </span>
        <AdminButton variant="amber" size="sm" onClick={openCreate}><Plus size={13} /> Add Attribute</AdminButton>
      </div>

      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading attributes...</div>
        ) : attributes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Sliders size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No attributes found</p>
          </div>
        ) : (
          <AdminTable headers={["Attribute Name", "Description", "Date Created", "Actions"]}>
            {attributes.map((a) => (
              <tr key={a.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-semibold text-stone-900">{a.name}</td>
                <td className="px-4 py-3 text-sm text-stone-600">{a.description || "—"}</td>
                <td className="px-4 py-3 text-xs text-stone-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(a)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                    <button onClick={() => del(a)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
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
            {editing ? "Edit Attribute" : "Add Attribute"}
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput
              label="Attribute Name *"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder={activeTab === "product" ? "e.g. Volume" : "e.g. Fragrance Concentration"}
            />
            <AdminTextarea
              label="Description / Help text"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              rows={3}
              placeholder="Provide context for storefront display..."
            />

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
