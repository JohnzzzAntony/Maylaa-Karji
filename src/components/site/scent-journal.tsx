"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

const ARTICLES = [
  {
    img: "/images/journal/journal1.jpg",
    category: "Fragrance Guide",
    title: "The Art of Layering: Composing Your Scent Wardrobe",
    excerpt: "Master the perfumer's secret to a unique signature — building depth through thoughtful fragrance layering.",
    readTime: "6 min read",
    date: "Jun 28, 2025",
  },
  {
    img: "/images/journal/journal2.jpg",
    category: "Brand Story",
    title: "Inside Maison Lumière: A Century of Parisian Perfumery",
    excerpt: "Step inside the atelier where tradition and innovation dance in perfect, fragrant harmony.",
    readTime: "8 min read",
    date: "Jun 21, 2025",
  },
  {
    img: "/images/journal/journal3.jpg",
    category: "Craftsmanship",
    title: "From Saffron Field to Flacon: The Journey of an Oud",
    excerpt: "Trace the remarkable path of oud from agarwood forest to the finished extrait de parfum.",
    readTime: "10 min read",
    date: "Jun 14, 2025",
  },
];

export function ScentJournal() {
  return (
    <section id="journal" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">The Scent Journal</span>
        <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">Stories From The Atelier</h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Guides, brand stories, and the craft behind every flacon. Deepen your olfactive education.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {ARTICLES.map((a, i) => (
          <motion.article
            key={a.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-luxury transition hover:shadow-luxury-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={a.img} alt={a.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-espresso backdrop-blur-sm">
                {a.category}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{a.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {a.readTime}</span>
              </div>
              <h3 className="mt-2 font-serif text-xl font-medium leading-snug transition group-hover:text-gold">{a.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                Read Article <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
