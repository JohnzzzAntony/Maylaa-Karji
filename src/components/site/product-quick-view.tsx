"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight, Check } from "lucide-react";
import type { SerializedProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useCart, useWishlist } from "@/lib/cart-store";
import { StarRating } from "./star-rating";
import { toast } from "sonner";

const SIZES = [30, 50, 100];

export function ProductQuickView({
  product,
  open,
  onOpenChange,
  onQuickView,
  related,
}: {
  product: SerializedProduct | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onQuickView?: (p: SerializedProduct) => void;
  related?: SerializedProduct[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto scrollbar-luxury p-0">
        <DialogTitle className="sr-only">{product?.name ?? "Product"}</DialogTitle>
        {product && (
          <QuickViewContent
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            related={related}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function QuickViewContent({
  product,
  onQuickView,
  related,
}: {
  product: SerializedProduct;
  onQuickView?: (p: SerializedProduct) => void;
  related?: SerializedProduct[];
}) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.size || 100);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCart((s) => s.addItem);
  const wishlistToggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const gallery = [product.images[0], product.images[0], product.images[0]];

  return (
    <>
      <div className="grid lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative bg-cream p-4">
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              key={activeImg}
              src={gallery[activeImg]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ transform: activeImg === 1 ? "scale(1.3)" : activeImg === 2 ? "scale(1.1) translateY(-8%)" : "scale(1)" }}
            />
            {product.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-espresso px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                {product.badge}
              </span>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition ${activeImg === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <Image src={g} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col p-6 lg:p-8">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <a href="#" className="hover:text-gold">Home</a>
            <ChevronRight size={11} />
            <a href="#" className="hover:text-gold">{product.brand?.name}</a>
            <ChevronRight size={11} />
            <span className="text-foreground">{product.name}</span>
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-gold">{product.brand?.name} · {product.brand?.country}</p>
          <h2 className="mt-1 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h2>

          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={product.rating} size={16} showValue count={product.reviewCount} />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-4 flex items-end gap-3">
            <span className="font-serif text-3xl font-semibold text-gold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="rounded-full bg-red-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Save {discount}%</span>
              </>
            )}
          </div>

          {/* Notes */}
          <div className="mt-5 space-y-1.5 rounded-xl border border-border bg-cream/40 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Olfactive Pyramid</p>
            {[
              { label: "Top", value: product.topNotes },
              { label: "Heart", value: product.heartNotes },
              { label: "Base", value: product.baseNotes },
            ].map((n) => (
              <div key={n.label} className="flex items-baseline gap-2 text-xs">
                <span className="w-12 shrink-0 font-semibold uppercase text-muted-foreground">{n.label}</span>
                <span className="text-foreground/80">{n.value}</span>
              </div>
            ))}
          </div>

          {/* Size selector */}
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Size</p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`relative rounded-lg border px-4 py-2 text-sm font-medium transition ${size === s ? "border-gold bg-gold text-white" : "border-border hover:border-gold"}`}
                >
                  {s}ml
                  {s === 100 && <span className="ml-1 text-[9px] opacity-70">Standard</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Decrease">
                <Minus size={15} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center text-muted-foreground transition hover:text-foreground" aria-label="Increase">
                <Plus size={15} />
              </button>
            </div>
            <button
              onClick={() => {
                addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images[0], brand: product.brand?.name ?? "", size });
                toast.success(`${product.name} added to cart`);
              }}
              className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-espresso py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"
            >
              <ShoppingBag size={15} /> Add to Cart
            </button>
            <button
              onClick={() => {
                wishlistToggle(product.id);
                toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
              }}
              className={`grid h-11 w-11 place-items-center rounded-lg border transition ${wished ? "border-red-600 text-red-600" : "border-border text-foreground hover:border-gold"}`}
              aria-label="Wishlist"
            >
              <Heart size={16} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Assurances */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Over Dhs. 500" },
              { icon: RotateCcw, label: "30-Day Returns", sub: "No questions" },
              { icon: ShieldCheck, label: "Authentic", sub: "Guaranteed" },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1">
                <a.icon size={18} className="text-gold" />
                <p className="text-[11px] font-semibold">{a.label}</p>
                <p className="text-[10px] text-muted-foreground">{a.sub}</p>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Check size={11} className="text-emerald-deep" /> SKU: {product.sku}</span>
            <span className="flex items-center gap-1"><Check size={11} className="text-emerald-deep" /> {product.concentration}</span>
            <span className="flex items-center gap-1"><Check size={11} className="text-emerald-deep" /> {product.gender}</span>
            <span className="flex items-center gap-1"><Check size={11} className="text-emerald-deep" /> In Stock</span>
          </div>
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <div className="border-t border-border p-6 lg:p-8">
          <h3 className="mb-4 font-serif text-2xl">You May Also Love</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((r) => (
              <button key={r.id} onClick={() => onQuickView?.(r)} className="group text-left">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-cream">
                  <Image src={r.images[0]} alt={r.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition group-hover:scale-110" />
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{r.brand?.name}</p>
                <p className="font-serif text-base leading-tight group-hover:text-gold">{r.name}</p>
                <p className="text-sm font-semibold text-gold">{formatPrice(r.price)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
