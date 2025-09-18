import mongoose, { Schema, model, models } from "mongoose";

export interface IAuditEvent {
  type: string;            // e.g., "lender-pull", "freeze", "normal"
  title: string;           // Short title
  description: string;     // Detailed description
  status: "pending" | "completed"; // Event status
  completed: boolean;      // True if completed
  timestamp: Date;         // UTC timestamp
}

const AuditEventSchema = new Schema<IAuditEvent>({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  completed: { type: Boolean, default: false },
  timestamp: { type: Date, default: () => new Date() },
}, { timestamps: true });

const AuditEvent = models.AuditEvent || model<IAuditEvent>("AuditEvent", AuditEventSchema);
export default AuditEvent;
