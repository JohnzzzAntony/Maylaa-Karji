"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export type Banner = { id: string; title: string; subtitle: string; image: string; mobileImage?: string; link: string; position: string };

const DEFAULT_SLIDES = [
  {
    eyebrow: "Holiday Weekend Offer",
    title: "12% Off",
    subtitle: "The Art of Arabian Oud",
    desc: "Celebrate the season with curated luxury fragrances. Use code KARJI10 at checkout.",
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

export function HeroCarousel({ featured, banners }: { featured?: SerializedProduct[]; banners?: Banner[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 30 });
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Build slides from DB banners (hero position) or fall back to defaults
  const slides = useMemo(() => {
    const heroBanners = (banners ?? []).filter((b) => b.position === "hero");
    if (heroBanners.length > 0) {
      return heroBanners.map((b, i) => ({
        eyebrow: i === 0 ? "Featured Offer" : "Collection",
        title: b.title,
        subtitle: b.subtitle,
        desc: b.subtitle,
        cta: "Shop Now",
        accent: i % 2 === 0 ? "from-gold/30 via-transparent to-espresso/60" : "from-emerald-deep/40 via-transparent to-espresso/60",
        image: b.image,
        mobileImage: b.mobileImage,
        link: b.link,
      }));
    }
    return DEFAULT_SLIDES.map(s => ({ ...s, mobileImage: "" }));
  }, [banners]);

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
          {slides.map((slide, i) => (
            <div className="embla__slide relative" key={i}>
              <div className="relative h-[400px] md:h-[650px] w-full max-w-[767px] md:max-w-[1440px] overflow-hidden mx-auto">
                {slide.mobileImage ? (
                  <>
                    <Image
                      src={slide.image}
                      alt={slide.subtitle}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="hidden md:block object-cover"
                    />
                    <Image
                      src={slide.mobileImage}
                      alt={slide.subtitle}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="block md:hidden object-cover"
                    />
                  </>
                ) : (
                  <Image
                    src={slide.image}
                    alt={slide.subtitle}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
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
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            aria-label={"Go to slide " + (i + 1)}
            className="group relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all"
            style={{ width: i === idx ? 48 : 16 }}
          >
            {i === idx && !paused && (
              <motion.div
                key={"bar-" + idx}
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
    </section>
  );
}
