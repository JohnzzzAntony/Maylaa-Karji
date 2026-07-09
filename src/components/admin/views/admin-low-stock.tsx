"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Printer, RefreshCw, Save } from "lucide-react";
import { AdminCard, AdminButton, AdminTable, AdminBadge } from "../admin-ui";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";

export function AdminLowStock() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedStock, setEditedStock] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/reports/lowstock")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleStockChange = (id: string, val: number) => {
    setEditedStock((prev) => ({ ...prev, [id]: val }));
  };

  const saveStock = async (id: string) => {
    const stockVal = editedStock[id];
    if (stockVal === undefined) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: stockVal }),
      });
      if (res.ok) {
        toast.success("Stock level updated");
        setEditedStock((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        load();
      } else {
        toast.error("Failed to update stock");
      }
    } catch {
      toast.error("Error occurred");
    } finally {
      setSaving(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print:p-8 print:bg-white print:text-black">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Low Stock Report</h2>
        <div className="flex gap-2">
          <AdminButton variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw size={13} /></AdminButton>
          <AdminButton variant="outline" size="sm" onClick={printReport}><Printer size={13} /> Print Report</AdminButton>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-serif font-bold">The House Of Karji — Low Stock Inventory Report</h1>
        <p className="text-xs text-stone-500 mt-1">Generated on {new Date().toLocaleString()} · Target threshold: &le; 15 units</p>
      </div>

      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400 print:hidden">Loading report...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <AlertTriangle size={32} className="text-emerald-500" />
            <p className="text-sm text-stone-600 font-semibold">Inventory healthy! No products are currently low on stock.</p>
          </div>
        ) : (
          <AdminTable headers={["Product", "SKU", "Category", "Stock", "Price", "Actions (Print-hidden)"]}>
            {products.map((p) => {
              const currentStock = editedStock[p.id] !== undefined ? editedStock[p.id] : p.stock;
              const isModified = editedStock[p.id] !== undefined;

              return (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="h-8 w-8 rounded object-cover print:hidden" />
                      <div>
                        <p className="font-medium text-stone-900">{p.name}</p>
                        <p className="text-[10px] text-stone-500">{p.brand?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-600">{p.sku}</td>
                  <td className="px-4 py-3 text-xs text-stone-600">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={currentStock}
                        onChange={(e) => handleStockChange(p.id, Number(e.target.value))}
                        className="w-16 rounded border border-stone-200 px-2 py-0.5 text-sm outline-none focus:border-amber-500 print:border-none print:w-auto"
                      />
                      {currentStock <= 5 ? (
                        <AdminBadge color="red">Critical</AdminBadge>
                      ) : (
                        <AdminBadge color="amber">Low</AdminBadge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-stone-900">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 print:hidden">
                    {isModified && (
                      <AdminButton variant="amber" size="sm" onClick={() => saveStock(p.id)} disabled={saving}>
                        <Save size={12} /> Save
                      </AdminButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
