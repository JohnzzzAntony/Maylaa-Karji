"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { ProductCard } from "./product-card";

export function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
  onQuickView,
  onViewAll,
  onViewProduct,
  icon,
  bg = "default",
  cta = "View All",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  products: SerializedProduct[];
  onQuickView?: (p: SerializedProduct) => void;
  onViewAll?: () => void;
  onViewProduct?: (p: SerializedProduct) => void;
  icon?: "flame" | "default";
  bg?: "default" | "cream";
  cta?: string;
}) {
  return (
    <section id={id} className={bg === "cream" ? "bg-cream/40 py-16 lg:py-24" : "py-16 lg:py-24"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-start">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold"
            >
              {icon === "flame" && <Flame size={13} className="text-red-600" />}
              {eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-2 font-serif text-4xl font-semibold sm:text-5xl"
            >
              {title}
            </motion.h2>
            {description && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-2 max-w-lg text-sm text-muted-foreground"
              >
                {description}
              </motion.p>
            )}
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:text-gold"
            >
              {cta}
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} onViewProduct={onViewProduct} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
