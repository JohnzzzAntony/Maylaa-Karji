"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  { icon: Sparkles, text: "12% OFF Until July 4 — Use Code JULY4 at Checkout" },
  { icon: Sparkles, text: "Complimentary Worldwide Shipping on Orders Over Dhs. 500" },
  { icon: Sparkles, text: "Authenticity Guaranteed · 30-Day Returns · Secure Payment" },
];

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (closed) return null;
  const M = messages[idx];

  return (
    <div className="relative z-40 bg-espresso text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <M.icon size={13} className="text-gold" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em]">{M.text}</span>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => setClosed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-3 grid h-6 w-6 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
