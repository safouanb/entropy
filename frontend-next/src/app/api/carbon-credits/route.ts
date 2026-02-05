import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("page_size");

    const response = await predictionService.listCarbonCredits({
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });

    return NextResponse.json({
      items: response.carbonCredits,
      pagination: response.pagination,
    });
  } catch (error) {
    // Return empty list instead of 500 when backend unavailable
    console.error("Carbon credits fetch failed:", error instanceof BackendError ? error.message : error);
    return NextResponse.json({
      items: [],
      pagination: { total: 0, page: 1, pageSize: 10 },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await predictionService.createCarbonCredit(body);
    return NextResponse.json(response.carbonCredit, { status: 201 });
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to create carbon credit" },
      { status: 500 }
    );
  }
}
