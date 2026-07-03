"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Droplets, Clock, Flame } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export function FeaturedScentEditorial({ product }: { product?: SerializedProduct }) {
  if (!product) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-luxury-lg">
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-5 -right-3 rounded-2xl border border-gold/30 bg-background/95 px-6 py-4 shadow-luxury backdrop-blur-sm sm:-right-5"
          >
            <p className="text-[10px] uppercase tracking-widest text-gold">This Week</p>
            <p className="font-serif text-xl font-semibold">{product.name}</p>
            <p className="text-sm text-gold">{formatPrice(product.price)}</p>
          </motion.div>
        </motion.div>

        {/* Copy side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">This Week&apos;s Featured Scent</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h2>
          <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">{product.brand?.name} · {product.concentration}</p>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/75">
            <p>{product.longDescription}</p>
            <p className="border-l-2 border-gold/40 pl-4 font-serif text-lg italic text-foreground/90">
              &ldquo;A scent that lingers in memory long after the room has emptied — this is perfumery as poetry.&rdquo;
            </p>
          </div>

          {/* Quick stats */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            {[
              { icon: Droplets, label: "Concentration", value: product.concentration },
              { icon: Clock, label: "Longevity", value: "12+ hours" },
              { icon: Flame, label: "Sillage", value: "Bold" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-cream/40 p-3 text-center">
                <s.icon size={18} className="mx-auto text-gold" />
                <p className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="text-xs font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <a
            href="#products"
            className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-espresso px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"
          >
            Discover {product.name} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
