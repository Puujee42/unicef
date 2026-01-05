import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";

// --- FIXED HELPER ---
// Checks Clerk Public Metadata AND MongoDB for robust auth
async function isAdmin() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) return false;

  // 1. Check metadata directly (Fastest)
  if (clerkUser.publicMetadata?.role === 'admin') {
    return true;
  }

  // 2. Fallback: Check MongoDB (Source of Truth)
  // Useful if you manually edited the DB but Clerk metadata isn't synced yet
  await connectToDB();
  const dbUser = await User.findOne({ clerkId: clerkUser.id });
  return dbUser?.role === 'admin';
}

export async function GET() {
  // 1. Check Admin Auth
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Connect to DB (Required since we removed it from isAdmin)
  await connectToDB();

  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  await connectToDB();

  try {
    const body = await req.json();
    const { userId, action, badgeName } = body;

    if (action === 'assign_badge') {
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { $addToSet: { badges: badgeName } }, // $addToSet prevents duplicates
        { new: true }
      );
      return NextResponse.json(updatedUser);
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  await connectToDB();
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Note: This only deletes from MongoDB.
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}