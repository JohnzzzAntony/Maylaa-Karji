"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminInput, AdminSelect, AdminToggle, AdminImageInput } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Banner = { id: string; title: string; subtitle: string; image: string; mobileImage: string; link: string; position: string; isActive: boolean; sortOrder: number };
const EMPTY = { title: "", subtitle: "", image: "", mobileImage: "", link: "", position: "hero", isActive: true, sortOrder: 0 };

export function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(EMPTY);

  const load = useCallback(() => { fetch("/api/admin/banners").then((r) => r.json()).then((d) => setBanners(d.banners || [])); }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (b: Banner) => { setForm(b); setEditing(b); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.image) { toast.error("Desktop Image required"); return; }
    const res = await fetch("/api/admin/banners", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
    if (res.ok) { toast.success(editing ? "Banner updated" : "Banner created"); close(); load(); }
  };

  const del = async (b: Banner) => { if (!confirm(`Delete "${b.title || "Banner"}"?`)) return; await fetch(`/api/admin/banners?id=${b.id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminPage title="Banners" subtitle="Manage homepage hero and promotional banners" action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Banner</AdminButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((b) => (
          <AdminCard key={b.id} className="overflow-hidden">
            <div className="relative aspect-video bg-stone-100">
              <img src={b.image || "/images/hero/hero-main.jpg"} alt={b.title || "Banner"} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="font-serif text-lg font-semibold">{b.title || "Untitled Banner"}</p>
                {b.subtitle && <p className="text-xs opacity-80">{b.subtitle}</p>}
              </div>
              <div className="absolute right-2 top-2 flex gap-1">
                <AdminBadge color={b.isActive ? "green" : "stone"}>{b.isActive ? "Active" : "Inactive"}</AdminBadge>
                <AdminBadge color="amber">{b.position}</AdminBadge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-xs text-stone-500">Order: {b.sortOrder}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(b)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                <button onClick={() => del(b)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
              </div>
            </div>
          </AdminCard>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 p-12 text-center">
            <ImageIcon size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No banners yet</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white p-6">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">
            {editing ? "Edit Banner" : "Add New Banner"}
          </DialogTitle>
          <div className="mt-4 space-y-4">
            <AdminImageInput
              label="Upload Picture"
              value={form.image as string}
              onChange={(v) => set("image", v)}
              recommendedSize="1440px X 650px"
              helperText="[.jpg, .jpeg, .png, .gif Only]"
            />
            
            <AdminImageInput
              label="Upload Mobile Picture"
              value={form.mobileImage as string}
              onChange={(v) => set("mobileImage", v)}
              recommendedSize="767px X 400px"
              helperText="[.jpg, .jpeg, .png, .gif Only]"
            />

            <AdminInput
              label="Title"
              value={form.title as string}
              onChange={(v) => set("title", v)}
              placeholder="Click to edit HTML..."
            />

            <AdminInput
              label="Subtitle"
              value={form.subtitle as string}
              onChange={(v) => set("subtitle", v)}
              placeholder="e.g. 12% Off Storewide"
            />

            <div className="grid grid-cols-2 gap-4">
              <AdminInput
                label="URL"
                value={form.link as string}
                onChange={(v) => set("link", v)}
                placeholder="/shop"
              />
              <AdminSelect
                label="Position"
                value={form.position as string}
                onChange={(v) => set("position", v)}
                options={["hero", "mid", "footer"].map((p) => ({ value: p, label: p }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <AdminInput
                label="Display Order"
                type="number"
                value={String(form.sortOrder)}
                onChange={(v) => set("sortOrder", Number(v))}
              />
              <div className="pt-4">
                <AdminToggle
                  checked={form.isActive as boolean}
                  onChange={(v) => set("isActive", v)}
                  label="Show on Home page"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
              <AdminButton variant="outline" onClick={close}>Cancel</AdminButton>
              <AdminButton variant="amber" onClick={save}>
                {editing ? "Save" : "ADD"}
              </AdminButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
