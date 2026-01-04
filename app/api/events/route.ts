import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Event from "@/lib/models/Events";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch all events (with optional filtering)
export async function GET(req: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let query = {};
    if (category && category !== 'all') {
      query = { category };
    }

    // Sort by date (newest first)
    const events = await Event.find(query).sort({ date: 1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST: Create a new event (Protected: Members/Admins only)
export async function POST(req: Request) {
  try {
    // 1. Check Auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    
    const body = await req.json();
    
    // In a real app, you would check if User.findOne({ clerkId: userId }).role === 'admin'
    
    const newEvent = await Event.create(body);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}