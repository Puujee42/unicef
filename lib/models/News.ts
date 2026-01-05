import mongoose, { Schema, model, models } from "mongoose";

const NewsSchema = new Schema(
  {
    title: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    summary: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      mn: { type: String, required: true },
    },
    author: { type: String, default: "Admin" },
    publishedDate: { type: Date, default: Date.now },
    image: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const News = models.News || model("News", NewsSchema);
export default News;
