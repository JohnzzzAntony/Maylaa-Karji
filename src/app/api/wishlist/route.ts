import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions } from "../auth/register/route";

function getUser(req: NextRequest) {
  const token = req.cookies.get("karji-session")?.value;
  return token ? sessions.get(token) : null;
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ items: [] });
  const items = await db.wishlistItem.findMany({
    where: { userId: user.userId },
    include: { product: { include: { brand: true, category: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items: items.map((i) => ({ ...i.product, images: JSON.parse(i.product.images), brand: i.product.brand, category: i.product.category })) });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  try { await db.wishlistItem.create({ data: { userId: user.userId, productId } }); } catch { /* exists */ }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  await db.wishlistItem.deleteMany({ where: { userId: user.userId, productId } });
  return NextResponse.json({ success: true });
}
