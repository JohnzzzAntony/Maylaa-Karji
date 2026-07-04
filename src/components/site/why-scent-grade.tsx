"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gem, Truck, MessageCircle } from "lucide-react";

const POINTS = [
  { num: "01", icon: ShieldCheck, title: "Authenticity, Guaranteed", desc: "Every bottle is sourced directly from the perfume house and verified through our rigorous multi-point authentication. Counterfeits don't exist here — ever." },
  { num: "02", icon: Gem, title: "Curated Luxury", desc: "Our master perfumers hand-pick each fragrance from over 200 maisons. We carry only what earns its place on your vanity — no filler, only the extraordinary." },
  { num: "03", icon: Truck, title: "Fast, Insured Shipping", desc: "Complimentary worldwide shipping on orders over Dhs. 500, with full insurance and tracking from our atelier to your door — typically within 3–5 days." },
  { num: "04", icon: MessageCircle, title: "Expert Fragrance Advice", desc: "Our concierge team — real humans, not bots — is here to guide you. Take our quiz, chat with Aria, or email us. We'll find your signature scent." },
];

export function WhyScentGrade() {
  return (
    <section className="bg-cream/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">The Difference</span>
          <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">Why Scent Grade?</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex gap-5 bg-background p-7 transition hover:bg-cream/60 lg:p-9"
            >
              <div className="flex flex-col items-center">
                <span className="font-serif text-3xl font-semibold text-gold/30 transition group-hover:text-gold">{p.num}</span>
                <div className="mt-3 grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-white">
                  <p.icon size={22} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-medium">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
