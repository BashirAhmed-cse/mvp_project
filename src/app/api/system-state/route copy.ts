// app/api/system-state/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SystemState from "@/lib/models/SystemState";

export async function GET() {
  await connectDB();
  const states = await SystemState.find().sort({ timestamp: -1 }); // return all
  return NextResponse.json(states);
}

export async function POST(req: Request) {
  await connectDB();
  const { title, description, status } = await req.json();
  const newState = await SystemState.create({ title, description, status });
  return NextResponse.json(newState);
}

// optional: PUT for updating by ID
export async function PUT(req: Request) {
  await connectDB();
  const { _id, title, description, status } = await req.json();
  const updated = await SystemState.findByIdAndUpdate(_id, { title, description, status }, { new: true });
  return NextResponse.json(updated);
}
