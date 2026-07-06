import { NextRequest, NextResponse } from "next/server";
import { sessions } from "../register/route";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("karji-session")?.value;
  if (token) sessions.delete(token);
  const res = NextResponse.json({ success: true });
  res.cookies.delete("karji-session");
  return res;
}
