import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.data_center_id || !body.scenario_name) {
      return NextResponse.json(
        { code: "invalid_argument", message: "data_center_id and scenario_name are required" },
        { status: 400 }
      );
    }

    const response = await predictionService.calculatePrediction({
      data_center_id: body.data_center_id,
      carbon_credit_id: body.carbon_credit_id,
      heat_sink_ids: body.heat_sink_ids,
      scenario_name: body.scenario_name,
      analysis_years: body.analysis_years || 10,
      discount_rate: body.discount_rate || 0.08,
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
