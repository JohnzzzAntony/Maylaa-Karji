"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, MessageSquare, Check, Star } from "lucide-react";
import { AdminCard, AdminBadge, AdminTable } from "../admin-ui";
import { toast } from "sonner";

type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  location: string | null;
  createdAt: string;
  product: { name: string; sku: string };
};

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleVerified = async (r: Review) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, verified: !r.verified }),
    });
    if (res.ok) {
      toast.success("Review status updated");
      load();
    }
  };

  const del = async (r: Review) => {
    if (!confirm(`Delete review by "${r.author}"?`)) return;
    const res = await fetch(`/api/admin/reviews?id=${r.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Review deleted");
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Product Reviews</h2>
      </div>
      <AdminCard>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <MessageSquare size={32} className="text-stone-300" />
            <p className="text-sm text-stone-500">No reviews found</p>
          </div>
        ) : (
          <AdminTable headers={["Product", "Reviewer", "Rating", "Review", "Verified", "Date", "Actions"]}>
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 text-xs">
                  <p className="font-medium text-stone-900">{r.product?.name}</p>
                  <p className="font-mono text-[9px] text-stone-400">SKU: {r.product?.sku}</p>
                </td>
                <td className="px-4 py-3 text-sm">
                  <p className="font-medium text-stone-900">{r.author}</p>
                  {r.location && <p className="text-xs text-stone-500">{r.location}</p>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs max-w-xs">
                  <p className="font-semibold text-stone-900">{r.title}</p>
                  <p className="text-stone-600">{r.content}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVerified(r)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                      r.verified
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {r.verified ? "Verified" : "Unverified"}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => del(r)} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
