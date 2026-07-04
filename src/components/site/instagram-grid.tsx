"use client";

import { motion } from "framer-motion";
import { Instagram, Heart } from "lucide-react";

// Use the generated journal/category images as UGC placeholders
const UGC = [
  { img: "/images/journal/journal1.jpg", handle: "@fragrance.diary", likes: 1240 },
  { img: "/images/categories/floral.jpg", handle: "@scented.society", likes: 892 },
  { img: "/images/products/rose-noir.jpg", handle: "@oudobsessed", likes: 2103 },
  { img: "/images/journal/journal2.jpg", handle: "@theperfumecollective", likes: 1567 },
  { img: "/images/categories/oud.jpg", handle: "@niche.nose", likes: 1834 },
  { img: "/images/products/velvet-saffron.jpg", handle: "@saffronandscent", likes: 945 },
];

export function InstagramGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
          <Instagram size={13} /> @ScentGrade
        </span>
        <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">From Our Community</h2>
        <p className="mt-3 text-sm text-muted-foreground">Tag <span className="font-semibold text-foreground">#ScentGrade</span> for a chance to be featured.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
        {UGC.map((u, i) => (
          <motion.a
            key={i}
            href="#"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.06 }}
            className="group relative aspect-square overflow-hidden rounded-lg bg-cream"
          >
            <img src={u.img} alt={u.handle} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-espresso/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-xs font-medium text-white">@{u.handle.replace("@", "")}</span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Heart size={12} fill="currentColor" className="text-gold" /> {u.likes.toLocaleString()}
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-gold hover:text-gold"
        >
          <Instagram size={15} /> Follow @ScentGrade
        </a>
      </div>
    </section>
  );
}
