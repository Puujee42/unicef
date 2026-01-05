import mongoose, { Schema, model, models } from "mongoose";

// Sub-schema for Activity History to keep things organized
const ActivitySchema = new Schema({
  type: { type: String, required: true }, // 'Event', 'Donation', 'Workshop'
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  points: { type: Number, required: true },
  status: { type: String, enum: ['completed', 'verified', 'pending'], default: 'completed' }
});

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    fullName: { type: String, required: true },
    university: { type: String, default: "MNUMS" },
    role: { type: String, default: "member" },
    
    // --- Dashboard Specific Stats ---
    points: { type: Number, default: 0 },
    volunteerHours: { type: Number, default: 0 },
    eventsAttendedCount: { type: Number, default: 0 },
    level: { type: String, default: "Volunteer" }, // 'Volunteer', 'Leader', 'Ambassador'
    badges: [{ type: String }], // Array of strings e.g. ["Early Bird"]
    
    // Recent Activity History
    activityHistory: [ActivitySchema],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;