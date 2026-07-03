"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { StarRating } from "./star-rating";

export function ReviewSummary() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cream/60 to-background p-8 shadow-luxury lg:p-12"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/5 blur-2xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
          {/* Big rating */}
          <div className="text-center">
            <p className="font-serif text-6xl font-semibold text-gold">4.9</p>
            <StarRating rating={4.9} size={20} className="mt-2 justify-center" />
            <p className="mt-2 text-xs text-muted-foreground">Based on 2,400+ reviews</p>
          </div>

          {/* Divider */}
          <div className="hidden h-24 w-px bg-border lg:block" />

          {/* Breakdown */}
          <div className="flex-1 space-y-1.5">
            {[
              { stars: 5, pct: 92 },
              { stars: 4, pct: 6 },
              { stars: 3, pct: 1 },
              { stars: 2, pct: 0.5 },
              { stars: 1, pct: 0.5 },
            ].map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="flex w-12 items-center gap-1 text-xs text-muted-foreground">
                  {r.stars} <Star size={11} className="text-gold" fill="currentColor" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full bg-gold"
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{r.pct}%</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="hidden border-l border-border pl-6 lg:block lg:w-56">
            <Quote size={28} className="text-gold/30" />
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-foreground/80">
              The most trusted name in luxury fragrance. My collection has never been in better hands.
            </p>
            <p className="mt-2 text-xs font-semibold text-foreground">— Verified Buyer</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Star size={12} className="text-gold" fill="currentColor" /> Judge.me Verified</span>
          <span>·</span>
          <span>Photo Reviews Enabled</span>
          <span>·</span>
          <span>Independent & Authentic</span>
        </div>
      </motion.div>
    </section>
  );
}
