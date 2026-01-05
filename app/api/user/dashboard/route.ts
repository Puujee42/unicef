import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";
import Event from "@/lib/models/Events"; 

export async function GET(req: Request) {
  try {
    await connectToDB();

    // 1. Get Logged In User from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch User Data from MongoDB
    let user = await User.findOne({ clerkId: clerkUser.id });

    // --- FIX: SELF-HEALING MECHANISM ---
    // If user exists in Clerk but NOT in MongoDB, create them now.
    if (!user) {
      console.log("User missing in MongoDB. Auto-creating from Clerk Metadata...");
      
      const metadata = clerkUser.unsafeMetadata;

      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        // Fallback to metadata or generic placeholders
        studentId: (metadata?.studentId as string) || "ID-PENDING",
        fullName: (metadata?.fullName as string) || `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        university: "MNUMS",
        role: "member",
        points: 0,
        volunteerHours: 0,
        eventsAttendedCount: 0,
        level: "Volunteer",
        activityHistory: []
      });
    }
    // -----------------------------------

    // 3. Logic to determine Next Level
    let nextLevel = "Leader";
    let targetPoints = 2000;
    const currentPoints = user.points || 0;
    
    if (currentPoints >= 2000) {
      nextLevel = "Ambassador";
      targetPoints = 5000;
    }

    // 4. Fetch the single next Upcoming Event
    const nextEvent = await Event.findOne({ 
      date: { $gte: new Date() }, // Future dates only
      status: 'upcoming'
    })
    .sort({ date: 1 }) // Closest date first
    .select('title date timeString location category');

    // 5. Construct the Response Object safely
    const dashboardData = {
      profile: {
        studentId: user.studentId,
        role: user.role,
        fullName: user.fullName
      },
      stats: {
        points: currentPoints,
        level: user.level || "Volunteer",
        nextLevel: nextLevel,
        targetPoints: targetPoints,
        hours: user.volunteerHours || 0,
        eventsAttended: user.eventsAttendedCount || 0,
        badges: user.badges || [],
      },
      // Check if activityHistory exists before sorting
      recentActivity: user.activityHistory && user.activityHistory.length > 0
        ? user.activityHistory
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
        : [],
      nextEvent: nextEvent || null
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}