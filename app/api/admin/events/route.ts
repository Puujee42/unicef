import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/db";
import Event from "@/lib/models/Events";
import User from "@/lib/models/User";
import { v2 as cloudinary } from 'cloudinary';

// --- CONFIG CLOUDINARY ---
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- HELPER: CHECK ADMIN ---
async function isAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) return false;

  // 1. Check metadata (Fastest)
  if (clerkUser.publicMetadata?.role === 'admin') return true;

  // 2. Fallback: Check DB
  await connectToDB();
  const dbUser = await User.findOne({ clerkId: clerkUser.id });
  return dbUser?.role === 'admin';
}

// --- GET EVENTS (PUBLIC ACCESS) ---
export async function GET() {
  // REMOVED THE ADMIN CHECK HERE so everyone can see events
  try {
    await connectToDB();
    const events = await Event.find({}).sort({ date: 1 }); // Sort by upcoming
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// --- POST EVENT (PROTECTED) ---
export async function POST(req: Request) {
  try {
    // Keep Admin check for WRITING data
    if (!await isAdmin()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    
    const imageFile = formData.get("image") as File | null;
    const titleEn = formData.get("titleEn") as string;
    const titleMn = formData.get("titleMn") as string;

    if (!imageFile || !titleEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upload to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'unicef_club_events',
      resource_type: 'image',
    });

    const imageUrl = uploadResponse.secure_url;

    await connectToDB();
    
    const newEvent = await Event.create({
      title: { en: titleEn, mn: titleMn },
      description: { en: formData.get("descEn"), mn: formData.get("descMn") },
      date: new Date(formData.get("date") as string),
      timeString: formData.get("timeString"),
      location: { en: formData.get("locEn"), mn: formData.get("locMn") },
      image: imageUrl, 
      category: formData.get("category"),
      status: 'upcoming'
    });

    return NextResponse.json(newEvent, { status: 201 });

  } catch (error: any) {
    console.error("Event Create Error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}

// --- PUT EVENT (PROTECTED) ---
export async function PUT(req: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
        return NextResponse.json({ error: "Event ID required for update" }, { status: 400 });
    }

    const updateData: any = {
        title: { 
            en: formData.get("titleEn"), 
            mn: formData.get("titleMn") 
        },
        description: { 
            en: formData.get("descEn"), 
            mn: formData.get("descMn") 
        },
        date: new Date(formData.get("date") as string),
        timeString: formData.get("timeString"),
        location: { 
            en: formData.get("locEn"), 
            mn: formData.get("locMn") 
        },
        category: formData.get("category"),
    };

    const imageFile = formData.get("image");
    
    if (imageFile && imageFile instanceof File) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileBase64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

        const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
          folder: 'unicef_club_events',
          resource_type: 'image',
        });
        
        updateData.image = uploadResponse.secure_url;
    }

    await connectToDB();
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEvent) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });

  } catch (error: any) {
    console.error("Event Update Error:", error);
    return NextResponse.json({ error: "Update failed: " + error.message }, { status: 500 });
  }
}

// --- DELETE EVENT (PROTECTED) ---
export async function DELETE(req: Request) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  await connectToDB();
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await Event.findByIdAndDelete(id);
  
  return NextResponse.json({ success: true });
}