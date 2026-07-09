import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const supabaseUser = data.user;
    const session = data.session;

    if (!supabaseUser || !session) {
      return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
    }

    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Sync user profile if not exists
      user = await db.user.create({
        data: {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata.name || "Customer",
          email,
          password: "",
          role: "customer",
        },
      });
    }

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
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
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred" }, { status: 500 });
  }
}
