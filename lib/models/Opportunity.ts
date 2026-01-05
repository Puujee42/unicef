import mongoose, { Schema, model, models } from "mongoose";

const OpportunitySchema = new Schema(
  {
    type: { 
      type: String, 
      enum: ['scholarship', 'internship', 'volunteer'],
      required: true 
    },
    title: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    provider: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    location: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    deadline: { type: String, required: true }, // Keeping as string for simplicity or ISO date
    postedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    description: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    requirements: {
      en: [{ type: String }],
      mn: [{ type: String }],
    },
    tags: [{ type: String }],
    link: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Opportunity = models.Opportunity || model("Opportunity", OpportunitySchema);
export default Opportunity;
