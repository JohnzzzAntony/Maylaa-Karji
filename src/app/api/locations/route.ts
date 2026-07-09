import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const locations = await db.storeLocation.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ locations });
}
