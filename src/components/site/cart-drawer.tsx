"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Trash2, Plus, Minus, Lock, Truck, RotateCcw, ChevronRight, Tag, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart, useAuth } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const FREE_SHIP_THRESHOLD = 500;

export function CartDrawer({
  promos = [],
  bogoOffers = [],
  onProceedToCheckout,
}: {
  promos?: { id: string; code: string; type: string; value: number; minSpend: number }[];
  bogoOffers?: any[];
  onProceedToCheckout?: (promo: any | null) => void;
}) {
  const { items, isOpen, setOpen, removeItem, updateQty, subtotal, clear } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: string; value: number; minSpend: number } | null>(null);

  const sub = subtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD || sub === 0 ? 0 : 35;

  // Calculate BOGO discounts
  const bogoDiscount = useMemo(() => {
    let discount = 0;
    const now = new Date();
    const activeBogoOffers = (bogoOffers || []).filter((o) => {
      const start = o.startsAt ? new Date(o.startsAt) : null;
      const end = o.endsAt ? new Date(o.endsAt) : null;
      return (!start || now >= start) && (!end || now <= end);
    });

    activeBogoOffers.forEach((offer) => {
      let pIds: string[] = [];
      let bIds: string[] = [];
      let gIds: string[] = [];
      try { pIds = typeof offer.productIds === "string" ? JSON.parse(offer.productIds) : offer.productIds || []; } catch {}
      try { bIds = typeof offer.buyProductIds === "string" ? JSON.parse(offer.buyProductIds) : offer.buyProductIds || []; } catch {}
      try { gIds = typeof offer.getProductIds === "string" ? JSON.parse(offer.getProductIds) : offer.getProductIds || []; } catch {}

      if (!offer.isCrossProduct) {
        items.forEach((item) => {
          const matches = pIds.length === 0 || pIds.includes(item.id);
          if (matches) {
            const bundleSize = offer.buyQty + offer.getQty;
            const times = Math.floor(item.quantity / bundleSize);
            if (times > 0) {
              const discountQty = Math.min(times * offer.getQty, offer.maxQty > 0 ? offer.maxQty : Infinity);
              discount += discountQty * item.price * (offer.discountPct / 100);
            }
          }
        });
      } else {
        const buyQtyInCart = items
          .filter((item) => bIds.includes(item.id))
          .reduce((sum, item) => sum + item.quantity, 0);

        const times = Math.floor(buyQtyInCart / offer.buyQty);
        if (times > 0) {
          let maxGetQty = Math.min(times * offer.getQty, offer.maxQty > 0 ? offer.maxQty : Infinity);
          const getItemsInCart = [...items]
            .filter((item) => gIds.includes(item.id))
            .sort((a, b) => a.price - b.price);

          for (const item of getItemsInCart) {
            if (maxGetQty <= 0) break;
            const qtyToDiscount = Math.min(item.quantity, maxGetQty);
            discount += qtyToDiscount * item.price * (offer.discountPct / 100);
            maxGetQty -= qtyToDiscount;
          }
        }
      }
    });

    return discount;
  }, [items, bogoOffers]);

  let promoDiscount = 0;
  if (appliedPromo) {
    const remainingSub = Math.max(0, sub - bogoDiscount);
    if (appliedPromo.type === "percent") promoDiscount = (remainingSub * appliedPromo.value) / 100;
    else if (appliedPromo.type === "fixed") promoDiscount = Math.min(appliedPromo.value, remainingSub);
    else if (appliedPromo.type === "shipping") promoDiscount = shipping;
  }

  const discount = bogoDiscount + promoDiscount;
  const total = Math.max(0, sub + shipping - discount);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - sub);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const promo = promos.find((p) => p.code.toUpperCase() === code);
    if (!promo) { toast.error("Invalid promo code"); return; }
    if (sub < promo.minSpend) { toast.error("Minimum spend of " + formatPrice(promo.minSpend) + " required"); return; }
    setAppliedPromo(promo);
    toast.success("Promo " + promo.code + " applied!");
  };

  const handleCheckoutClick = () => {
    setOpen(false);
    if (onProceedToCheckout) {
      onProceedToCheckout(appliedPromo);
    }
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => { setAppliedPromo(null); setCouponCode(""); }, 300);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => { if (!v) close(); }}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              <ShoppingBag size={18} className="text-gold" />
              Your Cart <span className="text-sm font-sans font-normal text-muted-foreground">({items.length})</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary"><ShoppingBag size={28} className="text-muted-foreground" /></div>
            <h3 className="font-serif text-xl">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Discover your next signature scent.</p>
            <button onClick={close} className="rounded-lg bg-espresso px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold cursor-pointer">Continue Shopping</button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Free shipping progress */}
            {remaining > 0 ? (
              <div className="border-b border-border bg-secondary/30 px-5 py-3">
                <p className="flex items-center gap-1.5 text-xs text-foreground"><Truck size={14} className="text-gold" /> Add <span className="font-semibold text-gold">{formatPrice(remaining)}</span> for free shipping</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: Math.min(100, (sub / FREE_SHIP_THRESHOLD) * 100) + "%" }} transition={{ duration: 0.4 }} /></div>
              </div>
            ) : (
              <div className="border-b border-border bg-emerald-50 px-5 py-3"><p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700"><Truck size={14} /> You&apos;ve unlocked complimentary shipping!</p></div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-luxury px-5 py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-3 border-b border-border pb-4 mb-4 last:border-0">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" /></div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div><p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.brand}</p><h4 className="font-serif text-base leading-tight">{item.name}</h4><p className="text-xs text-muted-foreground">{item.size}ml</p></div>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground transition hover:text-red-600 cursor-pointer" aria-label="Remove"><Trash2 size={15} /></button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border"><button onClick={() => updateQty(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center text-muted-foreground transition hover:text-foreground cursor-pointer" aria-label="Decrease"><Minus size={13} /></button><span className="w-8 text-center text-xs font-semibold">{item.quantity}</span><button onClick={() => updateQty(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center text-muted-foreground transition hover:text-foreground cursor-pointer" aria-label="Increase"><Plus size={13} /></button></div>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="border-t border-border bg-secondary/30 px-5 py-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1"><Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCoupon()} placeholder="Promo code" className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm uppercase outline-none transition focus:border-gold" /></div>
                <button onClick={applyCoupon} className="rounded-lg border border-border px-4 text-xs font-semibold uppercase tracking-wider transition hover:border-gold hover:text-gold cursor-pointer">Apply</button>
              </div>
              {appliedPromo && (<div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs"><span className="flex items-center gap-1.5 font-medium text-emerald-700"><Check size={13} /> {appliedPromo.code} applied</span><button onClick={() => { setAppliedPromo(null); setCouponCode(""); }} className="text-emerald-700/60 hover:text-emerald-700 cursor-pointer"><X size={13} /></button></div>)}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPrice(sub)}</span></div>
              {bogoDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700">
                  <span>BOGO Offer Discount</span>
                  <span className="font-medium">-{formatPrice(bogoDiscount)}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span className="font-medium">-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between border-t border-border pt-3 text-base"><span className="font-semibold">Total</span><span className="font-serif text-xl font-semibold text-gold">{formatPrice(total)}</span></div>
              <button onClick={handleCheckoutClick} className="flex w-full items-center justify-center gap-2 rounded-lg bg-espresso py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold cursor-pointer">Proceed to Checkout <ChevronRight size={15} /></button>
              <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><Lock size={11} /> Secure</span><span className="flex items-center gap-1"><Truck size={11} /> Fast Delivery</span><span className="flex items-center gap-1"><RotateCcw size={11} /> 30-Day Returns</span></div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
