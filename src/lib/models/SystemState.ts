import mongoose, { Schema, model, models } from "mongoose";

const SystemStateSchema = new Schema({
  mode: { type: String, required: true, default: "normal" },
  nav: { type: Number, required: true, default: 1000000 },
  liquidity: { type: Number, required: true, default: 50 },
  timestamp: { type: String, required: true, default: () => new Date().toISOString() },
});

const SystemState = models.SystemState || model("SystemState", SystemStateSchema);
export default SystemState;