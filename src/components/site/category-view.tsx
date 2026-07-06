"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ChevronRight, SlidersHorizontal, X, ChevronDown, Check, LayoutGrid } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string; description: string; image: string };

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

const GENDERS = ["Unisex", "Feminine", "Masculine"];

export function CategoryView({
  category,
  products,
  onBack,
  onQuickView,
  onViewProduct,
  onNavigateCategory,
  allCategories,
}: {
  category: Category;
  products: SerializedProduct[];
  onBack: () => void;
  onQuickView: (p: SerializedProduct) => void;
  onViewProduct: (p: SerializedProduct) => void;
  onNavigateCategory: (slug: string) => void;
  allCategories: Category[];
}) {
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(1500);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = (() => {
    let list = products.filter((p) => {
      if (selectedGenders.length && !selectedGenders.includes(p.gender)) return false;
      if (p.price > priceMax) return false;
      return true;
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
  })();

  const toggleGender = (g: string) => setSelectedGenders((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  const activeCount = selectedGenders.length + (priceMax < 1500 ? 1 : 0);
  const clearAll = () => { setSelectedGenders([]); setPriceMax(1500); };

  const renderFilters = () => (
    <div className="space-y-7">
      <div className="border-b border-border pb-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground">Categories</p>
        <div className="space-y-1.5">
          {allCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onNavigateCategory(c.slug)}
              className={cn(
                "block w-full text-left text-sm transition hover:text-gold",
                c.slug === category.slug ? "font-semibold text-gold" : "text-foreground/70"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="border-b border-border pb-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground">Gender</p>
        <div className="space-y-2">
          {GENDERS.map((g) => (
            <button key={g} onClick={() => toggleGender(g)} className="flex w-full items-center gap-2.5 text-left">
              <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded border transition", selectedGenders.includes(g) ? "border-gold bg-gold text-white" : "border-border")}>
                {selectedGenders.includes(g) && <Check size={11} />}
              </span>
              <span className="text-sm text-foreground/80">{g}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground">Max Price</p>
        <input type="range" min={500} max={1500} step={50} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[var(--gold)]" />
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Dhs. 500</span>
          <span className="font-semibold text-foreground">Dhs. {priceMax}</span>
        </div>
      </div>
      {activeCount > 0 && (
        <button onClick={clearAll} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition hover:underline">
          <X size={13} /> Clear All ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <Image src={category.image} alt={category.name} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-espresso/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <nav className="mb-3 flex items-center justify-center gap-2 text-[11px] text-white/60">
              <button onClick={onBack} className="hover:text-gold">Home</button>
              <ChevronRight size={11} />
              <span className="text-white">{category.name}</span>
            </nav>
            <h1 className="font-serif text-5xl font-semibold sm:text-6xl">{category.name}</h1>
            <p className="mt-2 max-w-md text-sm text-white/70">{category.description}</p>
            <p className="mt-3 text-xs text-gold">{products.length} fragrances in this collection</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-gold">
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-24">
              <div className="mb-5 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-gold" />
                <h2 className="font-serif text-lg font-medium">Filters</h2>
              </div>
              {renderFilters()}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-3">
              <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition hover:border-gold lg:hidden">
                <SlidersHorizontal size={14} /> Filters
                {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] text-white">{activeCount}</span>}
              </button>
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> products</p>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="appearance-none rounded-lg border border-border bg-background py-2 pl-4 pr-9 text-xs font-medium uppercase tracking-wider outline-none transition focus:border-gold">
                  {SORTS.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <LayoutGrid size={32} className="text-muted-foreground/40" />
                <p className="font-serif text-xl">No fragrances match your filters</p>
                <button onClick={clearAll} className="text-sm font-semibold uppercase tracking-wider text-gold hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} onQuickView={onQuickView} onViewProduct={onViewProduct} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-espresso/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-background p-6 scrollbar-luxury">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent" aria-label="Close filters"><X size={18} /></button>
            </div>
            {renderFilters()}
            <button onClick={() => setMobileFiltersOpen(false)} className="mt-6 w-full rounded-lg bg-espresso py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold">Show {filtered.length} Results</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
