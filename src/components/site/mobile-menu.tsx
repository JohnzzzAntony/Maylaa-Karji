"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, ChevronRight } from "lucide-react";
import { useState } from "react";

const SECTIONS = [
  { title: "Shop All", sub: ["Oud & Amber", "Floral", "Woody", "Oriental Spicy", "Fresh Citrus"] },
  { title: "New Arrivals" },
  { title: "Exclusive" },
  { title: "Bestsellers" },
  { title: "Artisanal" },
  { title: "Brands" },
  { title: "Gift Cards" },
  { title: "The Scent Journal" },
];

export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>("Shop All");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-xs border-r border-border bg-background p-0 sm:max-w-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-gold">
              <span className="font-serif text-base font-bold text-gold">SG</span>
            </div>
            <span className="font-serif text-lg font-semibold">The House Of Karji</span>
          </div>
        </div>
        <nav className="px-2 py-3">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <button
                onClick={() => setExpanded(expanded === s.title ? null : s.title)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground transition hover:bg-cream"
              >
                {s.title}
                {s.sub && <ChevronRight size={16} className={`transition ${expanded === s.title ? "rotate-90" : ""}`} />}
              </button>
              {s.sub && expanded === s.title && (
                <div className="ml-3 border-l border-border pl-3">
                  {s.sub.map((x) => (
                    <a key={x} href="#" className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-gold">
                      {x}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
