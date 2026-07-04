import { getAllProducts, getBrands, getCategories } from "@/lib/data";
import { HomeClient } from "@/components/site/home-client";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ admin?: string }> }) {
  const sp = await searchParams;
  if (sp.admin === "1") {
    return <AdminPanel />;
  }

  const [trending, newArrivals, exclusive, bestSellers, artisanal, featured, brands, categories] = await Promise.all([
    getAllProducts({ trending: true, limit: 8 }),
    getAllProducts({ isNew: true, limit: 8 }),
    getAllProducts({ exclusive: true, limit: 8 }),
    getAllProducts({ bestSeller: true, limit: 8 }),
    getAllProducts({ artisanal: true, limit: 8 }),
    getAllProducts({ featured: true, limit: 8 }),
    getBrands(),
    getCategories(),
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
    />
  );
}
