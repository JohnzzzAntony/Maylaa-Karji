"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import type { SerializedProduct } from "@/lib/data";
import { toast } from "sonner";
import { AnnouncementBar } from "./announcement-bar";
import { Header } from "./header";
import { HeroCarousel } from "./hero-carousel";
import type { Banner } from "./hero-carousel";
import { CategoryShowcase } from "./category-showcase";
import { ProductSection } from "./product-section";
import { ExtraitFeature } from "./extrait-feature";
import { BrandMarquee } from "./brand-marquee";
import { QuoteSection } from "./quote-section";
import { ScentJournal } from "./scent-journal";
import { Testimonials } from "./testimonials";
import { ValueProps } from "./value-props";
import { Footer } from "./footer";
import { CartPage } from "./cart-page";
const SearchDialog = dynamic(() => import("./search-dialog").then(mod => mod.SearchDialog), { ssr: false });
const MobileMenu = dynamic(() => import("./mobile-menu").then(mod => mod.MobileMenu), { ssr: false });
const FragranceQuiz = dynamic(() => import("./fragrance-quiz").then(mod => mod.FragranceQuiz), { ssr: false });
const LiveChat = dynamic(() => import("./live-chat").then(mod => mod.LiveChat), { ssr: false });
import { ScrollUtilities } from "./scroll-utilities";
import { QuizCTA } from "./quiz-cta";
import { RecentlyViewed } from "./recently-viewed";
import { SectionDivider } from "./section-divider";
import { ShopView } from "./shop-view";
import { FeaturedScentEditorial } from "./featured-scent-editorial";
import { InstagramGrid } from "./instagram-grid";
import { WhyScentGrade } from "./why-scent-grade";
import { ReviewSummary } from "./review-summary";
const NewsletterPopup = dynamic(() => import("./newsletter-popup").then(mod => mod.NewsletterPopup), { ssr: false });
import { ProductDetailPage } from "./product-detail-page";
import { LoginPage } from "./login-page";
import { RegisterPage } from "./register-page";
import { ProfilePage } from "./profile-page";
const WishlistDrawer = dynamic(() => import("./wishlist-drawer").then(mod => mod.WishlistDrawer), { ssr: false });
import { CmsPageView } from "./cms-page-view";
import { CategoryView } from "./category-view";
import { AdDisplay } from "./ad-display";
import type { Ad } from "./ad-display";
import { BogoSection } from "./bogo-section";
import type { BogoOffer } from "./bogo-section";
import { useRecentlyViewed, useAuth, useCart, useWishlist } from "@/lib/cart-store";
import { CheckoutPage } from "./checkout-page";
import { CheckoutAuthGateway } from "./checkout-auth-gateway";
import { Check } from "lucide-react";

type Brand = { id: string; name: string; slug: string; country: string; description: string; logoColor: string };
type Category = { id: string; name: string; slug: string; description: string; image: string };
type Promo = { id: string; code: string; type: string; value: number; minSpend: number };

