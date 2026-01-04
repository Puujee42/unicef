import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    await connectToDB();

    // 1. Get the authenticated user from Clerk (Server side check)
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the metadata sent from the frontend
    const body = await req.json();
    const { fullName, studentId, university } = body;

    // 3. Create or Update the user in MongoDB
    const user = await User.findOneAndUpdate(
      { clerkId: clerkUser.id },
      {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        studentId: studentId,
        fullName: fullName,
        university: university || "MNUMS",
        // We use upsert: true to create if it doesn't exist
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "User synced", user }, { status: 200 });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}