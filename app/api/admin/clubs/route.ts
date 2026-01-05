import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Club from "@/lib/models/Club";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectToDB();
    const clubs = await Club.find({}).sort({ createdAt: -1 });
    return NextResponse.json(clubs, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch clubs", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const formData = await request.formData();
    
    const clubId = formData.get("clubId") as string;
    const nameEn = formData.get("nameEn") as string;
    const nameMn = formData.get("nameMn") as string;
    const descEn = formData.get("descEn") as string;
    const descMn = formData.get("descMn") as string;
    const website = formData.get("website") as string;
    const email = formData.get("email") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl = "";
    if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'unicef_clubs' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
        imageUrl = uploadResult.secure_url;
    }

    const newClub = await Club.create({
        clubId,
        name: { en: nameEn, mn: nameMn },
        description: { en: descEn, mn: descMn },
        website,
        email,
        image: imageUrl
    });

    return NextResponse.json(newClub, { status: 201 });
  } catch (error) {
    console.error("Failed to create club", error);
    return NextResponse.json({ error: "Failed to create club" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        await connectToDB();
        const formData = await request.formData();
        const id = formData.get("id") as string;
        
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const clubId = formData.get("clubId") as string;
        const nameEn = formData.get("nameEn") as string;
        const nameMn = formData.get("nameMn") as string;
        const descEn = formData.get("descEn") as string;
        const descMn = formData.get("descMn") as string;
        const website = formData.get("website") as string;
        const email = formData.get("email") as string;
        const imageFile = formData.get("image") as File;

        const updateData: any = {
            clubId,
            name: { en: nameEn, mn: nameMn },
            description: { en: descEn, mn: descMn },
            website,
            email
        };

        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'unicef_clubs' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            updateData.image = uploadResult.secure_url;
        }

        const updatedClub = await Club.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedClub, { status: 200 });

    } catch (error) {
        console.error("Failed to update club", error);
        return NextResponse.json({ error: "Failed to update club" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await Club.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
