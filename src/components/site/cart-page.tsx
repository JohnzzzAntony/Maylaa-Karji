"use client";

import { useCart } from "@/lib/cart-store";
import { Minus, Plus, Trash2, ArrowRight, Tag, Check, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const FREE_SHIP_THRESHOLD = 500;

export function CartPage({
  promos = [],
  onBack,
  onCheckout,
}: {
  promos?: { id: string; code: string; type: string; value: number; minSpend: number }[];
  onBack: () => void;
  onCheckout: (appliedPromo: any) => void;
}) {
  const { items, removeItem, updateQty, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: string; value: number; minSpend: number } | null>(null);

  const sub = subtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD || sub === 0 ? 0 : 30;
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") discount = (sub * appliedPromo.value) / 100;
    else if (appliedPromo.type === "fixed") discount = Math.min(appliedPromo.value, sub);
    else if (appliedPromo.type === "shipping") discount = shipping;
  }
  const total = Math.max(0, sub + shipping - discount);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - sub);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const promo = promos.find((p) => p.code.toUpperCase() === code);
    if (!promo) {
      toast.error("Invalid promo code");
      return;
    }
    if (sub < promo.minSpend) {
      toast.error("Minimum spend of " + formatPrice(promo.minSpend) + " required");
      return;
    }
    setAppliedPromo(promo);
    toast.success(`Promo code "${promo.code}" applied successfully!`);
  };

  const removeCoupon = () => {
    setAppliedPromo(null);
    setCouponCode("");
    toast.info("Promo code removed");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-stone-50 text-stone-400">
          <ShoppingBag size={28} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-stone-900">Your Shopping Bag is Empty</h1>
        <p className="mt-2 text-stone-500">Discover our collection of premium perfumes, luxury watches and gifts.</p>
        <button
          onClick={onBack}
          className="mt-8 rounded-lg bg-stone-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-stone-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft size={14} /> Continue Shopping
      </button>

      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Shopping Bag</h1>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-5 sm:gap-6">
                <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-stone-50 border border-stone-100 sm:w-24">
                  <Image src={item.image} alt={item.name} fill sizes="(max-w-768px) 80px, 96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">{item.brand}</p>
                      <h3 className="font-serif text-base font-medium text-stone-950 mt-0.5">{item.name}</h3>
                      <p className="mt-1 text-xs text-stone-500">{item.size}ml · Eau de Parfum</p>
                    </div>
                    <p className="font-serif text-base font-semibold text-stone-950">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-1">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="grid h-6 w-6 place-items-center rounded text-stone-500 transition hover:bg-white hover:text-stone-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-stone-850">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="grid h-6 w-6 place-items-center rounded text-stone-500 transition hover:bg-white hover:text-stone-900"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-stone-400 transition hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Free Shipping Banner */}
          {remaining > 0 ? (
            <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-amber-800">
                Add <span className="font-bold">{formatPrice(remaining)}</span> more to qualify for <span className="font-bold">Free Premium Delivery</span>.
              </p>
              <div className="h-1.5 w-full sm:w-48 rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(sub / FREE_SHIP_THRESHOLD) * 100}%` }} />
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4 text-xs text-emerald-800 font-medium">
              🎉 Congratulations! Your order qualifies for free premium shipping.
            </div>
          )}
        </div>

        {/* Order Summary card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-4">Order Summary</h2>

            {/* Promo code */}
            <div className="mt-5 border-b border-stone-100 pb-5">
              <label htmlFor="promo" className="text-xs font-semibold uppercase tracking-wider text-stone-400">Apply Promo Code</label>
              {appliedPromo ? (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-800">
                  <span className="flex items-center gap-1.5 font-bold"><Tag size={13} /> {appliedPromo.code}</span>
                  <button onClick={removeCoupon} className="text-[11px] font-semibold text-stone-500 hover:text-stone-900">Remove</button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    id="promo"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. KARJI10)"
                    className="flex-1 rounded-lg border border-stone-200 bg-background px-3 py-2.5 text-xs uppercase tracking-wider outline-none focus:border-stone-400"
                  />
                  <button
                    onClick={applyCoupon}
                    className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-stone-700"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price lines */}
            <div className="mt-5 space-y-3.5 border-b border-stone-100 pb-5 text-sm text-stone-650">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-medium text-stone-900">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-serif font-medium text-stone-900">
                  {shipping === 0 ? <span className="text-emerald-600 font-semibold uppercase text-xs">Free</span> : formatPrice(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-serif">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-base font-bold text-stone-950 pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout buttons */}
            <button
              onClick={() => onCheckout(appliedPromo)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-700"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            {/* Badges */}
            <div className="mt-6 space-y-3 text-xs text-stone-400">
              <p className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> 100% Authentic Luxury Guarantee</p>
              <p className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Free Premium Shipping inside UAE</p>
              <p className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Easy 14-day Exchanges & Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
