"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Gift, ArrowRight, Tag } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export type BogoOffer = {
  id: string;
  title: string;
  description: string;
  buyQty: number;
  getQty: number;
  discountPct: number;
};

export function BogoSection({ offers, products }: { offers: BogoOffer[]; products: SerializedProduct[] }) {
  if (offers.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-espresso to-emerald-deep py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <Gift size={12} /> Limited Time Offers
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Buy More, Save More</h2>
          <p className="mt-2 text-sm text-white/60">Exclusive BOGO deals on luxury fragrances</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-white/5 p-6 backdrop-blur-sm transition hover:border-gold/40"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gold/15">
                  <Gift size={26} className="text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-semibold">{offer.title}</h3>
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-espresso">{offer.discountPct}% Off</span>
                  </div>
                  <p className="mt-1 text-sm text-white/70">{offer.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs">
                    <span className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold">Buy {offer.buyQty}</span>
                    <ArrowRight size={14} className="text-gold" />
                    <span className="rounded-lg bg-gold/20 px-3 py-1.5 font-semibold text-gold">Get {offer.getQty} at {offer.discountPct}% off</span>
                  </div>
                </div>
              </div>
              <a
                href="#products"
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gold py-3 text-xs font-semibold uppercase tracking-wider text-espresso transition hover:bg-gold-soft"
              >
                <Tag size={14} /> Shop This Offer <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
