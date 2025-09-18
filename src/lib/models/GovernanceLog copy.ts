// lib/models/GovernanceLog.ts
import mongoose, { Schema, model, models } from "mongoose";

const GovernanceLogSchema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  timestamp: { type: Date, default: Date.now },
});

const GovernanceLog = models.GovernanceLog || model("GovernanceLog", GovernanceLogSchema);
export default GovernanceLog;
