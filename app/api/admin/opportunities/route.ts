import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Opportunity from "@/lib/models/Opportunity";
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
    const opportunities = await Opportunity.find({}).sort({ createdAt: -1 });
    return NextResponse.json(opportunities, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch opportunities", error);
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const formData = await request.formData();
    
    const titleEn = formData.get("titleEn") as string;
    const titleMn = formData.get("titleMn") as string;
    const providerEn = formData.get("providerEn") as string;
    const providerMn = formData.get("providerMn") as string;
    const locationEn = formData.get("locEn") as string;
    const locationMn = formData.get("locMn") as string;
    const descEn = formData.get("descEn") as string;
    const descMn = formData.get("descMn") as string;
    const type = formData.get("type") as string;
    const deadline = formData.get("deadline") as string;
    const link = formData.get("link") as string;
    const tags = (formData.get("tags") as string).split(',').map(t => t.trim());
    const reqEn = (formData.get("reqEn") as string).split('\n').filter(r => r.trim());
    const reqMn = (formData.get("reqMn") as string).split('\n').filter(r => r.trim());
    const imageFile = formData.get("image") as File;

    let imageUrl = "";
    if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'unicef_opportunities' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
        imageUrl = uploadResult.secure_url;
    }

    const newOpp = await Opportunity.create({
        type,
        title: { en: titleEn, mn: titleMn },
        provider: { en: providerEn, mn: providerMn },
        location: { en: locationEn, mn: locationMn },
        description: { en: descEn, mn: descMn },
        deadline,
        link,
        tags,
        requirements: { en: reqEn, mn: reqMn },
        image: imageUrl
    });

    return NextResponse.json(newOpp, { status: 201 });
  } catch (error) {
    console.error("Failed to create opportunity", error);
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        await connectToDB();
        const formData = await request.formData();
        const id = formData.get("id") as string;
        
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const titleEn = formData.get("titleEn") as string;
        const titleMn = formData.get("titleMn") as string;
        const providerEn = formData.get("providerEn") as string;
        const providerMn = formData.get("providerMn") as string;
        const locationEn = formData.get("locEn") as string;
        const locationMn = formData.get("locMn") as string;
        const descEn = formData.get("descEn") as string;
        const descMn = formData.get("descMn") as string;
        const type = formData.get("type") as string;
        const deadline = formData.get("deadline") as string;
        const link = formData.get("link") as string;
        const tags = (formData.get("tags") as string).split(',').map(t => t.trim());
        const reqEn = (formData.get("reqEn") as string).split('\n').filter(r => r.trim());
        const reqMn = (formData.get("reqMn") as string).split('\n').filter(r => r.trim());
        const imageFile = formData.get("image") as File;

        const updateData: any = {
            type,
            title: { en: titleEn, mn: titleMn },
            provider: { en: providerEn, mn: providerMn },
            location: { en: locationEn, mn: locationMn },
            description: { en: descEn, mn: descMn },
            deadline,
            link,
            tags,
            requirements: { en: reqEn, mn: reqMn },
        };

        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'unicef_opportunities' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            updateData.image = uploadResult.secure_url;
        }

        const updatedOpp = await Opportunity.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedOpp, { status: 200 });

    } catch (error) {
        console.error("Failed to update opportunity", error);
        return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await Opportunity.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
