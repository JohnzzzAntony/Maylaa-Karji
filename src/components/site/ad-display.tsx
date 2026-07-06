"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Megaphone, ArrowRight } from "lucide-react";

export type Ad = { id: string; title: string; image: string; link: string; placement: string };

export function AdDisplay({ ads, placement }: { ads: Ad[]; placement: string }) {
  const filtered = ads.filter((a) => a.placement === placement);
  if (filtered.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className={placement === "sidebar" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4"}>
        {filtered.map((ad, i) => (
          <motion.a
            key={ad.id}
            href={ad.link || "#"}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-secondary shadow-luxury"
          >
            <div className="relative aspect-[16/7]">
              <Image src={ad.image} alt={ad.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
                  <Megaphone size={11} /> Advertisement
                </span>
                <p className="font-serif text-xl font-semibold text-white">{ad.title}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold opacity-0 transition group-hover:opacity-100">
                  Learn More <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
