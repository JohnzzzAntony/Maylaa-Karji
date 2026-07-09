import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, scentPreference, scentMood, location, callbackMethod, message } = body;

    if (!name || !email || !phone || !location || !message) {
      return NextResponse.json({ error: "Name, Email, Phone, Boutique Location, and Message are required." }, { status: 400 });
    }

    const newEnquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      scentPreference: scentPreference || "Unsure",
      scentMood: scentMood || "Neutral",
      location,
      callbackMethod: callbackMethod || "email",
      message,
      createdAt: new Date().toISOString(),
    };

    // Save locally
    const uploadDir = path.join(process.cwd(), "upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, "enquiries.json");
    let enquiries = [];
    if (fs.existsSync(filePath)) {
      try {
        enquiries = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {
        enquiries = [];
      }
    }
    enquiries.push(newEnquiry);
    fs.writeFileSync(filePath, JSON.stringify(enquiries, null, 2), "utf-8");

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (error) {
    console.error("Enquiry submit error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
