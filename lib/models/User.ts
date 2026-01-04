import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true }, // The Medical Student ID
    fullName: { type: String, required: true },
    university: { type: String, default: "MNUMS" },
    role: { type: String, default: "member" }, // 'admin', 'member'
    points: { type: Number, default: 0 }, // Gamification for active students
    eventsAttended: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;