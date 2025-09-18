import mongoose, { Schema, model, models } from "mongoose";

const GovernanceLogSchema = new Schema({
  event: { type: String, required: true },
  timestamp: { type: String, required: true, default: () => new Date().toISOString() },
});

const GovernanceLog = models.GovernanceLog || model("GovernanceLog", GovernanceLogSchema);
export default GovernanceLog;