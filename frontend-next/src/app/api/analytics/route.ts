import { NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await predictionService.getPredictionAnalytics();
    return NextResponse.json(response.predictionAnalytics);
  } catch (error) {
    // Return empty analytics instead of 500 when backend unavailable
    console.error("Analytics fetch failed:", error instanceof BackendError ? error.message : error);
    return NextResponse.json({
      totalPredictions: 0,
      averageSavings: 0,
      totalCo2Avoided: 0
    });
  }
}