export function HomeClient({
  trending, newArrivals, exclusive, bestSellers, artisanal, featured, brands, categories, promos, banners, ads, bogoOffers,
}: {
  trending: SerializedProduct[]; newArrivals: SerializedProduct[]; exclusive: SerializedProduct[]; bestSellers: SerializedProduct[]; artisanal: SerializedProduct[]; featured: SerializedProduct[]; brands: Brand[]; categories: Category[]; promos: Promo[]; banners: Banner[]; ads: Ad[]; bogoOffers: BogoOffer[];
}) {
  const [quickView, setQuickView] = useState<SerializedProduct | null>(null);
  const [qvOpen, setQvOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<"home" | "shop" | "pdp" | "cms" | "category" | "cart" | "login" | "register" | "profile" | "checkout-auth" | "checkout" | "order-success">("home");
  const [pdpProduct, setPdpProduct] = useState<SerializedProduct | null>(null);
  const [cmsSlug, setCmsSlug] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);
  const [successOrderId, setSuccessOrderId] = useState("");
  const addRecentlyViewed = useRecentlyViewed((s) => s.add);
  const { fetchUser, user } = useAuth();
  const { items: cartItems } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const currentCategory = useMemo(() => categories.find((c) => c.slug === categorySlug) ?? null, [categories, categorySlug]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // Sync cart to DB
  useEffect(() => {
    if (user) {
      fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      }).catch(console.error);
    }
  }, [cartItems, user]);

  // Sync wishlist to DB
  useEffect(() => {
    if (user) {
      fetch("/api/wishlist/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: wishlistIds }),
      }).catch(console.error);
    }
  }, [wishlistIds, user]);

  // Dynamic SEO Page Title & Meta Tags
  useEffect(() => {
    let title = "The House of Karji | Curated Luxury Fragrances";
    let desc = "Curated luxury fragrances from the world's finest perfume houses. Experience the artistry of scent with ScentGrade.";
    let keywords = "perfume, fragrances, luxury scent, House of Karji, Arabian Oud, Extrait de Parfum";

    if (view === "shop") {
      title = "Shop Fragrances | The House of Karji";
      desc = "Browse our exclusive collection of luxury artisanal perfumes and Arabic ouds.";
    } else if (view === "pdp" && pdpProduct) {
      title = `${pdpProduct.name} - ${pdpProduct.brand?.name || "The House of Karji"}`;
      desc = pdpProduct.metaDescription || pdpProduct.description || desc;
      title = pdpProduct.metaTitle || title;
      if (pdpProduct.metaKeywords) keywords = pdpProduct.metaKeywords;
    } else if (view === "category" && currentCategory) {
      title = `${currentCategory.name} | The House of Karji`;
      try {
        const meta = JSON.parse(currentCategory.description);
        title = meta.metaTitle || title;
        desc = meta.metaDescription || meta.description || desc;
        if (meta.metaKeywords) keywords = meta.metaKeywords;
      } catch {
        desc = currentCategory.description || desc;
      }
    } else if (view === "checkout" || view === "checkout-auth") {
      title = "Secure Checkout | The House of Karji";
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", keywords);
  }, [view, pdpProduct, currentCategory]);

  const openShop = () => { setView("shop"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openHome = () => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openPdp = (p: SerializedProduct) => { setPdpProduct(p); setView("pdp"); window.scrollTo({ top: 0, behavior: "smooth" }); addRecentlyViewed(p.id); };
  const openCms = (slug: string) => { setCmsSlug(slug); setView("cms"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openCategory = (slug: string) => { setCategorySlug(slug); setView("category"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleNavigate = (section: string) => {
    if (section === "gift") { toast.info("Gift cards coming soon! Use code KARJI10 for 10% off your order."); return; }
    if (["cart", "login", "register", "profile", "checkout-auth"].includes(section)) {
      setView(section as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Check if it's a category slug
    const cat = categories.find((c) => c.slug === section);
    if (cat) { openCategory(section); return; }
    setView("home");
    setTimeout(() => { const el = document.getElementById("section-" + section); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); else document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }, 80);
  };

  const allProducts = useMemo(() => {
    const map = new Map<string, SerializedProduct>();
    [...trending, ...newArrivals, ...exclusive, ...bestSellers, ...artisanal, ...featured].forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [trending, newArrivals, exclusive, bestSellers, artisanal, featured]);

  const openQuickView = (p: SerializedProduct) => { openPdp(p); };

  useEffect(() => { if (quickView) addRecentlyViewed(quickView.id); }, [quickView, addRecentlyViewed]);

  const related = useMemo(() => {
    if (!quickView) return [];
    return allProducts.filter((p) => p.id !== quickView.id && (p.category?.slug === quickView.category?.slug || p.brand?.slug === quickView.brand?.slug)).slice(0, 4);
  }, [quickView, allProducts]);

  const pdpRelated = useMemo(() => {
    if (!pdpProduct) return [];
    return allProducts.filter((p) => p.id !== pdpProduct.id && (p.category?.slug === pdpProduct.category?.slug || p.brand?.slug === pdpProduct.brand?.slug)).slice(0, 4);
  }, [pdpProduct, allProducts]);

  const categoryProducts = useMemo(() => {
    if (!categorySlug) return [];
    return allProducts.filter((p) => p.category?.slug === categorySlug);
  }, [allProducts, categorySlug]);

  const extraitProduct = featured[0] ?? bestSellers[0] ?? trending[0];

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollUtilities />
      <AnnouncementBar />
      <Header onOpenSearch={() => setSearchOpen(true)} onOpenMobileMenu={() => setMobileOpen(true)} onShopAll={openShop} onHome={openHome} onNavigate={handleNavigate} />

      <main className="flex-1">
        {view === "pdp" && pdpProduct ? (
          <ProductDetailPage product={pdpProduct} related={pdpRelated} onBack={openHome} onSelectProduct={openPdp} onQuickView={openQuickView} />
        ) : view === "shop" ? (
          <ShopView products={allProducts} brands={brands} categories={categories} onQuickView={openQuickView} onBack={openHome} onViewProduct={openPdp} />
        ) : view === "cms" && cmsSlug ? (
          <CmsPageView slug={cmsSlug} onBack={openHome} />
        ) : view === "category" && currentCategory ? (
          <CategoryView category={currentCategory} products={categoryProducts} onBack={openHome} onQuickView={openQuickView} onViewProduct={openPdp} onNavigateCategory={openCategory} allCategories={categories} />
        ) : view === "cart" ? (
          <CartPage 
            onBack={openHome} 
            onCheckout={(promo) => {
              setSelectedPromo(promo);
              if (user) {
                setView("checkout");
              } else {
                setView("checkout-auth");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
            promos={promos} 
          />
        ) : view === "login" ? (
          <LoginPage onNavigate={(v) => { setView(v as any); window.scrollTo({ top: 0, behavior: "smooth" }); }} onSuccess={() => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        ) : view === "register" ? (
          <RegisterPage onNavigate={(v) => { setView(v as any); window.scrollTo({ top: 0, behavior: "smooth" }); }} onSuccess={() => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        ) : view === "profile" ? (
          <ProfilePage onNavigate={(v) => { setView(v as any); window.scrollTo({ top: 0, behavior: "smooth" }); }} onLogout={() => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        ) : view === "checkout-auth" ? (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center min-h-[70vh]">
            <CheckoutAuthGateway
              onBack={openHome}
              onProceedAsGuest={(email) => {
                setGuestEmail(email);
                setView("checkout");
              }}
              onSuccessLogin={() => {
                setView("checkout");
              }}
            />
          </div>
        ) : view === "checkout" ? (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <CheckoutPage
              appliedPromo={selectedPromo}
              guestEmail={guestEmail}
              onBack={openHome}
              onOrderSuccess={(orderId) => {
                setSuccessOrderId(orderId);
                setView("order-success");
              }}
            />
          </div>
        ) : view === "order-success" ? (
          <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-6 min-h-[60vh] flex flex-col items-center justify-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Check size={40} className="mx-auto" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">Order Confirmed!</h1>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Thank you for shopping with us! Your order <span className="font-semibold text-stone-900">#{successOrderId || "SG-" + Math.floor(Math.random() * 100000)}</span> has been successfully placed. A confirmation email will be sent to you shortly.
            </p>
            <button
              onClick={openHome}
              className="rounded-lg bg-espresso px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <HeroCarousel featured={featured} banners={banners} />
            <CategoryShowcase categories={categories} onNavigateCategory={openCategory} />
            {/* Inline advertisements from DB */}
            <AdDisplay ads={ads} placement="inline" />
            <div id="products" />
            <div id="section-new"><ProductSection eyebrow="New & Trending" title="The Fragrance Frontier" description="The scents everyone's talking about — fresh, modern, and impossible to ignore." products={trending} onQuickView={openQuickView} onViewAll={openShop} onViewProduct={openPdp} /></div>
            <SectionDivider label="Curated Exclusives" />
            <div id="section-exclusive"><ProductSection eyebrow="Exclusive Collection" title="Reserved For The Few" description="Limited allocations and house exclusives you won't find anywhere else." products={exclusive} onQuickView={openQuickView} bg="cream" onViewAll={openShop} onViewProduct={openPdp} /></div>
            <div id="section-brands"><BrandMarquee brands={brands} /></div>
            {extraitProduct && <ExtraitFeature product={extraitProduct} />}
            <ProductSection eyebrow="Artisanal Perfumes" title="Hand-Crafted Masterpieces" description="Small-batch creations from independent perfumers, each a singular vision." products={artisanal} onQuickView={openQuickView} onViewAll={openShop} onViewProduct={openPdp} />
            {/* BOGO offers from DB */}
            <BogoSection offers={bogoOffers} products={allProducts} />
            <div id="section-bestsellers"><ProductSection eyebrow="Best Sellers" title="Loved By Thousands" description="The fragrances our patrons return for, again and again." products={bestSellers} onQuickView={openQuickView} icon="flame" bg="cream" onViewAll={openShop} onViewProduct={openPdp} /></div>
            <ProductSection eyebrow="Fresh Arrivals" title="Just Landed" description="The newest additions to our curated atelier." products={newArrivals} onQuickView={openQuickView} onViewAll={openShop} onViewProduct={openPdp} />
            {/* Sidebar advertisements from DB */}
            <AdDisplay ads={ads} placement="sidebar" />
            <FeaturedScentEditorial product={featured[1] ?? bestSellers[1] ?? trending[1]} />
            <RecentlyViewed allProducts={allProducts} onQuickView={openQuickView} />
            <QuizCTA />
            <ReviewSummary />
            <QuoteSection />
            <ScentJournal />
            <InstagramGrid />
            <Testimonials />
            <WhyScentGrade />
            <ValueProps />
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} onOpenCms={openCms} />

      {/* Overlays */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
      <FragranceQuiz products={allProducts} />
      <LiveChat />
      <NewsletterPopup />
      <WishlistDrawer />
    </div>
  );
}
