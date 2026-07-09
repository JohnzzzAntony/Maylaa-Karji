import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const brands = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  revalidatePath("/");
  return NextResponse.json({ brands });
}

export async function POST(req: NextRequest) {
  try {
    const { name, country, description, logoColor } = await req.json();
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    const brand = await db.brand.create({
      data: {
        name,
        slug,
        country: country || "Unknown",
        description: description || "",
        logoColor: logoColor || "#B8935A",
      },
    });
    revalidatePath("/");
  return NextResponse.json({ brand });
  } catch (error: any) {
    console.error("Create brand error:", error);
    return NextResponse.json({ error: "Create brand failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, country, description, logoColor } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    
    const update: any = {};
    if (name) {
      update.name = name;
      update.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (country !== undefined) update.country = country;
    if (description !== undefined) update.description = description;
    if (logoColor !== undefined) update.logoColor = logoColor;
    
    const brand = await db.brand.update({
      where: { id },
      data: update,
    });
    revalidatePath("/");
  return NextResponse.json({ brand });
  } catch (error: any) {
    console.error("Update brand error:", error);
    return NextResponse.json({ error: "Update brand failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
  const count = await db.product.count({ where: { brandId: id } });
  if (count > 0) {
    return NextResponse.json({ error: "Cannot delete brand because it contains active products" }, { status: 400 });
  }
  
  await db.brand.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
