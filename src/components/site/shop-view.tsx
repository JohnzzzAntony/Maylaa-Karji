"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Check, ArrowLeft, LayoutGrid } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { ProductCard as ProductCardComp } from "./product-card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Brand = { id: string; name: string; slug: string; country: string };
type Category = { id: string; name: string; slug: string; description: string; image: string };

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

const GENDERS = ["Unisex", "Feminine", "Masculine"];

export function ShopView({
  products,
  brands,
  categories,
  onQuickView,
  onBack,
}: {
  products: SerializedProduct[];
  brands: Brand[];
  categories: Category[];
  onQuickView: (p: SerializedProduct) => void;
  onBack: () => void;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(1500);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand?.slug ?? "")) return false;
      if (selectedCats.length && !selectedCats.includes(p.category?.slug ?? "")) return false;
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
  }, [products, selectedBrands, selectedCats, selectedGenders, priceMax, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const activeCount = selectedBrands.length + selectedCats.length + selectedGenders.length + (priceMax < 1500 ? 1 : 0);

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCats([]);
    setSelectedGenders([]);
    setPriceMax(1500);
  };

  const renderFilters = () => (
    <div className="space-y-7">
      <FilterGroup title="Brand">
        {brands.map((b) => (
          <CheckOption
            key={b.slug}
            label={b.name}
            sub={b.country}
            checked={selectedBrands.includes(b.slug)}
            onChange={() => toggle(selectedBrands, setSelectedBrands, b.slug)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Fragrance Family">
        {categories.map((c) => (
          <CheckOption
            key={c.slug}
            label={c.name}
            checked={selectedCats.includes(c.slug)}
            onChange={() => toggle(selectedCats, setSelectedCats, c.slug)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Gender">
        {GENDERS.map((g) => (
          <CheckOption
            key={g}
            label={g}
            checked={selectedGenders.includes(g)}
            onChange={() => toggle(selectedGenders, setSelectedGenders, g)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Max Price">
        <div className="px-1">
          <input
            type="range"
            min={500}
            max={1500}
            step={50}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
          <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(500)}</span>
            <span className="font-semibold text-foreground">{formatPrice(priceMax)}</span>
          </div>
        </div>
      </FilterGroup>
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition hover:underline"
        >
          <X size={13} /> Clear All ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6">
        <button
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-gold"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">The Full Atelier</span>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Shop All Fragrances</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Explore our complete collection of curated luxury fragrances — {products.length} scents from {brands.length} maisons, each authenticated and hand-selected.
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
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
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition hover:border-gold lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
              {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] text-white">{activeCount}</span>}
            </button>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> products
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none rounded-lg border border-border bg-background py-2 pl-4 pr-9 text-xs font-medium uppercase tracking-wider outline-none transition focus:border-gold"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <LayoutGrid size={32} className="text-muted-foreground/40" />
              <p className="font-serif text-xl">No fragrances match your filters</p>
              <button onClick={clearAll} className="text-sm font-semibold uppercase tracking-wider text-gold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCardComp key={p.id} product={p} onQuickView={onQuickView} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-espresso/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-background p-6 scrollbar-luxury"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent" aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>
              {renderFilters()}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-6 w-full rounded-lg bg-espresso py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"
              >
                Show {filtered.length} Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground">{title}</span>
        <ChevronDown size={14} className={cn("text-muted-foreground transition", !open && "-rotate-90")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckOption({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex w-full items-center gap-2.5 text-left">
      <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded border transition", checked ? "border-gold bg-gold text-white" : "border-border")}>
        {checked && <Check size={11} />}
      </span>
      <span className="flex-1 text-sm text-foreground/80">
        {label}
        {sub && <span className="ml-1.5 text-[11px] text-muted-foreground">· {sub}</span>}
      </span>
    </button>
  );
}
