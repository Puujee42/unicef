import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";
import Event from "@/lib/models/Events";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDB();

    // 1. Aggregate Members by University
    const memberStats = await User.aggregate([
      {
        $group: {
          _id: "$university",
          count: { $sum: 1 }
        }
      }
    ]);

    // 2. Aggregate Events by University and Status
    // We want to know: 
    // - How many events total?
    // - Specific list of upcoming events (titles) for "Current Initiatives"
    
    const eventsList = await Event.find({}, 'university status title category date');
    
    // Process events in JS to group them (easier than complex multi-facet aggregation for this scale)
    const clubData: Record<string, any> = {};

    // Initialize with member counts
    memberStats.forEach((stat: any) => {
      const uniId = stat._id || "MNUMS"; // Default fallback
      if (!clubData[uniId]) {
        clubData[uniId] = { members: 0, activity: "medium", currentEvents: [], pastEventsCount: 0, totalEvents: 0 };
      }
      clubData[uniId].members = stat.count;
    });

    // Process events
    eventsList.forEach((ev: any) => {
      const uniId = ev.university || "MNUMS";
      if (!clubData[uniId]) {
        clubData[uniId] = { members: 0, activity: "inactive", currentEvents: [], pastEventsCount: 0, totalEvents: 0 };
      }

      clubData[uniId].totalEvents += 1;

      if (ev.status === 'upcoming') {
        // Add to current events list (limit to 3 titles later if needed)
        // Storing full object or just title? UI uses string array currently.
        // Let's store title.
        // Prefer English title if available, else first available
        const title = ev.title?.en || ev.title?.mn || "Untitled Event";
        clubData[uniId].currentEvents.push(title);
      } else if (ev.status === 'past' || ev.status === 'completed') {
        clubData[uniId].pastEventsCount += 1;
      }
    });

    // Determine "Activity" level based on scores
    // Logic: Members * 1 + Events * 5 ? Or just simple thresholds.
    Object.keys(clubData).forEach(key => {
      const data = clubData[key];
      // Limit current events to 2-3 for display
      data.currentEvents = data.currentEvents.slice(0, 3);
      
      const score = data.members + (data.totalEvents * 5);
      if (score > 100) data.activity = "very high";
      else if (score > 50) data.activity = "high";
      else if (score > 10) data.activity = "medium";
      else data.activity = "low";
      
      // If 0 members and 0 events, inactive
      if (data.members === 0 && data.totalEvents === 0) data.activity = "inactive";
    });

    return NextResponse.json(clubData, { status: 200 });
  } catch (error) {
    console.error("Error fetching club stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
