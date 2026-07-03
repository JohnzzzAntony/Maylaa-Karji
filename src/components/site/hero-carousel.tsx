"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";

const SLIDES = [
  {
    eyebrow: "Holiday Weekend Offer",
    title: "12% Off",
    subtitle: "The Art of Arabian Oud",
    desc: "Celebrate the season with curated luxury fragrances. Use code JULY4 at checkout.",
    cta: "Shop the Offer",
    accent: "from-gold/30 via-transparent to-espresso/60",
    image: "/images/hero/hero-main.jpg",
  },
  {
    eyebrow: "New Collection",
    title: "Extrait de Parfum",
    subtitle: "Pure Concentration",
    desc: "Discover our highest-concentration fragrances — bold, enduring, unforgettable.",
    cta: "Explore Extrait",
    accent: "from-emerald-deep/40 via-transparent to-espresso/60",
    image: "/images/products/amber-royale.jpg",
  },
  {
    eyebrow: "Artisanal Series",
    title: "Hand-Crafted",
    subtitle: "Small-Batch Mastery",
    desc: "Limited editions from independent perfumers, each a singular work of art.",
    cta: "Discover Artisanal",
    accent: "from-gold/20 via-transparent to-espresso/70",
    image: "/images/products/velvet-saffron.jpg",
  },
];

export function HeroCarousel({ featured }: { featured?: SerializedProduct[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 30 });
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => setIdx(embla?.selectedScrollSnap() ?? 0), [embla]);
  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => embla?.scrollNext(), 6000);
    return () => clearInterval(t);
  }, [embla, paused]);

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container">
          {SLIDES.map((slide, i) => (
            <div className="embla__slide relative" key={i}>
              <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.subtitle}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent md:bg-gradient-to-r md:from-espresso/90 md:via-espresso/40 md:to-transparent" />

                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                    <div className="max-w-xl text-white">
                      <AnimatePresence mode="wait">
                        {idx === i && (
                          <motion.div
                            key={i}
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: {},
                              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                            }}
                          >
                            <motion.span
                              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-sm"
                            >
                              <Sparkles size={12} /> {slide.eyebrow}
                            </motion.span>
                            <motion.h1
                              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                              className="mt-4 font-serif text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl"
                            >
                              {slide.title}
                            </motion.h1>
                            <motion.p
                              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                              className="mt-2 font-serif text-2xl text-gold sm:text-3xl"
                            >
                              {slide.subtitle}
                            </motion.p>
                            <motion.p
                              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                              className="mt-4 max-w-md text-sm text-white/80 sm:text-base"
                            >
                              {slide.desc}
                            </motion.p>
                            <motion.div
                              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                              className="mt-7 flex flex-wrap items-center gap-3"
                            >
                              <a
                                href="#products"
                                className="group inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-espresso transition hover:bg-gold-soft"
                              >
                                {slide.cta}
                                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                              </a>
                              <a
                                href="#journal"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/10"
                              >
                                Read The Journal
                              </a>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:grid"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all"
            style={{ width: i === idx ? 48 : 16 }}
          >
            {i === idx && !paused && (
              <motion.div
                key={`bar-${idx}`}
                className="absolute inset-0 bg-gold"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
            {i === idx && paused && <div className="absolute inset-0 bg-gold" />}
          </button>
        ))}
      </div>

      {/* Featured product strip (desktop) */}
      {featured && featured.length > 0 && (
        <div className="absolute -bottom-1 left-1/2 z-10 hidden w-full max-w-7xl -translate-x-1/2 px-6 lg:block lg:px-8">
          <div className="glass translate-y-1/2 rounded-2xl border border-border p-4 shadow-luxury-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Featured This Week</p>
                <p className="font-serif text-lg">{featured[0].name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gold">{formatPrice(featured[0].price)}</span>
                <a href="#products" className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-white transition hover:bg-gold">
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
