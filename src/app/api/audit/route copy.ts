// app/api/audit/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AuditEvent from "@/lib/models/AuditEvent";

export async function GET() {
  try {
    await connectDB();
    const logs = await AuditEvent.find().sort({ timestamp: -1 });
    return NextResponse.json(logs);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { type, title, description, status = "pending", completed = false } = await req.json();

    if (!type || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await AuditEvent.create({
      type,
      title,
      description,
      status,
      completed,
      timestamp: new Date()
    });

    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create audit event" }, { status: 500 });
  }
}
