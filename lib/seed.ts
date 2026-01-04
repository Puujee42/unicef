import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Event from "./models/Events"; // Adjust path if your models are elsewhere

// Load environment variables from .env.local
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// --- OCEAN & SKY PALETTE ---
const BRAND = {
  sky: "#00aeef",
  ocean: "#005691",
  deep: "#001829",
  foam: "#e0f2fe",
  white: "#ffffff",
  gold: "#fbbf24", // Added for fundraisers
  teal: "#2dd4bf", // Added for campaigns
  rose: "#f43f5e"  // Added for workshops
};

const seedEvents = async () => {
  try {
    // 1. Connect to Database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    // 2. Clear existing events (Optional: remove this if you want to append)
    console.log("Clearing existing events...");
    await Event.deleteMany({});

    // 3. Define the Seed Data
    const eventsToInsert = [
      {
        title: { 
          en: "Youth Leadership Summit 2025", 
          mn: "Залуучуудын Манлайллын Чуулган 2025" 
        },
        description: {
          en: "Empowering the next generation of changemakers. Join 500+ students for a weekend of leadership workshops and networking.",
          mn: "Ирээдүйн өөрчлөлтийг бүтээгчдийг чадавхжуулах. 500+ оюутан залуус цугларч манлайллын ур чадварт суралцана."
        },
        // Converted "24 OCT" to Date object
        date: new Date("2025-10-24T09:00:00.000Z"), 
        timeString: "09:00 - 18:00",
        location: { 
          en: "Shangri-La, Ulaanbaatar", 
          mn: "Шангри-Ла, Улаанбаатар" 
        },
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop",
        category: "campaign",
        status: "upcoming",
        featured: true,
        // Optional: If you updated your Event Schema to include color
        color: BRAND.sky 
      },
      {
        title: { 
          en: "Book Donation Drive", 
          mn: "Номын Хандивын Аян" 
        },
        description: {
          en: "Help us collect 1,000 books for rural schools in Khovd province. Bring your old textbooks and fiction books.",
          mn: "Ховд аймгийн хөдөөгийн сургуулиудад 1,000 ном цуглуулах аянд нэгдээрэй."
        },
        // Converted "05 NOV" to Date
        date: new Date("2025-11-05T10:00:00.000Z"),
        timeString: "All Day",
        location: { 
          en: "MNUMS Campus", 
          mn: "АШУҮИС Кампус" 
        },
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
        category: "fundraiser",
        status: "upcoming",
        featured: false,
        color: BRAND.white
      },
      {
        title: { 
          en: "Mental Health Workshop", 
          mn: "Сэтгэл Зүйн Эрүүл Мэнд" 
        },
        description: {
          en: "A safe space to discuss student burnout and stress management techniques with professional psychologists.",
          mn: "Оюутны сэтгэл зүйн эрүүл мэнд, стресс менежментийн талаар мэргэжлийн сэтгэл зүйчтэй ярилцана."
        },
        // Converted "12 NOV" to Date
        date: new Date("2025-11-12T14:00:00.000Z"),
        timeString: "14:00 - 16:00",
        location: { 
          en: "Library Hall 404", 
          mn: "Номын Сан 404" 
        },
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
        category: "workshop",
        status: "upcoming",
        featured: false,
        color: BRAND.ocean
      },
      {
        title: { 
          en: "Clean Air For Kids", 
          mn: "Цэвэр Агаар - Хүүхдэд" 
        },
        description: {
          en: "Distributing masks and air filters to kindergartens in the ger districts to protect children from pollution.",
          mn: "Гэр хорооллын цэцэрлэгүүдэд маск, агаар шүүгч тарааж бяцхан дүүсээ хамгаалах аян."
        },
        // Converted "01 DEC" to Date
        date: new Date("2025-12-01T10:00:00.000Z"),
        timeString: "10:00 - 13:00",
        location: { 
          en: "Sukhbaatar District", 
          mn: "Сүхбаатар Дүүрэг" 
        },
        image: "https://images.unsplash.com/photo-1461301214746-1e790926d323?q=80&w=2070&auto=format&fit=crop",
        category: "campaign",
        status: "upcoming",
        featured: true,
        color: BRAND.sky
      }
    ];

    // 4. Insert Data
    console.log(`Seeding ${eventsToInsert.length} events...`);
    await Event.insertMany(eventsToInsert);

    console.log("✅ Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // 5. Close Connection
    await mongoose.connection.close();
    console.log("Connection closed.");
    process.exit(0);
  }
};

seedEvents();