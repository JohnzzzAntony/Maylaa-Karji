"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useCart, useWishlist, useUI, useAuth } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { label: "Shop All", hasMenu: true },
  { label: "New Arrivals", hasMenu: false },
  { label: "Exclusive", hasMenu: false },
  { label: "Top Picks", hasMenu: true },
  { label: "Brands", hasMenu: false },
  { label: "Gift Card", hasMenu: false },
];

const SHOP_MENU = [
  { title: "By Category", links: ["Oud & Amber", "Floral", "Woody", "Oriental Spicy", "Fresh Citrus"] },
  { title: "By Concentration", links: ["Extrait de Parfum", "Eau de Parfum", "Discovery Sets"] },
  { title: "By Gender", links: ["Unisex", "Feminine", "Masculine"] },
  { title: "Featured", links: ["Bestsellers", "New Arrivals", "Exclusive", "Artisanal"] },
];

export function Header({
  onOpenSearch,
  onOpenMobileMenu,
  onShopAll,
  onHome,
  onNavigate,
}: {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  onShopAll: () => void;
  onHome: () => void;
  onNavigate: (section: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const count = useCart((s) => s.count());
  const setOpen = useCart((s) => s.setOpen);
  const wishCount = useWishlist((s) => s.ids.length);
  const setQuizOpen = useUI((s) => s.setQuizOpen);
  const setAuthOpen = useUI((s) => s.setAuthOpen);
  const setWishlistOpen = useUI((s) => s.setWishlistOpen);
  const { user, logout } = useAuth();
  const [accountMenu, setAccountMenu] = useState(false);

  useEffect(() => { useAuth.getState().fetchUser(); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled ? "glass border-border shadow-luxury" : "border-transparent bg-background"
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobileMenu}
          className="grid h-10 w-10 place-items-center rounded-lg text-foreground transition hover:bg-accent lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <button onClick={onHome} className="flex items-center gap-2.5 shrink-0 cursor-pointer">
          <div className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-gold">
            <span className="font-serif text-lg font-bold text-gold">K</span>
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-xl font-semibold tracking-wide text-foreground">The House Of Karji</span>
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Curated Fragrance</span>
          </div>
        </button>

        {/* Nav */}
        <nav className="hidden flex-1 items-center justify-center lg:flex">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.hasMenu ? item.label : null)}
            >
              <button
                onClick={() => {
                  if (item.label === "Shop All") onShopAll();
                  else if (item.label === "New Arrivals") onNavigate("new");
                  else if (item.label === "Exclusive") onNavigate("exclusive");
                  else if (item.label === "Top Picks") onNavigate("bestsellers");
                  else if (item.label === "Brands") onNavigate("brands");
                  else if (item.label === "Gift Card") onNavigate("gift");
                }}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:text-gold"
              >
                {item.label}
                {item.hasMenu && <ChevronDown size={14} className={cn("transition", openMenu === item.label && "rotate-180")} />}
              </button>
              <AnimatePresence>
                {openMenu === item.label && item.hasMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3"
                  >
                    <div className="grid grid-cols-4 gap-5 rounded-2xl border border-border bg-white p-6 shadow-luxury-lg">
                      {SHOP_MENU.map((col) => (
                        <div key={col.title}>
                          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gold">{col.title}</h4>
                          <ul className="space-y-2">
                            {col.links.map((l) => (
                              <li key={l}>
                                <a href="#" className="text-sm text-foreground/70 transition hover:text-gold hover:translate-x-0.5 inline-block">
                                  {l}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto lg:ml-0">
          <button
            onClick={() => setQuizOpen(true)}
            className="hidden items-center gap-1.5 rounded-full border border-gold/40 bg-gold/5 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-gold transition hover:bg-gold hover:text-white md:flex"
            aria-label="Take fragrance quiz"
          >
            <Sparkles size={13} /> Find Your Scent
          </button>
          <button
            onClick={onOpenSearch}
            className="grid h-10 w-10 place-items-center rounded-lg text-foreground transition hover:bg-accent"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => user ? setAccountMenu((v) => !v) : setAuthOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg text-foreground transition hover:bg-accent"
            aria-label="Account"
          >
            <User size={20} />
          </button>
          {accountMenu && user && (
            <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-white p-2 shadow-luxury-lg" onMouseLeave={() => setAccountMenu(false)}>
              <div className="border-b border-border px-3 py-2"><p className="text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
              <button onClick={() => { setWishlistOpen(true); setAccountMenu(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-secondary"><Heart size={15} /> My Wishlist</button>
              {user.role === "admin" && (<a href="/?admin=1" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-secondary"><Sparkles size={15} /> Admin Panel</a>)}
              <button onClick={() => { logout(); setAccountMenu(false); toast.success("Signed out"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"><X size={15} /> Sign Out</button>
            </div>
          )}
          <button
            onClick={() => setWishlistOpen(true)}
            className="relative hidden h-10 w-10 place-items-center rounded-lg text-foreground transition hover:bg-accent sm:grid"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-lg text-foreground transition hover:bg-accent"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-white"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
