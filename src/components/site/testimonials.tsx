"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, BadgeCheck } from "lucide-react";
import { StarRating } from "./star-rating";

const TESTIMONIALS = [
  {
    name: "Amelia Hartwell",
    role: "Verified Buyer · London",
    avatar: "https://i.pravatar.cc/100?img=47",
    rating: 5,
    text: "The House Of Karji has transformed my fragrance journey. The curation is impeccable — every bottle feels hand-selected just for me. Future Oud is now my signature.",
    product: "Future Oud",
  },
  {
    name: "Rashid Al-Mansouri",
    role: "Verified Buyer · Abu Dhabi",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    text: "As an oud collector, I'm particular. The House Of Karji's selection rivals the finest boutiques in Paris. The authenticity and packaging are beyond compare.",
    product: "Midnight Oud",
  },
  {
    name: "Isabella Romano",
    role: "Verified Buyer · Milan",
    avatar: "https://i.pravatar.cc/100?img=32",
    rating: 5,
    text: "Jasmine Supreme is pure poetry in a bottle. The longevity and sillage are extraordinary. This is what luxury fragrance should feel like.",
    product: "Jasmine Supreme",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-cream/40 py-16 lg:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Words From Our Patrons</span>
          <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">Loved By Connoisseurs</h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <StarRating rating={5} size={18} />
            <span className="text-sm font-medium">4.9/5 from 2,400+ reviews</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-luxury"
            >
              <Quote size={36} className="text-gold/20" />
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-gold/30">
                  <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <BadgeCheck size={14} className="text-gold" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <StarRating rating={t.rating} size={13} />
                <span className="text-[11px] text-muted-foreground">on {t.product}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
