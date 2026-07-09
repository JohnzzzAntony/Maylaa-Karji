import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("sb-access-token")?.value;
    if (accessToken) {
      await supabase.auth.signOut();
    }
  } catch {}

  const res = NextResponse.json({ success: true });
  res.cookies.delete("sb-access-token");
  res.cookies.delete("sb-refresh-token");
  return res;
}
