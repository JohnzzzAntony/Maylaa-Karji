"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  size: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({ items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i)), isOpen: true });
        } else {
          set({ items: [...items, { ...item, quantity: qty }], isOpen: true });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "scentgrade-cart" }
  )
);

// Wishlist store
type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({
          ids: get().ids.includes(id) ? get().ids.filter((x) => x !== id) : [...get().ids, id],
        }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "scentgrade-wishlist" }
  )
);

// Recently viewed store
type RecentlyViewedState = {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
};

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const filtered = get().ids.filter((x) => x !== id);
        set({ ids: [id, ...filtered].slice(0, 8) });
      },
      clear: () => set({ ids: [] }),
    }),
    { name: "scentgrade-recently-viewed" }
  )
);

// UI store for global overlays (quiz, chat)
type UIState = {
  quizOpen: boolean;
  chatOpen: boolean;
  authOpen: boolean;
  wishlistOpen: boolean;
  setQuizOpen: (v: boolean) => void;
  setChatOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  quizOpen: false,
  chatOpen: false,
  authOpen: false,
  wishlistOpen: false,
  setQuizOpen: (v) => set({ quizOpen: v }),
  setChatOpen: (v) => set({ chatOpen: v }),
  setAuthOpen: (v) => set({ authOpen: v }),
  setWishlistOpen: (v) => set({ wishlistOpen: v }),
}));

// Auth store
type AuthUser = { id: string; name: string; email: string; role: string };
type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (u) => set({ user: u, loading: false }),
  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
