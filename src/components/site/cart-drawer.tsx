"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { X, Minus, Plus, ShoppingBag, Trash2, Lock, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIP_THRESHOLD = 500;

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQty, subtotal, clear } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [done, setDone] = useState(false);

  const sub = subtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD || sub === 0 ? 0 : 35;
  const total = sub + shipping;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - sub);

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "guest@scentgrade.com",
          customerName: "Guest",
          items,
          subtotal: sub,
          shipping,
          total,
          address: {},
        }),
      });
      if (res.ok) {
        setDone(true);
        clear();
        toast.success("Order confirmed! A confirmation has been sent.");
        setTimeout(() => {
          setDone(false);
          setOpen(false);
        }, 3000);
      }
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              <ShoppingBag size={18} className="text-gold" /> Your Cart
              <span className="text-sm font-sans font-normal text-muted-foreground">({items.length})</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="grid h-20 w-20 place-items-center rounded-full bg-emerald-deep/10">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-deep">
                <motion.path d="M20 6L9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
              </svg>
            </motion.div>
            <h3 className="font-serif text-2xl">Order Confirmed</h3>
            <p className="text-sm text-muted-foreground">Thank you for your purchase. Your fragrances are on their way.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-cream">
              <ShoppingBag size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Discover your next signature scent.</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-espresso px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            {remaining > 0 ? (
              <div className="border-b border-border bg-cream/50 px-5 py-3">
                <p className="flex items-center gap-1.5 text-xs text-foreground">
                  <Truck size={14} className="text-gold" />
                  Add <span className="font-semibold text-gold">{formatPrice(remaining)}</span> for free shipping
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (sub / FREE_SHIP_THRESHOLD) * 100)}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            ) : (
              <div className="border-b border-border bg-emerald-deep/5 px-5 py-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-deep">
                  <Truck size={14} /> You&apos;ve unlocked complimentary shipping!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-luxury px-5 py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex gap-3 border-b border-border pb-4 mb-4 last:border-0"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.brand}</p>
                          <h4 className="font-serif text-base leading-tight">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.size}ml</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground transition hover:text-red-600" aria-label="Remove">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Decrease">
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Increase">
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="border-t border-border bg-cream/30 px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-serif text-xl font-semibold text-gold">{formatPrice(total)}</span>
              </div>
              <button
                onClick={checkout}
                disabled={checkingOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-espresso py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold disabled:opacity-60"
              >
                {checkingOut ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Secure Checkout
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Lock size={11} /> Secure</span>
                <span className="flex items-center gap-1"><Truck size={11} /> Fast Delivery</span>
                <span className="flex items-center gap-1"><RotateCcw size={11} /> 30-Day Returns</span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
