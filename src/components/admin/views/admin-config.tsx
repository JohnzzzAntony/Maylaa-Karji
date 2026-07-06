"use client";

import { useEffect, useState, useCallback } from "react";
import { Settings, Save, Plus, Trash2 } from "lucide-react";
import { AdminPage, AdminCard, AdminButton, AdminInput, AdminBadge } from "../admin-ui";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Setting = { id: string; key: string; value: string; label: string; group: string };
const GROUPS = ["general", "shipping", "payment", "tax"];

export function AdminConfig() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeGroup, setActiveGroup] = useState("general");
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const load = useCallback(() => { fetch("/api/admin/config").then((r) => r.json()).then((d) => setSettings(d.settings || [])); }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = settings.filter((s) => s.group === activeGroup);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(edited).map(([id, value]) =>
          fetch("/api/admin/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, value }) })
        )
      );
      toast.success(`${Object.keys(edited).length} setting(s) saved`);
      setEdited({});
      load();
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    if (!newKey) { toast.error("Key required"); return; }
    await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: newKey, value: newValue, label: newLabel || newKey, group: activeGroup }) });
    toast.success("Setting added");
    setNewKey(""); setNewValue(""); setNewLabel("");
    load();
  };

  const del = async (s: Setting) => {
    if (!confirm(`Delete setting "${s.label}"?`)) return;
    await fetch(`/api/admin/config?id=${s.id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  return (
    <AdminPage title="Configuration" subtitle="Store settings, shipping, payment, and tax" action={
      Object.keys(edited).length > 0 ? <AdminButton variant="amber" onClick={save} disabled={saving}><Save size={15} /> {saving ? "Saving..." : `Save Changes (${Object.keys(edited).length})`}</AdminButton> : undefined
    }>
      {/* Group tabs */}
      <AdminCard className="mb-4 p-2">
        <div className="flex gap-1">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium capitalize transition ${activeGroup === g ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`}
            >
              <Settings size={13} /> {g}
              <span className="ml-1 rounded-full bg-stone-200 px-1.5 text-[10px] text-stone-600">{settings.filter((s) => s.group === g).length}</span>
            </button>
          ))}
        </div>
      </AdminCard>

      {/* Settings list */}
      <div className="grid gap-3">
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <AdminCard className="flex items-center gap-3 p-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-stone-600">{s.label}</label>
                <input
                  value={edited[s.id] ?? s.value}
                  onChange={(e) => setEdited((ed) => ({ ...ed, [s.id]: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
                />
                <p className="mt-0.5 font-mono text-[10px] text-stone-400">{s.key}</p>
              </div>
              {edited[s.id] !== undefined && <AdminBadge color="amber">edited</AdminBadge>}
              <button onClick={() => del(s)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={14} /></button>
            </AdminCard>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400">No settings in this group</div>}
      </div>

      {/* Add new setting */}
      <AdminCard className="mt-6 p-4">
        <h3 className="mb-3 font-serif text-base font-semibold text-stone-900">Add New Setting to &ldquo;{activeGroup}&rdquo;</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <AdminInput label="Key" value={newKey} onChange={setNewKey} placeholder="store_name" />
          <AdminInput label="Label" value={newLabel} onChange={setNewLabel} placeholder="Store Name" />
          <AdminInput label="Value" value={newValue} onChange={setNewValue} placeholder="The House Of Karji" />
          <div className="flex items-end">
            <AdminButton variant="amber" onClick={addSetting} className="w-full justify-center"><Plus size={14} /> Add</AdminButton>
          </div>
        </div>
      </AdminCard>
    </AdminPage>
  );
}
