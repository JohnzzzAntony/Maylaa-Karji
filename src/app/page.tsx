import { getAllProducts, getBrands, getCategories } from "@/lib/data";
import { db } from "@/lib/db";
import { HomeClient } from "@/components/site/home-client";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ admin?: string }> }) {
  const sp = await searchParams;
  if (sp.admin === "1") {
    return <AdminPanel />;
  }

  const [trending, newArrivals, exclusive, bestSellers, artisanal, featured, brands, categories, promos, banners, ads, bogoOffers] = await Promise.all([
    getAllProducts({ trending: true, limit: 8 }),
    getAllProducts({ isNew: true, limit: 8 }),
    getAllProducts({ exclusive: true, limit: 8 }),
    getAllProducts({ bestSeller: true, limit: 8 }),
    getAllProducts({ artisanal: true, limit: 8 }),
    getAllProducts({ featured: true, limit: 8 }),
    getBrands(),
    getCategories(),
    db.promotion.findMany({ where: { isActive: true }, select: { id: true, code: true, type: true, value: true, minSpend: true } }),
    db.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: { id: true, title: true, subtitle: true, image: true, link: true, position: true } }),
    db.advertisement.findMany({ where: { isActive: true }, select: { id: true, title: true, image: true, link: true, placement: true } }),
    db.bogoOffer.findMany({ where: { isActive: true }, select: { id: true, title: true, description: true, buyQty: true, getQty: true, discountPct: true } }),
  ]);

  return (
    <HomeClient
      trending={trending}
      newArrivals={newArrivals}
      exclusive={exclusive}
      bestSellers={bestSellers}
      artisanal={artisanal}
      featured={featured}
      brands={brands}
      categories={categories}
      promos={promos}
      banners={banners}
      ads={ads}
      bogoOffers={bogoOffers}
    />
  );
}
