import mongoose, { Schema, model, models } from "mongoose";

const AuditLogSchema = new Schema({
  type: { type: String, required: true },
  event: { type: String, required: true },
  timestamp: { type: String, required: true, default: () => new Date().toISOString() },
});

const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);
export default AuditLog;