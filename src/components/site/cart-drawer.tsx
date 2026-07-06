"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { X, Minus, Plus, ShoppingBag, Trash2, Lock, Truck, RotateCcw, Tag, Check, ChevronRight, ChevronLeft, CreditCard, MapPin, User, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIP_THRESHOLD = 500;

type Step = "cart" | "shipping" | "payment" | "done";

export function CartDrawer({ promos = [] }: { promos?: { id: string; code: string; type: string; value: number; minSpend: number }[] }) {
  const { items, isOpen, setOpen, removeItem, updateQty, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: string; value: number; minSpend: number } | null>(null);
  const [shippingForm, setShippingForm] = useState({ name: "", email: "", phone: "", address: "", city: "", country: "United Arab Emirates", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [placing, setPlacing] = useState(false);

  const sub = subtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD || sub === 0 ? 0 : 35;
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
    if (!promo) { toast.error("Invalid promo code"); return; }
    if (sub < promo.minSpend) { toast.error("Minimum spend of " + formatPrice(promo.minSpend) + " required"); return; }
    setAppliedPromo(promo);
    toast.success("Promo " + promo.code + " applied!");
  };

  const validateShipping = () => {
    if (!shippingForm.name.trim()) { toast.error("Name is required"); return false; }
    if (!shippingForm.email.trim() || !shippingForm.email.includes("@")) { toast.error("Valid email is required"); return false; }
    if (!shippingForm.address.trim()) { toast.error("Address is required"); return false; }
    if (!shippingForm.city.trim()) { toast.error("City is required"); return false; }
    return true;
  };

  const placeOrder = async () => {
    if (!validateShipping()) return;
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: shippingForm.email,
          customerName: shippingForm.name,
          items,
          subtotal: sub,
          shipping,
          total,
          address: { ...shippingForm, paymentMethod },
        }),
      });
      if (res.ok) {
        setStep("done");
        clear();
        toast.success("Order confirmed! A confirmation has been sent to " + shippingForm.email);
      }
    } catch {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => { setStep("cart"); setAppliedPromo(null); setCouponCode(""); }, 300);
  };

  const setField = (k: string, v: string) => setShippingForm((f) => ({ ...f, [k]: v }));

  return (
    <Sheet open={isOpen} onOpenChange={(v) => { if (!v) close(); }}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              <ShoppingBag size={18} className="text-gold" />
              {step === "cart" && <>Your Cart <span className="text-sm font-sans font-normal text-muted-foreground">({items.length})</span></>}
              {step === "shipping" && "Shipping Details"}
              {step === "payment" && "Payment"}
              {step === "done" && "Order Confirmed"}
            </SheetTitle>
          </div>
          {/* Step indicator */}
          {step !== "done" && (
            <div className="mt-3 flex items-center gap-2">
              {["cart", "shipping", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={"grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold " + (step === s ? "bg-gold text-white" : step === "cart" && s !== "cart" ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground")}>
                    {i + 1}
                  </div>
                  {i < 2 && <div className="h-px w-8 bg-border" />}
                </div>
              ))}
            </div>
          )}
        </SheetHeader>

        <AnimatePresence mode="wait">
          {step === "done" ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
                <Check size={36} className="text-emerald-600" />
              </motion.div>
              <h3 className="font-serif text-2xl">Order Confirmed!</h3>
              <p className="text-sm text-muted-foreground">Thank you, {shippingForm.name}! Your fragrances are on their way. A confirmation has been sent to {shippingForm.email}.</p>
              <div className="mt-2 rounded-xl border border-border bg-secondary/50 p-4 text-left text-sm">
                <p className="flex justify-between"><span className="text-muted-foreground">Order Total</span><span className="font-semibold text-gold">{formatPrice(total)}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Shipping to</span><span className="font-medium">{shippingForm.city}, {shippingForm.country}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Estimated Delivery</span><span className="font-medium">3-5 business days</span></p>
              </div>
              <button onClick={close} className="mt-4 rounded-lg bg-espresso px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold">Continue Shopping</button>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary"><ShoppingBag size={28} className="text-muted-foreground" /></div>
              <h3 className="font-serif text-xl">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Discover your next signature scent.</p>
              <button onClick={close} className="rounded-lg bg-espresso px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold">Continue Shopping</button>
            </motion.div>
          ) : step === "cart" ? (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col">
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
                          <button onClick={() => removeItem(item.id)} className="text-muted-foreground transition hover:text-red-600" aria-label="Remove"><Trash2 size={15} /></button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-border"><button onClick={() => updateQty(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Decrease"><Minus size={13} /></button><span className="w-8 text-center text-xs font-semibold">{item.quantity}</span><button onClick={() => updateQty(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Increase"><Plus size={13} /></button></div>
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
                  <button onClick={applyCoupon} className="rounded-lg border border-border px-4 text-xs font-semibold uppercase tracking-wider transition hover:border-gold hover:text-gold">Apply</button>
                </div>
                {appliedPromo && (<div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs"><span className="flex items-center gap-1.5 font-medium text-emerald-700"><Check size={13} /> {appliedPromo.code} applied</span><button onClick={() => { setAppliedPromo(null); setCouponCode(""); }} className="text-emerald-700/60 hover:text-emerald-700"><X size={13} /></button></div>)}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPrice(sub)}</span></div>
                {discount > 0 && (<div className="flex justify-between text-sm text-emerald-700"><span>Discount</span><span className="font-medium">-{formatPrice(discount)}</span></div>)}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-base"><span className="font-semibold">Total</span><span className="font-serif text-xl font-semibold text-gold">{formatPrice(total)}</span></div>
                <button onClick={() => setStep("shipping")} className="flex w-full items-center justify-center gap-2 rounded-lg bg-espresso py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold">Checkout <ChevronRight size={15} /></button>
                <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><Lock size={11} /> Secure</span><span className="flex items-center gap-1"><Truck size={11} /> Fast Delivery</span><span className="flex items-center gap-1"><RotateCcw size={11} /> 30-Day Returns</span></div>
              </div>
            </motion.div>
          ) : step === "shipping" ? (
            <motion.div key="shipping" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-1 flex-col">
              <div className="flex-1 overflow-y-auto scrollbar-luxury px-5 py-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground"><MapPin size={16} className="text-gold" /> Shipping Address</div>
                <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={shippingForm.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full name *" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" /></div>
                <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={shippingForm.email} onChange={(e) => setField("email", e.target.value)} type="email" placeholder="Email address *" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" /></div>
                <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={shippingForm.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="Phone number" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" /></div>
                <input value={shippingForm.address} onChange={(e) => setField("address", e.target.value)} placeholder="Street address *" className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-gold" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={shippingForm.city} onChange={(e) => setField("city", e.target.value)} placeholder="City *" className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-gold" />
                  <input value={shippingForm.zip} onChange={(e) => setField("zip", e.target.value)} placeholder="Postal code" className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-gold" />
                </div>
                <select value={shippingForm.country} onChange={(e) => setField("country", e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-gold">
                  {["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "United Kingdom", "United States", "France", "Germany", "Italy", "Spain", "Switzerland", "Japan", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 font-medium text-foreground"><Truck size={13} className="text-gold" /> Delivery Information</p>
                  <p className="mt-1">UAE: 3-5 business days · International: 5-10 business days</p>
                  <p className="mt-0.5">Free shipping on orders over Dhs. 500 · All shipments fully insured</p>
                </div>
              </div>
              <div className="border-t border-border bg-secondary/30 px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-serif text-lg font-semibold text-gold">{formatPrice(total)}</span></div>
                <div className="flex gap-2">
                  <button onClick={() => setStep("cart")} className="flex items-center gap-1 rounded-lg border border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition hover:bg-secondary"><ChevronLeft size={14} /> Back</button>
                  <button onClick={() => validateShipping() && setStep("payment")} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-espresso py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold">Continue to Payment <ChevronRight size={15} /></button>
                </div>
              </div>
            </motion.div>
          ) : step === "payment" ? (
            <motion.div key="payment" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-1 flex-col">
              <div className="flex-1 overflow-y-auto scrollbar-luxury px-5 py-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground"><CreditCard size={16} className="text-gold" /> Payment Method</div>
                {[
                  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
                  { id: "applepay", label: "Apple Pay", sub: "Fast, secure checkout" },
                  { id: "googlepay", label: "Google Pay", sub: "Fast, secure checkout" },
                  { id: "paypal", label: "PayPal", sub: "Pay with your PayPal account" },
                ].map((m) => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={"flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition " + (paymentMethod === m.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50")}>
                    <div className={"grid h-5 w-5 place-items-center rounded-full border-2 " + (paymentMethod === m.id ? "border-gold" : "border-border")}>{paymentMethod === m.id && <div className="h-2.5 w-2.5 rounded-full bg-gold" />}</div>
                    <div className="flex-1"><p className="text-sm font-medium">{m.label}</p><p className="text-xs text-muted-foreground">{m.sub}</p></div>
                  </button>
                ))}
                <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><Lock size={13} className="text-gold" /> Your payment is secured with 256-bit SSL encryption. We never store your card details.</p>
                </div>
                {/* Order summary */}
                <div className="rounded-xl border border-border p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Order Summary</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({items.length} items)</span><span>{formatPrice(sub)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount ({appliedPromo?.code})</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                    <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Total</span><span className="text-gold">{formatPrice(total)}</span></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border bg-secondary/30 px-5 py-4 space-y-3">
                <div className="flex gap-2">
                  <button onClick={() => setStep("shipping")} className="flex items-center gap-1 rounded-lg border border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition hover:bg-secondary"><ChevronLeft size={14} /> Back</button>
                  <button onClick={placeOrder} disabled={placing} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-espresso py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold disabled:opacity-60">
                    {placing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Processing...</> : <><Lock size={15} /> Place Order · {formatPrice(total)}</>}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
