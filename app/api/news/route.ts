import { NextResponse } from "next/server";
import { connectToDB} from "@/lib/db";
import News from "@/lib/models/News";

export async function GET() {
  try {
    await connectToDB();
    const news = await News.find({}).sort({ publishedDate: -1 });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch news", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
