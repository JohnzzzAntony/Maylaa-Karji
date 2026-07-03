"use client";

import { useState, useMemo, useEffect } from "react";
import type { SerializedProduct } from "@/lib/data";
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
import { useRecentlyViewed } from "@/lib/cart-store";

type Brand = { id: string; name: string; slug: string; country: string; description: string; logoColor: string };
type Category = { id: string; name: string; slug: string; description: string; image: string };

export function HomeClient({
  trending,
  newArrivals,
  exclusive,
  bestSellers,
  artisanal,
  featured,
  brands,
  categories,
}: {
  trending: SerializedProduct[];
  newArrivals: SerializedProduct[];
  exclusive: SerializedProduct[];
  bestSellers: SerializedProduct[];
  artisanal: SerializedProduct[];
  featured: SerializedProduct[];
  brands: Brand[];
  categories: Category[];
}) {
  const [quickView, setQuickView] = useState<SerializedProduct | null>(null);
  const [qvOpen, setQvOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<"home" | "shop">("home");
  const addRecentlyViewed = useRecentlyViewed((s) => s.add);

  const openShop = () => {
    setView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openHome = () => {
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allProducts = useMemo(() => {
    const map = new Map<string, SerializedProduct>();
    [...trending, ...newArrivals, ...exclusive, ...bestSellers, ...artisanal, ...featured].forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [trending, newArrivals, exclusive, bestSellers, artisanal, featured]);

  const openQuickView = (p: SerializedProduct) => {
    setQuickView(p);
    setQvOpen(true);
    addRecentlyViewed(p.id);
  };

  // Track when quick view opens
  useEffect(() => {
    if (quickView) addRecentlyViewed(quickView.id);
  }, [quickView, addRecentlyViewed]);

  const related = useMemo(() => {
    if (!quickView) return [];
    return allProducts.filter((p) => p.id !== quickView.id && (p.category?.slug === quickView.category?.slug || p.brand?.slug === quickView.brand?.slug)).slice(0, 4);
  }, [quickView, allProducts]);

  const extraitProduct = featured[0] ?? bestSellers[0] ?? trending[0];

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollUtilities />
      <AnnouncementBar />
      <Header onOpenSearch={() => setSearchOpen(true)} onOpenMobileMenu={() => setMobileOpen(true)} onShopAll={openShop} onHome={openHome} />

      <main className="flex-1">
        {view === "shop" ? (
          <ShopView products={allProducts} brands={brands} categories={categories} onQuickView={openQuickView} onBack={openHome} />
        ) : (
          <>
            <HeroCarousel featured={featured} />
            <CategoryShowcase categories={categories} />
            <div id="products" />
            <ProductSection
              eyebrow="New & Trending"
              title="The Fragrance Frontier"
              description="The scents everyone's talking about — fresh, modern, and impossible to ignore."
              products={trending}
              onQuickView={openQuickView}
              onViewAll={openShop}
            />
            <SectionDivider label="Curated Exclusives" />
            <ProductSection
              eyebrow="Exclusive Collection"
              title="Reserved For The Few"
              description="Limited allocations and house exclusives you won't find anywhere else."
              products={exclusive}
              onQuickView={openQuickView}
              bg="cream"
              onViewAll={openShop}
            />
            <BrandMarquee brands={brands} />
            {extraitProduct && <ExtraitFeature product={extraitProduct} />}
            <ProductSection
              eyebrow="Artisanal Perfumes"
              title="Hand-Crafted Masterpieces"
              description="Small-batch creations from independent perfumers, each a singular vision."
              products={artisanal}
              onQuickView={openQuickView}
              onViewAll={openShop}
            />
            <ProductSection
              eyebrow="Best Sellers"
              title="Loved By Thousands"
              description="The fragrances our patrons return for, again and again."
              products={bestSellers}
              onQuickView={openQuickView}
              icon="flame"
              bg="cream"
              onViewAll={openShop}
            />
            <ProductSection
              eyebrow="Fresh Arrivals"
              title="Just Landed"
              description="The newest additions to our curated atelier."
              products={newArrivals}
              onQuickView={openQuickView}
              onViewAll={openShop}
            />
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

      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
      <ProductQuickView
        product={quickView}
        open={qvOpen}
        onOpenChange={setQvOpen}
        onQuickView={openQuickView}
        related={related}
      />
      <FragranceQuiz products={allProducts} />
      <LiveChat />
      <NewsletterPopup />
    </div>
  );
}
