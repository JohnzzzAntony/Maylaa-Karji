"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { useUI } from "@/lib/cart-store";

export function QuizCTA() {
  const setQuizOpen = useUI((s) => s.setQuizOpen);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-espresso via-espresso to-emerald-deep py-16 text-white lg:py-20">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-gold/30"
          style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
        >
          <Sparkles size={16 + (i % 3) * 4} />
        </motion.div>
      ))}

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
        >
          <Wand2 size={12} /> Personalized · 60 Seconds
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl"
        >
          Not Sure Where to Begin?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-xl text-sm text-white/70 sm:text-base"
        >
          Let our Scent Concierge guide you. Answer four questions about your taste and mood, and we&apos;ll match you with your perfect fragrance from our curated atelier.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          onClick={() => setQuizOpen(true)}
          className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-wider text-espresso transition hover:bg-gold-soft"
        >
          <Sparkles size={16} />
          Take the Fragrance Quiz
          <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </motion.button>
        <p className="mt-3 text-[11px] text-white/40">No email required · Instant results</p>
      </div>
    </section>
  );
}
