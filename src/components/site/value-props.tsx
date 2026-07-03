"use client";

import { motion } from "framer-motion";
import { Gem, Globe2, FlaskConical, Leaf } from "lucide-react";

const VALUES = [
  { icon: Gem, title: "Curated Premium Selection", desc: "Every fragrance is hand-picked by our master perfumers from over 200 maisons worldwide. Only the finest make the cut." },
  { icon: FlaskConical, title: "Authenticity, Guaranteed", desc: "Each bottle is sourced directly from the house and verified through our rigorous multi-point authentication process." },
  { icon: Globe2, title: "Global, Insured Shipping", desc: "Complimentary worldwide shipping on orders over Dhs. 500, with full insurance and tracking from our atelier to your door." },
  { icon: Leaf, title: "Sustainable Luxury", desc: "Plastic-free, recyclable packaging and carbon-neutral delivery. Luxury that honors the planet." },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-12 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">The ScentGrade Promise</span>
        <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">Why Connoisseurs Choose Us</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-gold hover:shadow-luxury-lg"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/5 transition group-hover:bg-gold/10" />
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-white">
                <v.icon size={22} />
              </div>
              <h3 className="mt-4 font-serif text-xl font-medium">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
