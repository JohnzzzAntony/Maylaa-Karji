import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    const pages = await db.cmsPage.findMany({ where: { isPublished: true }, select: { id: true, title: true, slug: true }, orderBy: { title: "asc" } });
    return NextResponse.json({ pages });
  }
  const page = await db.cmsPage.findUnique({ where: { slug } });
  if (!page || !page.isPublished) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page });
}
