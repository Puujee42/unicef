import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import News from "@/lib/models/News";
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
    const news = await News.find({}).sort({ publishedDate: -1 });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch news", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const formData = await request.formData();
    
    const titleEn = formData.get("titleEn") as string;
    const titleMn = formData.get("titleMn") as string;
    const summaryEn = formData.get("summaryEn") as string;
    const summaryMn = formData.get("summaryMn") as string;
    const contentEn = formData.get("contentEn") as string;
    const contentMn = formData.get("contentMn") as string;
    const author = formData.get("author") as string;
    const tags = (formData.get("tags") as string).split(',').map(t => t.trim());
    const featured = formData.get("featured") === 'true';
    const imageFile = formData.get("image") as File;

    let imageUrl = "";
    if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'unicef_news' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
        imageUrl = uploadResult.secure_url;
    }

    const newArticle = await News.create({
        title: { en: titleEn, mn: titleMn },
        summary: { en: summaryEn, mn: summaryMn },
        content: { en: contentEn, mn: contentMn },
        author,
        tags,
        featured,
        image: imageUrl
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Failed to create news", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
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
        const summaryEn = formData.get("summaryEn") as string;
        const summaryMn = formData.get("summaryMn") as string;
        const contentEn = formData.get("contentEn") as string;
        const contentMn = formData.get("contentMn") as string;
        const tags = (formData.get("tags") as string).split(',').map(t => t.trim());
        const featured = formData.get("featured") === 'true';
        const imageFile = formData.get("image") as File;

        const updateData: any = {
            title: { en: titleEn, mn: titleMn },
            summary: { en: summaryEn, mn: summaryMn },
            content: { en: contentEn, mn: contentMn },
            tags,
            featured
        };

        if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'unicef_news' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            updateData.image = uploadResult.secure_url;
        }

        const updatedArticle = await News.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedArticle, { status: 200 });

    } catch (error) {
        console.error("Failed to update news", error);
        return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await News.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
