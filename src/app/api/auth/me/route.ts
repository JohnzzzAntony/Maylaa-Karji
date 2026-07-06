import { NextRequest, NextResponse } from "next/server";
import { sessions } from "../register/route";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("karji-session")?.value;
  if (!token) return NextResponse.json({ user: null });
  const session = sessions.get(token);
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({ user: session });
}
