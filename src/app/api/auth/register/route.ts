import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Sign up using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const supabaseUser = data.user;
    if (!supabaseUser) {
      return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }

    // Save profile in our Postgres database with Supabase user ID
    const user = await db.user.create({
      data: {
        id: supabaseUser.id,
        name,
        email,
        password: "", // Handled by Supabase Auth
        role: "customer",
      },
    });

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    const session = data.session;
    if (session) {
      res.cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      res.cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred" }, { status: 500 });
  }
}
