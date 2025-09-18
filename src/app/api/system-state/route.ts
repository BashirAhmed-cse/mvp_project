import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SystemState from "@/lib/models/SystemState";

export async function GET() {
  await connectDB();
  const states = await SystemState.find().sort({ timestamp: -1 });
  return NextResponse.json(states);
}

export async function POST(req: Request) {
  await connectDB();
  const { mode, nav, liquidity } = await req.json();
  const newState = await SystemState.create({
    mode: mode || "normal",
    nav: typeof nav === "number" ? nav : 1000000,
    liquidity: typeof liquidity === "number" ? liquidity : 50,
    timestamp: new Date().toISOString(),
  });
  return NextResponse.json(newState);
}

export async function PUT(req: Request) {
  await connectDB();
  const { _id, mode, nav, liquidity } = await req.json();
  const updated = await SystemState.findByIdAndUpdate(
    _id,
    {
      mode: mode || "normal",
      nav: typeof nav === "number" ? nav : 1000000,
      liquidity: typeof liquidity === "number" ? liquidity : 50,
      timestamp: new Date().toISOString(),
    },
    { new: true }
  );
  return NextResponse.json(updated);
}