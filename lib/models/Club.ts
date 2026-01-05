import mongoose, { Schema, model, models } from "mongoose";

const ClubSchema = new Schema(
  {
    clubId: { type: String, required: true, unique: true }, // e.g., "NUM", "MNUMS"
    name: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    description: {
      en: { type: String },
      mn: { type: String },
    },
    image: { type: String },
    website: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

const Club = models.Club || model("Club", ClubSchema);
export default Club;
