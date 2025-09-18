import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SystemState from "../../../lib/models/SystemState";

export async function GET() {
  await connectDB();
  let state = await SystemState.findOne();

  if (!state) {
    state = await SystemState.create({ nav: 100, liquidity: 50, status: "normal" });
  }

  // Simulate random drift in "normal" mode
  if (state.status === "normal") {
    state.nav += (Math.random() - 0.5) * 0.5;
    state.liquidity += (Math.random() - 0.5) * 0.5;
    await state.save();
  }

  return NextResponse.json(state);
}

export async function POST(req: Request) {
  await connectDB();
  const { type } = await req.json();
  let state = await SystemState.findOne();

  if (!state) state = await SystemState.create({ nav: 100, liquidity: 50, status: "normal" });

  if (type === "reset") {
    state.nav = 100;
    state.liquidity = 50;
    state.status = "normal";
  } else {
    state.nav = 50;        // crisis targets
    state.liquidity = 20;
    state.status = "crisis";
  }

  await state.save();
  return NextResponse.json(state);
}
