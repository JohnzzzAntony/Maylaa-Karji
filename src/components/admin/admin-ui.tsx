"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AdminPage({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-stone-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white shadow-sm", className)}>{children}</div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = "amber", delay = 0 }: { label: string; value: string | number; icon: typeof import("lucide-react").LayoutDashboard; trend?: string; color?: "amber" | "emerald" | "blue" | "rose" | "violet"; delay?: number }) {
  const colors: Record<string, string> = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <AdminCard className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{label}</p>
            <p className="mt-1.5 font-serif text-2xl font-semibold text-stone-900">{value}</p>
            {trend && <p className="mt-1 text-[11px] text-emerald-600">{trend}</p>}
          </div>
          <div className={cn("grid h-10 w-10 place-items-center rounded-lg", colors[color])}>
            <Icon size={18} />
          </div>
        </div>
      </AdminCard>
    </motion.div>
  );
}

export function AdminButton({ children, onClick, variant = "primary", size = "md", className, type = "button", disabled }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "ghost" | "danger" | "amber"; size?: "sm" | "md"; className?: string; type?: "button" | "submit"; disabled?: boolean }) {
  const variants: Record<string, string> = {
    primary: "bg-stone-900 text-white hover:bg-stone-700",
    amber: "bg-amber-600 text-white hover:bg-amber-700",
    outline: "border border-stone-300 text-stone-700 hover:bg-stone-50",
    ghost: "text-stone-600 hover:bg-stone-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  const sizes: Record<string, string> = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn("inline-flex items-center gap-1.5 rounded-lg font-medium transition disabled:opacity-50", variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}

export function AdminBadge({ children, color = "stone" }: { children: ReactNode; color?: "stone" | "green" | "amber" | "red" | "blue" }) {
  const colors: Record<string, string> = {
    stone: "bg-stone-100 text-stone-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", colors[color])}>{children}</span>;
}

export function AdminInput({ label, value, onChange, type = "text", placeholder, className }: { label?: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string }) {
  return (
    <label className={cn("block", className)}>
      {label && <span className="mb-1 block text-xs font-medium text-stone-600">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      />
    </label>
  );
}

export function AdminTextarea({ label, value, onChange, rows = 4, placeholder }: { label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-stone-600">{label}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      />
    </label>
  );
}

export function AdminSelect({ label, value, onChange, options, className }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return (
    <label className={cn("block", className)}>
      {label && <span className="mb-1 block text-xs font-medium text-stone-600">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function AdminToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-amber-600" : "bg-stone-300")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", checked ? "left-5.5" : "left-0.5")} style={{ left: checked ? "1.375rem" : "0.125rem" }} />
      </button>
      {label && <span className="text-sm text-stone-700">{label}</span>}
    </label>
  );
}

export function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            {headers.map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">{children}</tbody>
      </table>
    </div>
  );
}

export function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const doFetch = () => {
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setData(d); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch: doFetch };
}
