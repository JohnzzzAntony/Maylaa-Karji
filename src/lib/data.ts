import { db } from "@/lib/db";

export type ProductWithRelations = Awaited<ReturnType<typeof getProductBySlug>>;

export async function getAllProducts(filters?: {
  category?: string;
  brand?: string;
  trending?: boolean;
  exclusive?: boolean;
  bestSeller?: boolean;
  artisanal?: boolean;
  featured?: boolean;
  isNew?: boolean;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  limit?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.category) {
    where.category = { slug: filters.category };
  }
  if (filters?.brand) {
    where.brand = { slug: filters.brand };
  }
  if (filters?.trending) where.isTrending = true;
  if (filters?.exclusive) where.isExclusive = true;
  if (filters?.bestSeller) where.isBestSeller = true;
  if (filters?.artisanal) where.isArtisanal = true;
  if (filters?.featured) where.isFeatured = true;
  if (filters?.isNew) where.isNew = true;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (filters?.sort === "price-asc") orderBy = { price: "asc" };
  else if (filters?.sort === "price-desc") orderBy = { price: "desc" };
  else if (filters?.sort === "rating") orderBy = { rating: "desc" };
  else if (filters?.sort === "popular") orderBy = { reviewCount: "desc" };

  const products = await db.product.findMany({
    where,
    include: { brand: true, category: true },
    orderBy,
    take: filters?.limit,
  });

  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true, category: true, reviews: { orderBy: { createdAt: "desc" }, take: 6 } },
  });
  if (!product) return null;
  return serializeProduct(product);
}

export async function getRelatedProducts(slug: string, limit = 4) {
  const product = await db.product.findUnique({ where: { slug }, select: { categoryId: true, brandId: true } });
  if (!product) return [];
  const related = await db.product.findMany({
    where: {
      slug: { not: slug },
      OR: [{ categoryId: product.categoryId }, { brandId: product.brandId }],
    },
    include: { brand: true, category: true },
    take: limit,
  });
  return related.map(serializeProduct);
}

export async function getBrands() {
  return db.brand.findMany({ orderBy: { name: "asc" } });
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

// Convert DB types (images stored as JSON string) into friendly shape
export function serializeProduct(p: {
  id: string; name: string; slug: string; description: string; longDescription: string;
  price: number; compareAtPrice: number | null; currency: string; size: number; sizeUnit: string;
  concentration: string; topNotes: string; heartNotes: string; baseNotes: string; images: string; variants: string;
  rating: number; reviewCount: number; stock: number; sku: string; badge: string | null; gender: string;
  isTrending: boolean; isExclusive: boolean; isBestSeller: boolean; isArtisanal: boolean; isFeatured: boolean; isNew: boolean;
  brand?: { id: string; name: string; slug: string; country: string; description: string; logoColor: string };
  category?: { id: string; name: string; slug: string; description: string; image: string };
  reviews?: Array<{ id: string; author: string; rating: number; title: string; content: string; verified: boolean; location: string | null; createdAt: Date }>;
}) {
  return {
    ...p,
    images: JSON.parse(p.images) as string[],
    variants: (function() { try { return JSON.parse(p.variants || "[]") as Array<{size: number, price: number, stock: number, sku: string, image?: string}>; } catch { return []; } })(),
    compareAtPrice: p.compareAtPrice ?? null,
    badge: p.badge ?? null,
    brand: p.brand ?? undefined,
    category: p.category ?? undefined,
    reviews: p.reviews?.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  };
}

export type SerializedProduct = ReturnType<typeof serializeProduct>;
