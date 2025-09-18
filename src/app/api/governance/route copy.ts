// app/api/governance/route.ts
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
  const { type, title, description, status } = await req.json();
  const log = await GovernanceLog.create({ type, title, description, status });
  return NextResponse.json(log);
}

export async function PUT(req: Request) {
  await connectDB();
  const { id, type, title, description, status } = await req.json();
  const log = await GovernanceLog.findByIdAndUpdate(id, { type, title, description, status }, { new: true });
  return NextResponse.json(log);
}
