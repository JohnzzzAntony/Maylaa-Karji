"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUI, useAuth, useCart } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2, LogIn } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

type WItem = { id: string; name: string; slug: string; price: number; images: string[]; brand?: { name: string }; size: number };

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, setAuthOpen } = useUI();
  const { user } = useAuth();
  const addItem = useCart((s) => s.addItem);
  const [items, setItems] = useState<WItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try { const res = await fetch("/api/wishlist"); const data = await res.json(); setItems(data.items || []); } finally { setLoading(false); }
  };

  useEffect(() => { if (wishlistOpen && user) load(); if (!wishlistOpen) setItems([]); }, [wishlistOpen, user]);

  const remove = async (productId: string) => {
    await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== productId));
    toast.success("Removed from wishlist");
  };

  const moveToCart = async (item: WItem) => {
    addItem({ id: item.id, slug: item.slug, name: item.name, price: item.price, image: item.images[0], brand: item.brand?.name ?? "", size: item.size });
    await remove(item.id);
    toast.success(`${item.name} moved to cart`);
  };

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl"><Heart size={18} className="text-gold" /> My Wishlist <span className="text-sm font-sans font-normal text-muted-foreground">({items.length})</span></SheetTitle>
        </SheetHeader>
        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary"><Heart size={28} className="text-muted-foreground" /></div>
            <h3 className="font-serif text-xl">Sign in to view your wishlist</h3>
            <p className="text-sm text-muted-foreground">Save your favorite fragrances and access them anytime.</p>
            <button onClick={() => { setWishlistOpen(false); setAuthOpen(true); }} className="flex items-center gap-2 rounded-lg bg-espresso px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold"><LogIn size={14} /> Sign In / Register</button>
          </div>
        ) : loading ? (
          <div className="flex flex-1 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-gold" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary"><Heart size={28} className="text-muted-foreground" /></div>
            <h3 className="font-serif text-xl">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
            <button onClick={() => setWishlistOpen(false)} className="rounded-lg bg-espresso px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold">Discover Fragrances</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-luxury px-5 py-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-3 border-b border-border pb-4 mb-4 last:border-0">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"><Image src={item.images[0]} alt={item.name} fill sizes="80px" className="object-cover" /></div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2"><div><p className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.brand?.name}</p><h4 className="font-serif text-base leading-tight">{item.name}</h4></div><button onClick={() => remove(item.id)} className="text-muted-foreground transition hover:text-red-600" aria-label="Remove"><Trash2 size={15} /></button></div>
                      <div className="mt-auto flex items-center justify-between"><span className="text-sm font-semibold text-gold">{formatPrice(item.price)}</span><button onClick={() => moveToCart(item)} className="flex items-center gap-1.5 rounded-lg bg-espresso px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-gold"><ShoppingBag size={13} /> Add</button></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t border-border bg-secondary/30 px-5 py-4"><p className="text-center text-xs text-muted-foreground">{items.length} item(s) saved</p></div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
