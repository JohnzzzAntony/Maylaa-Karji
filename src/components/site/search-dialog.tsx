"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, X, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

type Result = { id: string; name: string; slug: string; price: number; image: string; brand: string; rating: number };

const SUGGESTIONS = ["Oud", "Rose", "Amber", "Saffron", "Vanilla", "Citrus", "Leather", "Jasmine"];

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    else {
      setQ("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search fragrances</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search size={20} className="text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for fragrances, notes, brands..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-gold" />}
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-luxury">
          {!q.trim() ? (
            <div className="p-5">
              <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <TrendingUp size={13} className="text-gold" /> Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-full border border-border bg-cream px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-gold hover:text-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <p className="font-serif text-lg">No results for &ldquo;{q}&rdquo;</p>
              <p className="text-sm text-muted-foreground">Try searching for a fragrance family or note.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {results.map((r, i) => (
                <motion.a
                  key={r.id}
                  href="#"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-4 px-5 py-3 transition hover:bg-cream"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <Image src={r.image} alt={r.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.brand}</p>
                    <p className="font-serif text-base leading-tight">{r.name}</p>
                    <p className="text-xs text-muted-foreground">★ {r.rating.toFixed(1)}</p>
                  </div>
                  <span className="font-semibold text-gold">{formatPrice(r.price)}</span>
                </motion.a>
              ))}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
