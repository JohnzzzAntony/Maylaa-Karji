"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Tag, Copy } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminSelect, AdminToggle } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Promo = { id: string; title: string; code: string; type: string; value: number; minSpend: number; usageLimit: number; usedCount: number; isActive: boolean; endsAt: string | null };
const EMPTY = { title: "", code: "", type: "percent", value: 10, minSpend: 0, usageLimit: 100, isActive: true, endsAt: "" };

const TYPE_LABEL: Record<string, string> = { percent: "% Off", fixed: "Fixed Amount", shipping: "Free Shipping" };

export function AdminPromotions() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(EMPTY);

  const load = useCallback(() => { fetch("/api/admin/promotions").then((r) => r.json()).then((d) => setPromos(d.promos || [])); }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (p: Promo) => { setForm({ ...p, endsAt: p.endsAt ? p.endsAt.slice(0, 10) : "" }); setEditing(p); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title || !form.code) { toast.error("Title and code required"); return; }
    const res = await fetch("/api/admin/promotions", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
    if (res.ok) { toast.success("Saved"); close(); load(); }
  };
  const del = async (p: Promo) => { if (!confirm(`Delete "${p.title}"?`)) return; await fetch(`/api/admin/promotions?id=${p.id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast.success(`Copied ${code}`); };

  return (
    <AdminPage title="Promotions" subtitle="Discount codes and coupon management" action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Promo Code</AdminButton>}>
      <AdminCard>
        {promos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <Tag size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No promotions yet</p>
          </div>
        ) : (
          <AdminTable headers={["Promo", "Code", "Type", "Value", "Usage", "Status", "Actions"]}>
            {promos.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">{p.title}</td>
                <td className="px-4 py-3">
                  <button onClick={() => copyCode(p.code)} className="flex items-center gap-1.5 rounded-md bg-stone-900 px-2.5 py-1 font-mono text-xs font-semibold text-amber-400 transition hover:bg-stone-700">
                    {p.code} <Copy size={11} />
                  </button>
                </td>
                <td className="px-4 py-3"><AdminBadge color="blue">{TYPE_LABEL[p.type]}</AdminBadge></td>
                <td className="px-4 py-3 text-sm text-stone-600">{p.type === "percent" ? `${p.value}%` : p.type === "fixed" ? `Dhs. ${p.value}` : "—"}</td>
                <td className="px-4 py-3 text-xs text-stone-500">{p.usedCount} / {p.usageLimit} used</td>
                <td className="px-4 py-3"><AdminBadge color={p.isActive ? "green" : "stone"}>{p.isActive ? "Active" : "Inactive"}</AdminBadge></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600"><Pencil size={14} /></button>
                    <button onClick={() => del(p)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">{editing ? "Edit Promotion" : "New Promotion"}</DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Title" value={form.title as string} onChange={(v) => set("title", v)} />
            <AdminInput label="Code" value={form.code as string} onChange={(v) => set("code", v.toUpperCase())} placeholder="JULY4" />
            <div className="grid grid-cols-2 gap-3">
              <AdminSelect label="Type" value={form.type as string} onChange={(v) => set("type", v)} options={[{ value: "percent", label: "Percentage Off" }, { value: "fixed", label: "Fixed Amount" }, { value: "shipping", label: "Free Shipping" }]} />
              <AdminInput label="Value" type="number" value={String(form.value)} onChange={(v) => set("value", Number(v))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Min Spend" type="number" value={String(form.minSpend)} onChange={(v) => set("minSpend", Number(v))} />
              <AdminInput label="Usage Limit" type="number" value={String(form.usageLimit)} onChange={(v) => set("usageLimit", Number(v))} />
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
