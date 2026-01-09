import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.dataCenterId || !body.scenarioName) {
      return NextResponse.json(
        { code: "invalid_argument", message: "dataCenterId and scenarioName are required" },
        { status: 400 }
      );
    }

    const response = await predictionService.calculatePrediction({
      dataCenterId: body.dataCenterId,
      carbonCreditId: body.carbonCreditId,
      heatSinkIds: body.heatSinkIds,
      scenarioName: body.scenarioName,
      analysisYears: body.analysisYears || 10,
      discountRate: body.discountRate || 0.08,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { code: "internal", message: "Failed to calculate prediction" },
      { status: 500 }
    );
  }
}
