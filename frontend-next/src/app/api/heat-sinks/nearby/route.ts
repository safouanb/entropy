import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dataCenterId = searchParams.get("data_center_id");
    const maxDistanceKm = searchParams.get("max_distance_km");
    const limit = searchParams.get("limit");

    if (!dataCenterId || !maxDistanceKm) {
      return NextResponse.json(
        { code: "invalid_argument", message: "data_center_id and max_distance_km are required" },
        { status: 400 }
      );
    }

    const response = await predictionService.listNearbyHeatSinks(
      parseInt(dataCenterId),
      parseFloat(maxDistanceKm),
      limit ? parseInt(limit) : undefined
    );

    return NextResponse.json({ items: response.heatSinks });
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to fetch nearby heat sinks" },
      { status: 500 }
    );
  }
}
