import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function verifyAdmin(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await db.configSetting.findMany({ orderBy: { group: "asc" } });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, value } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const setting = await db.configSetting.update({ where: { id }, data: { value } });
  return NextResponse.json({ setting });
}

export async function POST(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const setting = await db.configSetting.create({ data: { key: b.key, value: b.value || "", label: b.label || b.key, group: b.group || "general" } });
  return NextResponse.json({ setting });
}

export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db.configSetting.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
