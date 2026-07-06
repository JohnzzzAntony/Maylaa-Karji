"use client";

import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { SerializedProduct } from "@/lib/data";
import { useCart, useWishlist } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { StarRating } from "./star-rating";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  onQuickView,
  onViewProduct,
  index = 0,
}: {
  product: SerializedProduct;
  onQuickView?: (p: SerializedProduct) => void;
  onViewProduct?: (p: SerializedProduct) => void;
  index?: number;
}) {
  const addItem = useCart((s) => s.addItem);
  const wishlistToggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <div className="relative overflow-hidden rounded-xl bg-cream aspect-[4/5] shadow-luxury transition-shadow duration-300 group-hover:shadow-luxury-lg">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm shadow-sm",
                product.badge === "New" && "bg-emerald-deep text-white",
                product.badge === "Bestseller" && "bg-gold text-white",
                product.badge === "Exclusive" && "bg-espresso text-white",
                product.badge === "Premium" && "bg-gold-soft text-espresso",
                !["New", "Bestseller", "Exclusive", "Premium"].includes(product.badge) && "bg-espresso text-white"
              )}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-red-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => {
            wishlistToggle(product.id);
            toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-espresso backdrop-blur-sm transition hover:scale-110 hover:bg-white"
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} className={cn(wished && "text-red-600")} />
        </button>

        {/* Image */}
        <button
          onClick={() => (onViewProduct ? onViewProduct(product) : onQuickView?.(product))}
          className="relative h-full w-full"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className={cn(
              "object-cover transition-all duration-700 group-hover:scale-110",
              !imgLoaded && "blur-sm"
            )}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>

        {/* Desktop hover actions (slide up) */}
        <div className="absolute inset-x-0 bottom-0 z-20 hidden translate-y-full flex-col gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0 md:flex">
          <button
            onClick={() => {
              addItem({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                brand: product.brand?.name ?? "",
                size: product.size,
              });
              toast.success(`${product.name} added to cart`);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-espresso px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex items-center justify-center gap-2 rounded-lg bg-white/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-espresso backdrop-blur-sm transition hover:bg-white"
            >
              <Eye size={14} /> Quick View
            </button>
          )}
        </div>

        {/* Mobile always-visible quick add (circular) */}
        <button
          onClick={() => {
            addItem({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
              brand: product.brand?.name ?? "",
              size: product.size,
            });
            toast.success(`${product.name} added to cart`);
          }}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-gold text-white shadow-luxury transition hover:scale-110 active:scale-95 md:hidden"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {product.brand?.name}
          </span>
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        <button
          onClick={() => (onViewProduct ? onViewProduct(product) : onQuickView?.(product))}
          className="font-serif text-lg font-medium leading-tight text-foreground transition hover:text-gold text-left"
        >
          {product.name}
        </button>
        <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          {/* Mobile quick view text link */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gold transition hover:underline md:hidden"
            >
              <Eye size={12} /> View
            </button>
          )}
        </div>
        {/* Gold accent underline that grows on hover */}
        <div className="mt-1 h-px w-8 origin-left bg-gold/40 transition-all duration-300 group-hover:w-full group-hover:bg-gold" />
      </div>
    </motion.div>
  );
}
