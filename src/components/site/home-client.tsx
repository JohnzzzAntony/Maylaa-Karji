"use client";

import { useState, useMemo, useEffect } from "react";
import type { SerializedProduct } from "@/lib/data";
import { toast } from "sonner";
import { AnnouncementBar } from "./announcement-bar";
import { Header } from "./header";
import { HeroCarousel } from "./hero-carousel";
import { CategoryShowcase } from "./category-showcase";
import { ProductSection } from "./product-section";
import { ExtraitFeature } from "./extrait-feature";
import { BrandMarquee } from "./brand-marquee";
import { QuoteSection } from "./quote-section";
import { ScentJournal } from "./scent-journal";
import { Testimonials } from "./testimonials";
import { ValueProps } from "./value-props";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { SearchDialog } from "./search-dialog";
import { MobileMenu } from "./mobile-menu";
import { ProductQuickView } from "./product-quick-view";
import { FragranceQuiz } from "./fragrance-quiz";
import { LiveChat } from "./live-chat";
import { ScrollUtilities } from "./scroll-utilities";
import { QuizCTA } from "./quiz-cta";
import { RecentlyViewed } from "./recently-viewed";
import { SectionDivider } from "./section-divider";
import { ShopView } from "./shop-view";
import { FeaturedScentEditorial } from "./featured-scent-editorial";
import { InstagramGrid } from "./instagram-grid";
import { WhyScentGrade } from "./why-scent-grade";
import { ReviewSummary } from "./review-summary";
import { NewsletterPopup } from "./newsletter-popup";
import { ProductDetailPage } from "./product-detail-page";
import { AuthDialog } from "./auth-dialog";
import { WishlistDrawer } from "./wishlist-drawer";
import { CmsPageView } from "./cms-page-view";
import { useRecentlyViewed, useAuth } from "@/lib/cart-store";

type Brand = { id: string; name: string; slug: string; country: string; description: string; logoColor: string };
type Category = { id: string; name: string; slug: string; description: string; image: string };
type Promo = { id: string; code: string; type: string; value: number; minSpend: number };

export function HomeClient({
  trending, newArrivals, exclusive, bestSellers, artisanal, featured, brands, categories, promos,
}: {
  trending: SerializedProduct[]; newArrivals: SerializedProduct[]; exclusive: SerializedProduct[]; bestSellers: SerializedProduct[]; artisanal: SerializedProduct[]; featured: SerializedProduct[]; brands: Brand[]; categories: Category[]; promos: Promo[];
}) {
  const [quickView, setQuickView] = useState<SerializedProduct | null>(null);
  const [qvOpen, setQvOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<"home" | "shop" | "pdp" | "cms">("home");
  const [pdpProduct, setPdpProduct] = useState<SerializedProduct | null>(null);
  const [cmsSlug, setCmsSlug] = useState<string | null>(null);
  const addRecentlyViewed = useRecentlyViewed((s) => s.add);
  const { fetchUser } = useAuth();

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const openShop = () => { setView("shop"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openHome = () => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openPdp = (p: SerializedProduct) => { setPdpProduct(p); setView("pdp"); window.scrollTo({ top: 0, behavior: "smooth" }); addRecentlyViewed(p.id); };
  const openCms = (slug: string) => { setCmsSlug(slug); setView("cms"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleNavigate = (section: string) => {
    if (section === "gift") { toast.info("Gift cards coming soon! Use code KARJI10 for 10% off your order."); return; }
    setView("home");
    setTimeout(() => { const el = document.getElementById(`section-${section}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); else document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }, 80);
  };

  const allProducts = useMemo(() => {
    const map = new Map<string, SerializedProduct>();
    [...trending, ...newArrivals, ...exclusive, ...bestSellers, ...artisanal, ...featured].forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [trending, newArrivals, exclusive, bestSellers, artisanal, featured]);

  const openQuickView = (p: SerializedProduct) => { setQuickView(p); setQvOpen(true); addRecentlyViewed(p.id); };

  useEffect(() => { if (quickView) addRecentlyViewed(quickView.id); }, [quickView, addRecentlyViewed]);

  const related = useMemo(() => {
    if (!quickView) return [];
    return allProducts.filter((p) => p.id !== quickView.id && (p.category?.slug === quickView.category?.slug || p.brand?.slug === quickView.brand?.slug)).slice(0, 4);
  }, [quickView, allProducts]);

  const pdpRelated = useMemo(() => {
    if (!pdpProduct) return [];
    return allProducts.filter((p) => p.id !== pdpProduct.id && (p.category?.slug === pdpProduct.category?.slug || p.brand?.slug === pdpProduct.brand?.slug)).slice(0, 4);
  }, [pdpProduct, allProducts]);

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
        ) : (
          <>
            <HeroCarousel featured={featured} />
            <CategoryShowcase categories={categories} />
            <div id="products" />
            <div id="section-new"><ProductSection eyebrow="New & Trending" title="The Fragrance Frontier" description="The scents everyone's talking about — fresh, modern, and impossible to ignore." products={trending} onQuickView={openQuickView} onViewAll={openShop} onViewProduct={openPdp} /></div>
            <SectionDivider label="Curated Exclusives" />
            <div id="section-exclusive"><ProductSection eyebrow="Exclusive Collection" title="Reserved For The Few" description="Limited allocations and house exclusives you won't find anywhere else." products={exclusive} onQuickView={openQuickView} bg="cream" onViewAll={openShop} onViewProduct={openPdp} /></div>
            <div id="section-brands"><BrandMarquee brands={brands} /></div>
            {extraitProduct && <ExtraitFeature product={extraitProduct} />}
            <ProductSection eyebrow="Artisanal Perfumes" title="Hand-Crafted Masterpieces" description="Small-batch creations from independent perfumers, each a singular vision." products={artisanal} onQuickView={openQuickView} onViewAll={openShop} onViewProduct={openPdp} />
            <div id="section-bestsellers"><ProductSection eyebrow="Best Sellers" title="Loved By Thousands" description="The fragrances our patrons return for, again and again." products={bestSellers} onQuickView={openQuickView} icon="flame" bg="cream" onViewAll={openShop} onViewProduct={openPdp} /></div>
            <ProductSection eyebrow="Fresh Arrivals" title="Just Landed" description="The newest additions to our curated atelier." products={newArrivals} onQuickView={openQuickView} onViewAll={openShop} onViewProduct={openPdp} />
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
      <CartDrawer promos={promos} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
      <ProductQuickView product={quickView} open={qvOpen} onOpenChange={setQvOpen} onQuickView={openQuickView} related={related} />
      <FragranceQuiz products={allProducts} />
      <LiveChat />
      <NewsletterPopup />
      <AuthDialog />
      <WishlistDrawer />
    </div>
  );
}
