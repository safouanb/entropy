import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("page_size");

    const response = await predictionService.listHeatSinks({
      page: page ? parseInt(page) : undefined,
      page_size: pageSize ? parseInt(pageSize) : undefined,
    });

    return NextResponse.json({
      items: response.heat_sinks,
      pagination: response.pagination,
    });
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to fetch heat sinks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await predictionService.createHeatSink(body);
    return NextResponse.json(response.heat_sink, { status: 201 });
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to create heat sink" },
      { status: 500 }
    );
  }
}
