import { NextRequest, NextResponse } from "next/server";
import { predictionService, BackendError } from "@/lib/backend-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("page_size");
    const dataCenterId = searchParams.get("data_center_id");
    const scenarioName = searchParams.get("scenario_name");

    const response = await predictionService.listPredictionResults({
      pagination: {
        page: page ? parseInt(page) : undefined,
        page_size: pageSize ? parseInt(pageSize) : undefined,
      },
      data_center_id: dataCenterId ? parseInt(dataCenterId) : undefined,
      scenario_name: scenarioName || undefined,
    });

    return NextResponse.json({
      items: response.prediction_results,
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
      { code: "internal", message: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}
