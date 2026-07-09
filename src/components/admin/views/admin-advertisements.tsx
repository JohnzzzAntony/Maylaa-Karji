"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminInput, AdminSelect, AdminToggle, AdminImageInput } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Ad = { id: string; title: string; image: string; link: string; placement: string; isActive: boolean; clicks: number };
const EMPTY = { title: "", image: "/images/categories/oud.jpg", link: "#", placement: "sidebar", isActive: true };

export function AdminAdvertisements() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(EMPTY);

  const load = useCallback(() => { fetch("/api/admin/advertisements").then((r) => r.json()).then((d) => setAds(d.ads || [])); }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (a: Ad) => { setForm(a); setEditing(a); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const res = await fetch("/api/admin/advertisements", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
    if (res.ok) { toast.success("Saved"); close(); load(); }
  };
  const del = async (a: Ad) => { if (!confirm(`Delete "${a.title}"?`)) return; await fetch(`/api/admin/advertisements?id=${a.id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminPage title="Advertisements" subtitle="Manage sidebar, inline, and popup ads" action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Ad</AdminButton>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map((a) => (
          <AdminCard key={a.id} className="overflow-hidden">
            <div className="relative aspect-video bg-stone-100">
              <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex gap-1">
                <AdminBadge color={a.isActive ? "green" : "stone"}>{a.isActive ? "Active" : "Inactive"}</AdminBadge>
                <AdminBadge color="blue">{a.placement}</AdminBadge>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-stone-900">{a.title}</p>
              <p className="text-xs text-stone-500">{a.clicks} clicks · {a.link}</p>
              <div className="mt-2 flex justify-end gap-1">
                <button onClick={() => openEdit(a)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                <button onClick={() => del(a)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
              </div>
            </div>
          </AdminCard>
        ))}
        {ads.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-stone-300 p-12 text-center">
            <Megaphone size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No advertisements yet</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">{editing ? "Edit Advertisement" : "New Advertisement"}</DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Title" value={form.title as string} onChange={(v) => set("title", v)} />
            <AdminImageInput
              label="Ad Image File"
              value={form.image as string}
              onChange={(v) => set("image", v)}
              recommendedSize="800px X 450px"
              helperText="[.jpg, .jpeg, .png, .gif Only]"
            />
            <AdminInput label="Link" value={form.link as string} onChange={(v) => set("link", v)} />
            <AdminSelect label="Placement" value={form.placement as string} onChange={(v) => set("placement", v)} options={["sidebar", "inline", "popup"].map((p) => ({ value: p, label: p }))} />
            <AdminToggle checked={form.isActive as boolean} onChange={(v) => set("isActive", v)} label="Active" />
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
