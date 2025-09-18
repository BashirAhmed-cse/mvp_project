// app/api/audit/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AuditEvent from "@/lib/models/AuditEvent";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    // Allowed fields to update
    const allowedFields = ["title", "description", "status", "completed"];
    const updateData: any = {};
    for (let field of allowedFields) {
      if (field in body) updateData[field] = body[field];
    }

    const updatedEvent = await AuditEvent.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEvent) return NextResponse.json({ error: "Audit event not found" }, { status: 404 });

    return NextResponse.json(updatedEvent);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update audit event" }, { status: 500 });
  }
}
