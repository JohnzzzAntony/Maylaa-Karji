import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const collections = await db.collection.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({
    collections: collections.map((c) => ({ ...c, productIds: JSON.parse(c.productIds) })),
  });
}
