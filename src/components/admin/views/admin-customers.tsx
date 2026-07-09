"use client";

import { useEffect, useState } from "react";
import { Users, Mail, ShoppingBag } from "lucide-react";
import { AdminPage, AdminCard, AdminTable, StatCard } from "../admin-ui";
import { formatPrice } from "@/lib/format";

type Sub = { id: string; email: string; createdAt: string };
type Customer = { email: string; name: string; orderCount: number; totalSpent: number };

export function AdminCustomers() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tab, setTab] = useState<"customers" | "subscribers">("customers");

  useEffect(() => {
    fetch("/api/admin/customers").then((r) => r.json()).then((d) => { setSubs(d.subscribers || []); setCustomers(d.customers || []); });
  }, []);

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <AdminPage title="Customers" subtitle="View customers and newsletter subscribers">
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Customers" value={customers.length} icon={Users} color="amber" />
        <StatCard label="Subscribers" value={subs.length} icon={Mail} color="blue" />
        <StatCard label="Total Revenue" value={formatPrice(totalSpent)} icon={ShoppingBag} color="emerald" />
        <StatCard label="Avg Customer Value" value={formatPrice(customers.length ? totalSpent / customers.length : 0)} icon={Users} color="violet" />
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab("customers")} className={`rounded-lg px-4 py-2 text-xs font-medium transition ${tab === "customers" ? "bg-stone-900 text-white" : "bg-white text-stone-600 hover:bg-stone-100"}`}>Customers ({customers.length})</button>
        <button onClick={() => setTab("subscribers")} className={`rounded-lg px-4 py-2 text-xs font-medium transition ${tab === "subscribers" ? "bg-stone-900 text-white" : "bg-white text-stone-600 hover:bg-stone-100"}`}>Subscribers ({subs.length})</button>
      </div>

      <AdminCard>
        {tab === "customers" ? (
          <AdminTable headers={["Customer", "Email", "Orders", "Total Spent"]}>
            {customers.map((c) => (
              <tr key={c.email} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">{c.name.charAt(0)}</div>
                    <span className="font-medium text-stone-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{c.email}</td>
                <td className="px-4 py-3 text-sm text-stone-600">{c.orderCount}</td>
                <td className="px-4 py-3 font-semibold text-stone-900">{formatPrice(c.totalSpent)}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-sm text-stone-400">No customers yet</td></tr>}
          </AdminTable>
        ) : (
          <AdminTable headers={["Email", "Subscribed On"]}>
            {subs.map((s) => (
              <tr key={s.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-blue-700"><Mail size={15} /></div>
                    <span className="font-medium text-stone-900">{s.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {subs.length === 0 && <tr><td colSpan={2} className="p-8 text-center text-sm text-stone-400">No subscribers yet</td></tr>}
          </AdminTable>
        )}
      </AdminCard>
    </AdminPage>
  );
}
