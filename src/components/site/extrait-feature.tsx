"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Droplets, Award, Sparkles } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function ExtraitFeature({ product }: { product: SerializedProduct }) {
  const addItem = useCart((s) => s.addItem);

  const features = [
    { icon: Droplets, label: "30%+ Concentration", desc: "Highest parfum intensity" },
    { icon: Award, label: "Maison-Crafted", desc: "Hand-blended in small batches" },
    { icon: Sparkles, label: "12+ Hour Longevity", desc: "Enduring sillage & projection" },
  ];

  return (
    <section className="relative overflow-hidden bg-espresso py-20 text-white lg:py-28">
      {/* Decorative */}
      <div className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl shadow-gold">
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-espresso/40 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-5 -left-5 rounded-2xl border border-gold/30 bg-espresso/90 px-5 py-4 backdrop-blur-sm"
          >
            <p className="text-[10px] uppercase tracking-widest text-gold">Extrait de Parfum</p>
            <p className="font-serif text-2xl">{product.concentration}</p>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold"
          >
            The Apex of Perfumery
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 font-serif text-5xl font-semibold leading-tight lg:text-6xl"
          >
            {product.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-md text-sm leading-relaxed text-white/70"
          >
            {product.longDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-7 grid gap-3 sm:grid-cols-3"
          >
            {features.map((f) => (
              <div key={f.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <f.icon size={20} className="text-gold" />
                <p className="mt-2 text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-white/50">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Notes pyramid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-7 space-y-2"
          >
            {[
              { label: "Top Notes", value: product.topNotes },
              { label: "Heart Notes", value: product.heartNotes },
              { label: "Base Notes", value: product.baseNotes },
            ].map((n) => (
              <div key={n.label} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-[10px] uppercase tracking-widest text-gold">{n.label}</span>
                <span className="text-white/80">{n.value}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <span className="font-serif text-3xl font-semibold text-gold">{formatPrice(product.price)}</span>
            <button
              onClick={() => {
                addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], brand: product.brand?.name ?? "", size: product.size });
                toast.success(`${product.name} added to cart`);
              }}
              className="group inline-flex items-center gap-2 rounded-lg bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-espresso transition hover:bg-gold-soft"
            >
              Add to Cart <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
