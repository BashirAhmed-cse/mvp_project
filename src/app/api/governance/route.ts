import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GovernanceLog from "@/lib/models/GovernanceLog";

export async function GET() {
  await connectDB();
  const logs = await GovernanceLog.find().sort({ timestamp: -1 });
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  await connectDB();
  const { event } = await req.json();
  const newLog = await GovernanceLog.create({
    event: event || "Unknown event",
    timestamp: new Date().toISOString(),
  });
  return NextResponse.json(newLog);
}