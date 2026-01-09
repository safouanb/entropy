import { NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export async function GET() {
  try {
    const response = await predictionService.getPredictionAnalytics();
    // Backend returns camelCase (protobuf JSON serialization)
    return NextResponse.json(response.predictionAnalytics);
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
