"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { useRecentlyViewed } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export function RecentlyViewed({
  allProducts,
  onQuickView,
}: {
  allProducts: SerializedProduct[];
  onQuickView?: (p: SerializedProduct) => void;
}) {
  const ids = useRecentlyViewed((s) => s.ids);
  const viewed = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as SerializedProduct[];

  if (viewed.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gold" />
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Recently Viewed</h2>
        </div>
        <a href="#products" className="group inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:text-gold">
          Continue Browsing <ArrowRight size={13} className="transition group-hover:translate-x-1" />
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
        {viewed.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onQuickView?.(p)}
            className="group shrink-0 w-40 text-left sm:w-48"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-cream shadow-luxury">
              <Image src={p.images[0]} alt={p.name} fill sizes="192px" className="object-cover transition group-hover:scale-110" />
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{p.brand?.name}</p>
            <p className="font-serif text-sm font-medium leading-tight group-hover:text-gold">{p.name}</p>
            <p className="text-sm font-semibold text-gold">{formatPrice(p.price)}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
