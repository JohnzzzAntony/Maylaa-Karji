"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminToggle, AdminImageInput } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Location = {
  id: string; name: string; image: string | null; address: string; city: string;
  phone: string | null; mapsUrl: string | null; isActive: boolean; sortOrder: number;
};

const EMPTY = { name: "", image: "", address: "", city: "", phone: "", mapsUrl: "", isActive: true, sortOrder: 0 };

export function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  const load = useCallback(() => {
    fetch("/api/admin/locations").then((r) => r.json()).then((d) => setLocations(d.locations || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (l: Location) => {
    setForm({ name: l.name, image: l.image ?? "", address: l.address, city: l.city, phone: l.phone ?? "", mapsUrl: l.mapsUrl ?? "", isActive: l.isActive, sortOrder: l.sortOrder });
    setEditing(l);
    setOpen(true);
  };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.name || !form.address || !form.city) { toast.error("Name, address, and city are required"); return; }
    const res = await fetch("/api/admin/locations", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    if (res.ok) { toast.success(editing ? "Location updated" : "Location created"); close(); load(); }
    else { const err = await res.json(); toast.error(err.error || "Save failed"); }
  };

  const del = async (l: Location) => {
    if (!confirm(`Delete "${l.name}"?`)) return;
    await fetch(`/api/admin/locations?id=${l.id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminPage
      title="Store Locations"
      subtitle="Manage physical store locations shown on the website"
      action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Location</AdminButton>}
    >
      <AdminCard>
        {locations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <MapPin size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No store locations yet</p>
          </div>
        ) : (
          <AdminTable headers={["Store", "City", "Phone", "Maps", "Order", "Status", "Actions"]}>
            {locations.map((l) => (
              <tr key={l.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {l.image ? (
                      <img src={l.image} alt={l.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-stone-100 grid place-items-center">
                        <MapPin size={18} className="text-stone-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-stone-900">{l.name}</p>
                      <p className="text-xs text-stone-500 line-clamp-1">{l.address}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{l.city}</td>
                <td className="px-4 py-3 text-xs text-stone-500">{l.phone || "—"}</td>
                <td className="px-4 py-3">
                  {l.mapsUrl ? (
                    <a href={l.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline">View Map</a>
                  ) : <span className="text-xs text-stone-400">—</span>}
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">{l.sortOrder}</td>
                <td className="px-4 py-3"><AdminBadge color={l.isActive ? "green" : "stone"}>{l.isActive ? "Active" : "Inactive"}</AdminBadge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(l)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                    <button onClick={() => del(l)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">
            {editing ? "Edit Location" : "New Store Location"}
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Store Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Dubai Mall Store" />
            <AdminImageInput label="Store Image URL" value={form.image} onChange={(v) => set("image", v)} helperText="Recommended: 600x400px." />
            <AdminInput label="Address *" value={form.address} onChange={(v) => set("address", v)} placeholder="Level 2, Dubai Mall, Downtown Dubai" />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="City *" value={form.city} onChange={(v) => set("city", v)} placeholder="Dubai" />
              <AdminInput label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+971 4 XXX XXXX" />
            </div>
            <AdminInput label="Google Maps URL" value={form.mapsUrl} onChange={(v) => set("mapsUrl", v)} placeholder="https://maps.google.com/..." />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Sort Order" type="number" value={String(form.sortOrder)} onChange={(v) => set("sortOrder", Number(v))} />
              <div className="flex items-end pb-2"><AdminToggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Active" /></div>
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
