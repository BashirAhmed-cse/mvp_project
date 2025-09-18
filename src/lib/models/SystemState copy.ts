// lib/models/SystemState.ts
import mongoose, { Schema, model, models } from "mongoose";

const SystemStateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["nominal", "warning", "critical"], default: "nominal" },
  timestamp: { type: Date, default: Date.now },
});

const SystemState = models.SystemState || model("SystemState", SystemStateSchema);
export default SystemState;
