"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Cat = { id: string; name: string; slug: string; description: string; image: string };

export function CategoryShowcase({ categories, onNavigateCategory }: { categories: Cat[]; onNavigateCategory?: (slug: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold"
        >
          Explore by Family
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-2 font-serif text-4xl font-semibold sm:text-5xl"
        >
          Find Your Olfactive Signature
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-xl text-sm text-muted-foreground"
        >
          Five fragrance families, each a world of its own. Discover the scent that speaks your language.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            onClick={() => onNavigateCategory?.(cat.slug)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`group relative overflow-hidden rounded-2xl shadow-luxury text-left ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="font-serif text-xl font-medium text-white">{cat.name}</h3>
                <p className="mt-0.5 text-[11px] text-white/70">{cat.description}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gold opacity-0 transition group-hover:opacity-100">
                  Discover <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
