import { NextResponse } from "next/server";
import { MOCK_OPPORTUNITIES } from "@/lib/data/mockOpportunities";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const opportunity = MOCK_OPPORTUNITIES.find((opp) => opp.id === id);

    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(opportunity, { status: 200 });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
