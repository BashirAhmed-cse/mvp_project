// models/User.ts
import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // store hashed password
  role: { type: String, default: "user" }
}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;
