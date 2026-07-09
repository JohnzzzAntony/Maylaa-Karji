"use client";

import { useState } from "react";
import { useCart, useAuth } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { CreditCard, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Sparkles, AlertCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const FREE_SHIP_THRESHOLD = 500;

export function CheckoutPage({
  appliedPromo,
  guestEmail,
  onBack,
  onOrderSuccess,
}: {
  appliedPromo: { code: string; type: string; value: number; minSpend: number } | null;
  guestEmail: string;
  onBack: () => void;
  onOrderSuccess: (orderId: string) => void;
}) {
  const { items, subtotal: getSubtotal, clear } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "Dubai",
    country: "United Arab Emirates",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "tabby" | "tamara" | "network">("card");
  const [placing, setPlacing] = useState(false);

  // Card input states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const email = user?.email || guestEmail;
  const customerName = user ? user.name : `${form.firstName} ${form.lastName}`.trim();

  const sub = getSubtotal();
  const shipping = sub >= FREE_SHIP_THRESHOLD || sub === 0 ? 0 : 30;
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") discount = (sub * appliedPromo.value) / 100;
    else if (appliedPromo.type === "fixed") discount = Math.min(appliedPromo.value, sub);
    else if (appliedPromo.type === "shipping") discount = shipping;
  }
  const total = Math.max(0, sub + shipping - discount);

  // Tabby installment calculation (split in 4)
  const tabbyInstallment = total / 4;
  // Tamara installment calculation (split in 3)
  const tamaraInstallment = total / 3;

  const validate = () => {
    if (!email) {
      toast.error("Contact email is missing. Please restart checkout.");
      return false;
    }
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Please enter your first and last name.");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required.");
      return false;
    }
    if (!form.address.trim()) {
      toast.error("Shipping address is required.");
      return false;
    }

    if (paymentMethod === "card") {
      if (!cardName.trim()) {
        toast.error("Cardholder name is required.");
        return false;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid 16-digit card number.");
        return false;
      }
      if (!cardExpiry.includes("/")) {
        toast.error("Please enter expiry date (MM/YY).");
        return false;
      }
      if (cardCvv.length < 3) {
        toast.error("Please enter a valid CVV.");
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          customerName: customerName || "Guest Customer",
          items,
          subtotal: sub,
          shipping,
          total,
          address: {
            ...form,
            paymentMethod,
            cardName: paymentMethod === "card" ? cardName : undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Order placement failed. Please try again.");
        return;
      }

      toast.success("Order placed successfully!");
      clear();
      onOrderSuccess(data.orderId);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const setField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft size={14} /> Back to Bag
      </button>

      <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">Secure Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Customer Contact Info */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-stone-950 border-b border-stone-100 pb-4 mb-5">1. Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Email Address</label>
                <div className="rounded-lg bg-stone-50 border border-stone-200 px-4 py-3 text-sm text-stone-700 select-all font-mono">
                  {email}
                </div>
              </div>
              <div className="flex items-end pb-1">
                <p className="text-xs text-stone-400">
                  {user ? "Logged in with secure account" : "Checking out as guest"}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-stone-950 border-b border-stone-100 pb-4 mb-5">2. Shipping Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  placeholder="John"
                  className="w-full rounded-lg border border-stone-250 bg-background px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  placeholder="Doe"
                  className="w-full rounded-lg border border-stone-250 bg-background px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full rounded-lg border border-stone-250 bg-background px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Apartment, building, street, or villa number"
                  className="w-full rounded-lg border border-stone-250 bg-background px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Emirate / City</label>
                <select
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  className="w-full rounded-lg border border-stone-250 bg-background px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Country</label>
                <input
                  type="text"
                  value={form.country}
                  disabled
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-550"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-stone-950 border-b border-stone-100 pb-4 mb-5">3. Payment Method</h2>

            <div className="grid gap-3 sm:grid-cols-4">
              {/* Credit Card option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition ${paymentMethod === "card" ? "border-stone-900 bg-stone-50/50 text-stone-950 font-bold" : "border-stone-200 hover:bg-stone-50 text-stone-600"}`}
              >
                <CreditCard size={20} className="mb-2" />
                <span className="text-xs uppercase tracking-wider">Credit Card</span>
              </button>

              {/* Tabby option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("tabby")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition ${paymentMethod === "tabby" ? "border-[#3ADF00] bg-[#3ADF00]/5 text-stone-950 font-bold" : "border-stone-200 hover:bg-stone-50 text-stone-600"}`}
              >
                <div className="h-5 w-12 relative mb-2 flex items-center justify-center">
                  <span className="bg-[#3ADF00] text-black font-extrabold text-[10px] px-1 rounded">tabby</span>
                </div>
                <span className="text-xs uppercase tracking-wider">Tabby</span>
              </button>

              {/* Tamara option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("tamara")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition ${paymentMethod === "tamara" ? "border-[#EC864D] bg-[#EC864D]/5 text-stone-950 font-bold" : "border-stone-200 hover:bg-stone-50 text-stone-600"}`}
              >
                <div className="h-5 w-12 relative mb-2 flex items-center justify-center">
                  <span className="bg-[#2D2A26] text-[#EC864D] font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-[#EC864D]">tamara</span>
                </div>
                <span className="text-xs uppercase tracking-wider">Tamara</span>
              </button>

              {/* Network Pay option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("network")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition ${paymentMethod === "network" ? "border-amber-600 bg-amber-600/5 text-stone-950 font-bold" : "border-stone-200 hover:bg-stone-50 text-stone-600"}`}
              >
                <ShieldCheck size={20} className="mb-2 text-stone-700" />
                <span className="text-xs uppercase tracking-wider">Network Pay</span>
              </button>
            </div>

            {/* Payment Method Details Form Rendering */}
            <div className="mt-6 p-4 rounded-xl bg-stone-50/50 border border-stone-150">
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" /> Secure Card Payment (Network PG)
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
                          setCardNumber(val);
                        }}
                        placeholder="4111 2222 3333 4444"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setCardExpiry(val.length >= 2 ? `${val.slice(0, 2)}/${val.slice(2, 4)}` : val);
                        }}
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="123"
                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "tabby" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#3ADF00] text-black font-extrabold text-xs px-2 py-0.5 rounded">tabby</span>
                    <span className="text-xs text-stone-500 font-medium">Split in 4. Interest-free.</span>
                  </div>
                  <p className="text-sm text-stone-700">
                    Pay 4 interest-free installments of <span className="font-bold text-stone-950">{formatPrice(tabbyInstallment)}</span> monthly. No processing fees, no interest.
                  </p>
                  <div className="flex gap-2.5 pt-2 border-t border-stone-200/50 mt-2 text-[11px] text-stone-400">
                    <span>1. Pay 25% now</span>
                    <span>&rarr;</span>
                    <span>2. Pay 25% in 1 month</span>
                    <span>&rarr;</span>
                    <span>3. 2 months</span>
                    <span>&rarr;</span>
                    <span>4. 3 months</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 italic">
                    API integration active via client key: {process.env.NEXT_PUBLIC_TABBY_API_KEY ? "Loaded" : "pk_test_tabby_onboarding"}
                  </p>
                </div>
              )}

              {paymentMethod === "tamara" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#2D2A26] text-[#EC864D] font-extrabold text-[11px] px-2 py-0.5 rounded border border-[#EC864D]">tamara</span>
                    <span className="text-xs text-stone-500 font-medium">Split in 3 payments.</span>
                  </div>
                  <p className="text-sm text-stone-700">
                    Pay 3 monthly payments of <span className="font-bold text-stone-950">{formatPrice(tamaraInstallment)}</span>. Shariah-compliant. No fees, no hidden costs.
                  </p>
                  <div className="flex gap-3 pt-2 border-t border-stone-200/50 mt-2 text-[11px] text-stone-400">
                    <span>1. Pay 1/3 now</span>
                    <span>&rarr;</span>
                    <span>2. Pay 1/3 in 30 days</span>
                    <span>&rarr;</span>
                    <span>3. Pay 1/3 in 60 days</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 italic">
                    API integration active via client token: {process.env.NEXT_PUBLIC_TAMARA_API_KEY ? "Loaded" : "tamara_test_token_onboarding"}
                  </p>
                </div>
              )}

              {paymentMethod === "network" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900">Network International Gateway</span>
                  </div>
                  <p className="text-sm text-stone-700">
                    You will be securely redirected to the Network International card gateway to enter your card details and perform 3D-Secure authentication.
                  </p>
                  <div className="rounded-lg bg-white border border-stone-200 p-3 text-xs text-stone-500 flex items-center gap-2">
                    <AlertCircle size={14} className="text-blue-500 shrink-0" />
                    <span>Hosted Secure checkout simulation active (Sandbox Merchant Mode)</span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 italic">
                    API integration active via Merchant Key: {process.env.NEXT_PUBLIC_NETWORK_API_KEY ? "Loaded" : "network_test_api_key_onboarding"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-4">Your Order</h2>

            {/* List of items */}
            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-md bg-stone-50 border border-stone-100">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-xs font-medium text-stone-900">{item.name}</h4>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase mt-0.5">{item.brand}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-serif text-xs font-semibold text-stone-900 self-center">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="border-t border-stone-100 pt-4 space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-medium text-stone-900">{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-serif font-medium text-stone-900">
                  {shipping === 0 ? <span className="text-emerald-600 font-semibold uppercase text-[10px]">Free</span> : formatPrice(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-serif">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-stone-100 pt-3 font-serif text-sm font-bold text-stone-950">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={placing}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {placing && <Loader2 size={14} className="animate-spin" />}
              <span>{placing ? "Processing..." : paymentMethod === "network" ? "Proceed to Network Pay" : "Place Secure Order"}</span>
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 border-t border-stone-100 pt-4">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Secure checkout processed by ScentGrade</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
