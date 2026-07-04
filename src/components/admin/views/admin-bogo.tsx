"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Gift } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminTextarea, AdminToggle } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Offer = { id: string; title: string; description: string; buyQty: number; getQty: number; discountPct: number; isActive: boolean; endsAt: string | null };
const EMPTY = { title: "", description: "", buyQty: 1, getQty: 1, discountPct: 100, isActive: true, endsAt: "" };

export function AdminBogo() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(EMPTY);

  const load = useCallback(() => { fetch("/api/admin/bogo").then((r) => r.json()).then((d) => setOffers(d.offers || [])); }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (o: Offer) => { setForm({ ...o, endsAt: o.endsAt ? o.endsAt.slice(0, 10) : "" }); setEditing(o); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const res = await fetch("/api/admin/bogo", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
    if (res.ok) { toast.success("Saved"); close(); load(); }
  };
  const del = async (o: Offer) => { if (!confirm(`Delete "${o.title}"?`)) return; await fetch(`/api/admin/bogo?id=${o.id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminPage title="BOGO Offers" subtitle="Buy-One-Get-One and bundle promotions" action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Offer</AdminButton>}>
      <AdminCard>
        {offers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Gift size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No BOGO offers yet</p>
          </div>
        ) : (
          <AdminTable headers={["Offer", "Buy / Get", "Discount", "Status", "Ends", "Actions"]}>
            {offers.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{o.title}</p>
                  <p className="text-xs text-stone-500">{o.description}</p>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">Buy {o.buyQty} → Get {o.getQty}</td>
                <td className="px-4 py-3"><AdminBadge color="amber">{o.discountPct}% off</AdminBadge></td>
                <td className="px-4 py-3"><AdminBadge color={o.isActive ? "green" : "stone"}>{o.isActive ? "Active" : "Inactive"}</AdminBadge></td>
                <td className="px-4 py-3 text-xs text-stone-500">{o.endsAt ? new Date(o.endsAt).toLocaleDateString() : "No end"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(o)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                    <button onClick={() => del(o)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">{editing ? "Edit BOGO Offer" : "New BOGO Offer"}</DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Title" value={form.title as string} onChange={(v) => set("title", v)} />
            <AdminTextarea label="Description" value={form.description as string} onChange={(v) => set("description", v)} rows={2} />
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label="Buy Qty" type="number" value={String(form.buyQty)} onChange={(v) => set("buyQty", Number(v))} />
              <AdminInput label="Get Qty" type="number" value={String(form.getQty)} onChange={(v) => set("getQty", Number(v))} />
              <AdminInput label="Discount %" type="number" value={String(form.discountPct)} onChange={(v) => set("discountPct", Number(v))} />
            </div>
            <AdminInput label="Ends At (optional)" type="date" value={form.endsAt as string} onChange={(v) => set("endsAt", v)} />
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
