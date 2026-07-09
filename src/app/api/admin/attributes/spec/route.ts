import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const attributes = await db.specificationAttribute.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ attributes });
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
    
    const attribute = await db.specificationAttribute.create({
      data: { name, description },
    });
    return NextResponse.json({ attribute });
  } catch (error: any) {
    console.error("Create specification attribute error:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    
    const attribute = await db.specificationAttribute.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json({ attribute });
  } catch (error: any) {
    console.error("Update specification attribute error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
  await db.specificationAttribute.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
