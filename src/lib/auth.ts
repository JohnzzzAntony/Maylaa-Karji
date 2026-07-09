import { NextRequest } from "next/server";
import { supabase } from "./supabase";
import { db } from "./db";

export async function getCurrentUser(req: NextRequest) {
  const accessToken = req.cookies.get("sb-access-token")?.value;
  if (!accessToken) return null;

  try {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(accessToken);
    if (error || !supabaseUser) return null;

    const user = await db.user.findUnique({ where: { id: supabaseUser.id } });
    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}
