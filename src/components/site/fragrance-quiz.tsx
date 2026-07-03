"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShoppingBag, Heart, Check, X } from "lucide-react";
import Image from "next/image";
import type { SerializedProduct } from "@/lib/data";
import { useCart, useWishlist, useUI } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { StarRating } from "./star-rating";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Answer = { question: string; option: string; tags: string[] };

const QUESTIONS = [
  {
    id: "mood",
    question: "What mood do you want your fragrance to evoke?",
    subtitle: "Your scent is an extension of your inner world.",
    options: [
      { label: "Mysterious & Seductive", emoji: "🌑", tags: ["oud", "leather", "patchouli", "amber"] },
      { label: "Fresh & Uplifting", emoji: "☀️", tags: ["citrus", "bergamot", "neroli", "fresh"] },
      { label: "Romantic & Floral", emoji: "🌸", tags: ["rose", "jasmine", "floral", "orchid"] },
      { label: "Warm & Cozy", emoji: "🔥", tags: ["vanilla", "saffron", "amber", "sandalwood"] },
    ],
  },
  {
    id: "occasion",
    question: "When will you wear this fragrance most?",
    subtitle: "Day or night, we have your perfect match.",
    options: [
      { label: "Everyday Signature", emoji: "✨", tags: ["musk", "white", "cedar", "fresh"] },
      { label: "Special Evenings", emoji: "🌙", tags: ["oud", "leather", "amber", "extrait"] },
      { label: "Office & Meetings", emoji: "💼", tags: ["citrus", "woody", "cedar", "fresh"] },
      { label: "Date Night", emoji: "❤️", tags: ["rose", "vanilla", "saffron", "jasmine"] },
    ],
  },
  {
    id: "intensity",
    question: "How bold do you like your scent?",
    subtitle: "From a whisper to a statement.",
    options: [
      { label: "Subtle & Skin-Like", emoji: "🤍", tags: ["musk", "white", "fresh"] },
      { label: "Balanced & Refined", emoji: "⚖️", tags: ["floral", "woody", "cedar"] },
      { label: "Bold & Powerful", emoji: "💥", tags: ["oud", "leather", "patchouli", "extrait"] },
      { label: "Opulent & maximalist", emoji: "👑", tags: ["amber", "saffron", "vanilla", "extrait"] },
    ],
  },
  {
    id: "family",
    question: "Which note family calls to you?",
    subtitle: "The olfactive world is vast — pick your compass.",
    options: [
      { label: "Oud & Amber", emoji: "🪵", tags: ["oud", "amber"] },
      { label: "Floral Bouquets", emoji: "🌹", tags: ["rose", "jasmine", "floral", "orchid"] },
      { label: "Woody & Earthy", emoji: "🌲", tags: ["cedar", "patchouli", "woody", "leather"] },
      { label: "Oriental & Spicy", emoji: "🌶️", tags: ["saffron", "vanilla", "amber", "oriental"] },
    ],
  },
];

export function FragranceQuiz({ products }: { products: SerializedProduct[] }) {
  const { quizOpen, setQuizOpen } = useUI();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const close = () => {
    setQuizOpen(false);
    setTimeout(reset, 300);
  };

  const select = (qId: string, label: string, tags: string[]) => {
    const newAnswers = [...answers.filter((a) => a.question !== qId), { question: qId, option: label, tags }];
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(QUESTIONS.length); // results screen
    }
  };

  // Score products by tag matches
  const recommendation = useMemo(() => {
    if (answers.length < QUESTIONS.length) return null;
    const allTags = answers.flatMap((a) => a.tags);
    const scored = products.map((p) => {
      const text = `${p.name} ${p.description} ${p.topNotes} ${p.heartNotes} ${p.baseNotes} ${p.category?.name ?? ""}`.toLowerCase();
      let score = 0;
      for (const tag of allTags) {
        if (text.includes(tag)) score += 1;
      }
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return { top: scored[0]?.p, runners: scored.slice(1, 3).map((s) => s.p) };
  }, [answers, products]);

  const isResults = step >= QUESTIONS.length;

  return (
    <Dialog open={quizOpen} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Fragrance Quiz</DialogTitle>
        {/* Header gradient */}
        <div className="relative bg-espresso px-6 py-6 text-white">
          <button onClick={close} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Close">
            <X size={16} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Scent Concierge</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl">Find Your Signature Scent</h2>

          {/* Progress */}
          {!isResults && (
            <div className="mt-4 flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full bg-gold"
                    initial={false}
                    animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {!isResults ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                  Question {step + 1} of {QUESTIONS.length}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">{QUESTIONS[step].question}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{QUESTIONS[step].subtitle}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map((opt, i) => {
                    const selected = answers.find((a) => a.question === QUESTIONS[step].id)?.option === opt.label;
                    return (
                      <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => select(QUESTIONS[step].id, opt.label, opt.tags)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
                          selected ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                        )}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="flex-1 text-sm font-medium">{opt.label}</span>
                        {selected && <Check size={16} className="text-gold" />}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Nav */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => step > 0 && setStep(step - 1)}
                    disabled={step === 0}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <span className="text-xs text-muted-foreground">{step + 1} / {QUESTIONS.length}</span>
                </div>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/10"
                  >
                    <Sparkles size={22} className="text-gold" />
                  </motion.div>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-gold">Your Match</p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold">We Found Your Scent</h3>
                </div>

                {/* Top recommendation */}
                <RecommendationCard product={recommendation.top!} primary />

                {/* Runners up */}
                {recommendation.runners.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">You May Also Love</p>
                    <div className="grid grid-cols-2 gap-3">
                      {recommendation.runners.map((p) => (
                        <RecommendationCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex justify-center">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-gold hover:text-gold"
                  >
                    <RotateCcw size={14} /> Retake Quiz
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid min-h-[420px] place-items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-gold" />
              </div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RecommendationCard({ product, primary = false }: { product: SerializedProduct; primary?: boolean }) {
  const addItem = useCart((s) => s.addItem);
  const wishlistToggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  if (primary) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 overflow-hidden rounded-2xl border-2 border-gold/30 bg-cream/40"
      >
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square sm:aspect-auto">
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Top Match</span>
          </div>
          <div className="flex flex-col p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">{product.brand?.name}</p>
            <h4 className="mt-1 font-serif text-2xl font-semibold">{product.name}</h4>
            <StarRating rating={product.rating} size={15} showValue count={product.reviewCount} className="mt-1" />
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold text-gold">{formatPrice(product.price)}</span>
            </div>
            <div className="mt-auto flex gap-2 pt-4">
              <button
                onClick={() => {
                  addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], brand: product.brand?.name ?? "", size: product.size });
                  toast.success(`${product.name} added to cart`);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-espresso py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
              <button
                onClick={() => { wishlistToggle(product.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
                className={cn("grid h-11 w-11 place-items-center rounded-lg border transition", wished ? "border-red-600 text-red-600" : "border-border hover:border-gold")}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-square">
        <Image src={product.images[0]} alt={product.name} fill sizes="50vw" className="object-cover" />
      </div>
      <div className="p-3">
        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{product.brand?.name}</p>
        <p className="font-serif text-sm font-medium leading-tight">{product.name}</p>
        <p className="mt-1 text-xs font-semibold text-gold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
