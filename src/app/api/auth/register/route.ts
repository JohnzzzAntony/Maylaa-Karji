import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash, randomBytes } from "crypto";

export const sessions = new Map<string, { userId: string; email: string; name: string; role: string }>();

export function hashPassword(pw: string): string {
  return createHash("sha256").update(pw + "karji-salt").digest("hex");
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!email || !password || !name) return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const user = await db.user.create({ data: { name, email, password: hashPassword(password), role: "customer" } });
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { userId: user.id, email: user.email, name: user.name, role: user.role });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  res.cookies.set("karji-session", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}
