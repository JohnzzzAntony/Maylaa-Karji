"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight, Check, Star, Share2, Zap, Award, Sparkles } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useCart, useWishlist } from "@/lib/cart-store";
import { StarRating } from "./star-rating";
import { ProductCard } from "./product-card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SIZES = [30, 50, 100];

export function ProductDetailPage({ product, related, onBack, onSelectProduct, onQuickView }: {
  product: SerializedProduct; related: SerializedProduct[]; onBack: () => void; onSelectProduct?: (p: SerializedProduct) => void; onQuickView?: (p: SerializedProduct) => void;
}) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.size || 100);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"description" | "notes" | "shipping" | "reviews">("description");
  const addItem = useCart((s) => s.addItem);
  const wishlistToggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  const discount = product.compareAtPrice && product.compareAtPrice > product.price ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const gallery = [product.images[0], product.images[0], product.images[0]];
  const features = [{ icon: Zap, label: "Concentration", value: product.concentration }, { icon: Award, label: "Longevity", value: "12+ hours" }, { icon: Sparkles, label: "Sillage", value: "Bold" }, { icon: ShieldCheck, label: "Authenticity", value: "Guaranteed" }];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-gold"><ArrowLeft size={14} /> Back to Store</button>
        <nav className="flex items-center gap-2 text-[11px] text-muted-foreground"><button onClick={onBack} className="hover:text-gold">Home</button><ChevronRight size={11} /><span className="hover:text-gold cursor-pointer">{product.brand?.name}</span><ChevronRight size={11} /><span className="text-foreground">{product.name}</span></nav>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <Image key={activeImg} src={gallery[activeImg]} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority style={{ transform: activeImg === 1 ? "scale(1.4)" : activeImg === 2 ? "scale(1.15) translateY(-10%)" : "scale(1)" }} />
              {product.badge && <span className="absolute left-4 top-4 rounded-full bg-espresso px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">{product.badge}</span>}
              {discount > 0 && <span className="absolute right-4 top-4 rounded-full bg-red-700 px-3 py-1 text-[10px] font-bold uppercase text-white">Save {discount}%</span>}
            </div>
            <div className="mt-4 flex gap-3">{gallery.map((g, i) => (<button key={i} onClick={() => setActiveImg(i)} className={cn("relative h-20 w-20 overflow-hidden rounded-xl border-2 transition", activeImg === i ? "border-gold" : "border-border opacity-60 hover:opacity-100")}><Image src={g} alt="" fill sizes="80px" className="object-cover" /></button>))}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">{product.brand?.name} · {product.brand?.country}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-4"><StarRating rating={product.rating} size={18} showValue /><a href="#reviews" className="text-sm text-muted-foreground underline-offset-2 hover:text-gold hover:underline">{product.reviewCount} reviews</a><span className="text-muted-foreground">·</span><span className="text-sm text-muted-foreground">{product.gender}</span></div>
            <p className="mt-5 text-base leading-relaxed text-foreground/75">{product.longDescription}</p>
            <div className="mt-6 flex items-end gap-3"><span className="font-serif text-4xl font-semibold text-gold">{formatPrice(product.price)}</span>{product.compareAtPrice && product.compareAtPrice > product.price && (<><span className="text-xl text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span><span className="rounded-full bg-red-700 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">Save {discount}%</span></>)}</div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of VAT · Free shipping over Dhs. 500</p>
            {product.stock <= 15 && (<div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700"><Zap size={15} /> Hurry up — only <strong className="mx-1">{product.stock}</strong> left in stock!</div>)}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{features.map((f) => (<div key={f.label} className="rounded-xl border border-border bg-secondary/50 p-3 text-center"><f.icon size={20} className="mx-auto text-gold" /><p className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</p><p className="text-xs font-semibold">{f.value}</p></div>))}</div>
            <div className="mt-6"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Size — <span className="text-foreground">{size}ml</span></p><div className="flex gap-2">{SIZES.map((s) => (<button key={s} onClick={() => setSize(s)} className={cn("rounded-lg border px-5 py-2.5 text-sm font-medium transition", size === s ? "border-gold bg-gold text-white" : "border-border hover:border-gold")}>{s}ml{s === 100 && <span className="ml-1.5 text-[9px] opacity-70">Standard</span>}</button>))}</div></div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border"><button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Decrease"><Minus size={16} /></button><span className="w-12 text-center text-sm font-semibold">{qty}</span><button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Increase"><Plus size={16} /></button></div>
              <button onClick={() => { for (let i = 0; i < qty; i++) addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], brand: product.brand?.name ?? "", size }); toast.success(qty + " x " + product.name + " added to cart"); }} className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-espresso py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold"><ShoppingBag size={16} /> Add to Cart · {formatPrice(product.price * qty)}</button>
              <button onClick={() => { wishlistToggle(product.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }} className={cn("grid h-12 w-12 place-items-center rounded-lg border transition", wished ? "border-red-600 text-red-600" : "border-border hover:border-gold")} aria-label="Wishlist"><Heart size={18} fill={wished ? "currentColor" : "none"} /></button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="grid h-12 w-12 place-items-center rounded-lg border border-border transition hover:border-gold" aria-label="Share"><Share2 size={18} /></button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">{[{ icon: Truck, label: "Free Shipping", sub: "Over Dhs. 500" }, { icon: RotateCcw, label: "30-Day Returns", sub: "No questions" }, { icon: ShieldCheck, label: "Authentic", sub: "Guaranteed" }].map((a) => (<div key={a.label} className="flex flex-col items-center gap-1 text-center"><a.icon size={22} className="text-gold" /><p className="text-xs font-semibold">{a.label}</p><p className="text-[10px] text-muted-foreground">{a.sub}</p></div>))}</div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Check size={12} className="text-emerald-deep" /> SKU: {product.sku}</span><span className="flex items-center gap-1"><Check size={12} className="text-emerald-deep" /> {product.concentration}</span><span className="flex items-center gap-1"><Check size={12} className="text-emerald-deep" /> {product.gender}</span><span className="flex items-center gap-1"><Check size={12} className="text-emerald-deep" /> {product.stock} in stock</span></div>
          </motion.div>
        </div>
        <div id="reviews" className="mt-16 border-t border-border pt-10">
          <div className="flex flex-wrap gap-1 border-b border-border">
            {[
              { id: "description", label: "Why You'll Love It" },
              { id: "notes", label: "Fragrance Pyramid" },
              { id: "shipping", label: "Shipping and Returns" },
              { id: "reviews", label: "Reviews (" + product.reviewCount + ")" },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={cn("relative px-5 py-3 text-sm font-medium transition", tab === t.id ? "text-gold" : "text-muted-foreground hover:text-foreground")}>
                {t.label}
                {tab === t.id && <motion.span layoutId="pdp-tab" className="absolute -bottom-px left-0 right-0 h-0.5 bg-gold" />}
              </button>
            ))}
          </div>
          <div className="py-8">
            {tab === "description" && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/75"><p>{product.longDescription}</p><p>This exceptional {product.concentration.toLowerCase()} is a testament to the artistry of {product.brand?.name}. Crafted with the finest natural materials and aged to perfection, it represents the pinnacle of modern perfumery. Each bottle is hand-finished and individually inspected before leaving our atelier.</p><p>Suitable for {product.gender.toLowerCase()} wearers who appreciate complexity, longevity, and that rare quality that turns heads without shouting. Best experienced on pulse points: wrists, neck, and behind the ears.</p></motion.div>)}
            {tab === "notes" && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid max-w-4xl gap-6 sm:grid-cols-3">{[{ label: "Top Notes", value: product.topNotes, desc: "The opening — first impression, lasts 15–30 min" }, { label: "Heart Notes", value: product.heartNotes, desc: "The core — emerges after top fades, lasts 2–4 hrs" }, { label: "Base Notes", value: product.baseNotes, desc: "The foundation — lingers for hours, the scent trail" }].map((n) => (<div key={n.label} className="rounded-xl border border-border bg-secondary/40 p-5"><p className="text-[11px] font-semibold uppercase tracking-widest text-gold">{n.label}</p><p className="mt-2 font-serif text-lg">{n.value}</p><p className="mt-2 text-xs text-muted-foreground">{n.desc}</p></div>))}</motion.div>)}
            {tab === "shipping" && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/75"><div className="flex gap-3"><Truck size={20} className="shrink-0 text-gold" /><div><p className="font-semibold text-foreground">Complimentary Worldwide Shipping</p><p>Free shipping on all orders over Dhs. 500. Standard delivery: 3–5 business days (UAE), 5–10 days (international). Express options at checkout.</p></div></div><div className="flex gap-3"><RotateCcw size={20} className="shrink-0 text-gold" /><div><p className="font-semibold text-foreground">30-Day Returns</p><p>Not in love? Return unopened bottles within 30 days for a full refund. Opened fragrances can be returned within 14 days under our satisfaction guarantee.</p></div></div><div className="flex gap-3"><ShieldCheck size={20} className="shrink-0 text-gold" /><div><p className="font-semibold text-foreground">Authenticity Guaranteed</p><p>Every bottle is sourced directly from {product.brand?.name} and verified through our multi-point authentication. Includes certificate of authenticity.</p></div></div></motion.div>)}
            {tab === "reviews" && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl"><div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center"><div className="text-center sm:border-r sm:border-border sm:pr-8"><p className="font-serif text-5xl font-semibold text-gold">{product.rating.toFixed(1)}</p><StarRating rating={product.rating} size={16} className="mt-2 justify-center" /><p className="mt-1 text-xs text-muted-foreground">{product.reviewCount} reviews</p></div><div className="flex-1 space-y-1.5">{[5, 4, 3, 2, 1].map((s) => { const pct = s === 5 ? 78 : s === 4 ? 15 : s === 3 ? 5 : s === 2 ? 1 : 1; return (<div key={s} className="flex items-center gap-3"><span className="flex w-12 items-center gap-1 text-xs text-muted-foreground">{s} <Star size={11} className="text-gold" fill="currentColor" /></span><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gold" style={{ width: pct + "%" }} /></div><span className="w-10 text-right text-xs text-muted-foreground">{pct}%</span></div>); })}</div></div><div className="space-y-4">{(product.reviews ?? []).map((r) => (<div key={r.id} className="rounded-xl border border-border p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-gold">{r.author.charAt(0)}</div><div><p className="flex items-center gap-1.5 text-sm font-semibold">{r.author} <Check size={13} className="text-emerald-deep" /></p><p className="text-xs text-muted-foreground">{r.location} · {new Date(r.createdAt).toLocaleDateString()}</p></div></div><StarRating rating={r.rating} size={14} /></div><p className="mt-3 font-medium text-foreground">{r.title}</p><p className="mt-1 text-sm text-muted-foreground">{r.content}</p></div>))}{(!product.reviews || product.reviews.length === 0) && (<p className="py-8 text-center text-sm text-muted-foreground">No reviews yet. Be the first to review this fragrance!</p>)}</div></motion.div>)}
          </div>
        </div>
        {related.length > 0 && (<div className="mt-16 border-t border-border pt-12"><h2 className="mb-8 font-serif text-3xl font-semibold">You May Also Love</h2><div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">{related.map((p, i) => (<ProductCard key={p.id} product={p} onQuickView={onQuickView} onViewProduct={onSelectProduct} index={i} />))}</div></div>)}
      </div>
    </div>
  );
}
