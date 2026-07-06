"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, X, Mail, Gift, Check } from "lucide-react";
import { toast } from "sonner";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem("sg-newsletter-dismissed");
    if (dismissed) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setTimeout(() => setOpen(true), 400);
    };

    // Exit-intent (desktop)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    // Timed fallback (mobile / no exit-intent)
    const timer = setTimeout(trigger, 20000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const close = () => {
    setOpen(false);
    localStorage.setItem("sg-newsletter-dismissed", "1");
  };

  const submit = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setDone(true);
      setTimeout(close, 2500);
    } catch {
      toast.error("Subscription failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent className="max-w-3xl overflow-hidden border-0 p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Newsletter signup — 10% off</DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Image side */}
          <div className="relative hidden md:block">
            <img src="/images/hero/hero-main.jpg" alt="Luxury fragrances" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <Sparkles size={20} className="text-gold" />
              <p className="mt-2 font-serif text-2xl leading-tight">Join the inner circle of fragrance connoisseurs.</p>
            </div>
          </div>

          {/* Content side */}
          <div className="relative flex flex-col justify-center p-8 lg:p-10">
            <button onClick={close} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent" aria-label="Close">
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="grid h-16 w-16 place-items-center rounded-full bg-emerald-deep/10">
                    <Check size={28} className="text-emerald-deep" />
                  </motion.div>
                  <h3 className="mt-4 font-serif text-2xl font-semibold">Welcome to The House Of Karji</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Check your inbox for your 10% off code.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold">
                    <Gift size={12} /> Exclusive Offer
                  </span>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">Enjoy 10% Off<br />Your First Order</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Subscribe for early access to new arrivals, private sales, and fragrance education. Plus, a complimentary 10% off code delivered to your inbox.
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold"
                      />
                    </div>
                    <button onClick={submit} className="rounded-lg bg-espresso px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold">
                      Claim 10%
                    </button>
                  </div>
                  <button onClick={close} className="mt-4 text-[11px] text-muted-foreground underline transition hover:text-foreground">
                    No thanks, I&apos;ll pay full price
                  </button>
                  <p className="mt-3 text-[10px] text-muted-foreground">By subscribing you agree to our Privacy Policy. Unsubscribe anytime.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
