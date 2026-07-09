import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  try {
    const sub = await db.newsletterSubscriber.create({ data: { email } });
    return NextResponse.json({ success: true, id: sub.id });
  } catch {
    return NextResponse.json({ success: true, message: "Already subscribed" });
  }
}
