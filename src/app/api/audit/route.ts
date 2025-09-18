import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/lib/models/AuditLog";

export async function GET() {
  await connectDB();
  const logs = await AuditLog.find().sort({ timestamp: -1 });
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  await connectDB();
  const { type, event } = await req.json();
  const newLog = await AuditLog.create({
    type: type || "unknown",
    event: event || "Unknown event",
    timestamp: new Date().toISOString(),
  });
  return NextResponse.json(newLog);
}