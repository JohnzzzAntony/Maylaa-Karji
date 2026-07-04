import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.configSetting.findMany({ orderBy: { group: "asc" } });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const { id, value } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const setting = await db.configSetting.update({ where: { id }, data: { value } });
  return NextResponse.json({ setting });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const setting = await db.configSetting.create({ data: { key: b.key, value: b.value || "", label: b.label || b.key, group: b.group || "general" } });
  return NextResponse.json({ setting });
}
