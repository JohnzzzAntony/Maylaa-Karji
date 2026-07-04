"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminBadge, AdminTable, AdminInput, AdminTextarea, AdminToggle } from "../admin-ui";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Page = { id: string; title: string; slug: string; content: string; isPublished: boolean; updatedAt: string };
const EMPTY = { title: "", slug: "", content: "", isPublished: true };

export function AdminCms() {
  const [pages, setPages] = useState<Page[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(EMPTY);

  const load = useCallback(() => { fetch("/api/admin/cms").then((r) => r.json()).then((d) => setPages(d.pages || [])); }, []);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setOpen(true); };
  const openEdit = (p: Page) => { setForm(p); setEditing(p); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const res = await fetch("/api/admin/cms", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
    if (res.ok) { toast.success("Saved"); close(); load(); }
  };
  const del = async (p: Page) => { if (!confirm(`Delete "${p.title}"?`)) return; await fetch(`/api/admin/cms?id=${p.id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminPage title="CMS Pages" subtitle="Manage static content pages (About, FAQ, Policies)" action={<AdminButton variant="amber" onClick={openCreate}><Plus size={15} /> Add Page</AdminButton>}>
      <AdminCard>
        {pages.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <FileText size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No pages yet</p>
          </div>
        ) : (
          <AdminTable headers={["Title", "Slug", "Status", "Updated", "Actions"]}>
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-stone-500">/{p.slug}</td>
                <td className="px-4 py-3">
                  <AdminBadge color={p.isPublished ? "green" : "stone"}>
                    {p.isPublished ? <span className="flex items-center gap-1"><Eye size={11} /> Published</span> : <span className="flex items-center gap-1"><EyeOff size={11} /> Draft</span>}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">{new Date(p.updatedAt).toLocaleDateString()}</td>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="font-serif text-xl font-semibold text-stone-900">{editing ? "Edit Page" : "New Page"}</DialogTitle>
          <div className="mt-4 space-y-3">
            <AdminInput label="Title" value={form.title as string} onChange={(v) => set("title", v)} />
            <AdminInput label="Slug (auto-generated from title if empty)" value={form.slug as string} onChange={(v) => set("slug", v)} placeholder="about-us" />
            <AdminTextarea label="Content" value={form.content as string} onChange={(v) => set("content", v)} rows={10} />
            <AdminToggle checked={form.isPublished as boolean} onChange={(v) => set("isPublished", v)} label="Published" />
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
