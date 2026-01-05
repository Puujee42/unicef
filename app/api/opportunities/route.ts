import { NextResponse } from "next/server";
import { MOCK_OPPORTUNITIES } from "@/lib/data/mockOpportunities";

export async function GET() {
  return NextResponse.json(MOCK_OPPORTUNITIES, { status: 200 });
}
