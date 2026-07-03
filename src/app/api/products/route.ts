import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/data";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const products = await getAllProducts({
    category: sp.get("category") || undefined,
    brand: sp.get("brand") || undefined,
    trending: sp.get("trending") === "true",
    exclusive: sp.get("exclusive") === "true",
    bestSeller: sp.get("bestSeller") === "true",
    artisanal: sp.get("artisanal") === "true",
    featured: sp.get("featured") === "true",
    isNew: sp.get("isNew") === "true",
    search: sp.get("search") || undefined,
    sort: (sp.get("sort") as "newest" | "price-asc" | "price-desc" | "rating" | "popular") || undefined,
    limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
  });
  return NextResponse.json({ products });
}
