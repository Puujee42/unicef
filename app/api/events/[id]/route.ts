import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Event from "@/lib/models/Events";
import User from "@/lib/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDB();
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    await connectToDB();

    // 1. Find the user in our DB
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 3. Check if already registered
    if (event.attendees.includes(user._id)) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 });
    }

    // 4. Update Event Attendees
    event.attendees.push(user._id);
    await event.save();

    // 5. Update User Activity History
    user.activityHistory.push({
      type: 'Event',
      title: event.title.en,
      date: new Date(),
      points: 10, // Default points for registration
      status: 'pending'
    });
    
    // Increment events count
    user.eventsAttendedCount += 1;
    await user.save();

    return NextResponse.json({ success: true, message: "Successfully joined event" }, { status: 200 });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
