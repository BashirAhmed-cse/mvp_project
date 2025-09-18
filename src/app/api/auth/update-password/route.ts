import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const { newPassword } = await req.json();
    if (!newPassword) return NextResponse.json({ error: "Password is required" }, { status: 400 });

    await connectDB();

    // Assuming admin has role: "admin"
    const admin = await User.findOne({ role: "admin" });
    if (!admin) return NextResponse.json({ error: "Admin user not found" }, { status: 404 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    return NextResponse.json({ success: true, message: "Admin password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
