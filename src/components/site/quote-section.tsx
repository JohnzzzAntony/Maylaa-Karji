"use client";

import { motion } from "framer-motion";

export function QuoteSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-serif text-7xl leading-none text-gold/30">&ldquo;</span>
        </motion.div>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-2 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Oil and perfume make the heart rejoice.
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-sm uppercase tracking-[0.3em] text-gold"
        >
          — Proverbs 27:9
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-8 h-px w-24 origin-center bg-gold/40"
        />
      </div>
    </section>
  );
}
