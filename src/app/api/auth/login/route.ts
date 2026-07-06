import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, sessions } from "../register/route";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.password !== hashPassword(password)) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { userId: user.id, email: user.email, name: user.name, role: user.role });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  res.cookies.set("karji-session", token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}
